const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { exec, spawn } = require('child_process');
const os = require('os');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

const DB_PATH = './sis/tunnels_db.json';
const esWindows = os.platform() === 'win32';

if (!fs.existsSync('./sis')) {
    fs.mkdirSync('./sis', { recursive: true });
}

let tuneles = {};

if (fs.existsSync(DB_PATH)) {
    try {
        const data = fs.readFileSync(DB_PATH);
        const saved = JSON.parse(data);
        Object.keys(saved).forEach(id => {
            saved[id].status = 'offline';
            saved[id].proceso = null;
        });
        tuneles = saved;
    } catch (e) {
        tuneles = {};
    }
}

function guardarDB() {
    const copia = {};
    Object.keys(tuneles).forEach(id => {
        const { proceso, ...datos } = tuneles[id];
        copia[id] = datos;
    });
    fs.writeFileSync(DB_PATH, JSON.stringify(copia, null, 2));
}

function extraerToken(input) {
    if (input.includes('install')) {
        const partes = input.split(/\s+/);
        return partes[partes.length - 1].trim();
    }
    const regex = /--token\s+([a-zA-Z0-9._-]+)/;
    const match = input.match(regex);
    return (match && match[1]) ? match[1].trim() : input.trim();
}

const emitirLista = () => {
    const dataParaEnviar = Object.values(tuneles).map(({proceso, ...t}) => t);
    io.emit('lista-actualizada', dataParaEnviar);
};

io.on('connection', (socket) => {
    emitirLista();
});

app.post('/api/run', (req, res) => {
    const { rawInput, idExistente } = req.body;
    let id = idExistente;
    let token = idExistente ? tuneles[idExistente].rawToken : extraerToken(rawInput);

    if (!id) {
        const count = Object.keys(tuneles).length + 1;
        id = `Tunnel ${count}`;
    }

    if (tuneles[id] && tuneles[id].status === 'online') {
        return res.json({ status: "error", message: "Already running" });
    }

    const cmd = esWindows ? '.\\cloudflared.exe' : 'cloudflared';
    const proceso = spawn(cmd, ['tunnel', 'run', '--token', token], {
        detached: !esWindows, 
        stdio: 'ignore'
    });

    if (!esWindows && proceso.unref) {
        proceso.unref();
    }

    tuneles[id] = { 
        id, 
        inicio: new Date().toLocaleTimeString(), 
        token: token.substring(0, 15) + "...",
        rawToken: token,
        proceso, 
        status: 'online' 
    };

    guardarDB();
    emitirLista();

    proceso.on('exit', () => {
        if (tuneles[id]) {
            tuneles[id].status = 'offline';
            tuneles[id].proceso = null;
            emitirLista();
        }
    });

    res.json({ status: "success", id });
});

app.post('/api/stop', (req, res) => {
    const { id } = req.body;
    const tunel = tuneles[id];

    if (tunel && tunel.proceso) {
        const pid = tunel.proceso.pid;
        try {
            if (esWindows) {
                exec(`taskkill /pid ${pid} /f /t`);
            } else {
                try {
                    process.kill(-pid, 'SIGKILL');
                } catch (e) {
                    process.kill(pid, 'SIGKILL');
                }
            
                exec(`pkill -f "cloudflared.*${tunel.rawToken.substring(0,10)}"`);
            }
            console.log(`🛑 Túnel detenido: ${id}`);
        } catch (e) {
            console.log(`⚠️ Error al detener proceso: ${e.message}`);
        }
    }

    if (tunel) {
        tunel.status = 'offline';
        tunel.proceso = null;
        guardarDB();
        emitirLista();
    }
    res.json({ ok: true });
});

app.post('/api/remove', (req, res) => {
    const { id } = req.body;
    if (tuneles[id]) {
        if (tuneles[id].proceso) {
            try {
                esWindows 
                    ? exec(`taskkill /pid ${tuneles[id].proceso.pid} /f /t`) 
                    : process.kill(-tuneles[id].proceso.pid, 'SIGKILL');
            } catch(e) {}
        }
        delete tuneles[id];
        guardarDB();
        emitirLista();
    }
    res.json({ ok: true });
});

app.get('/api/tunnels', (req, res) => {
    const listaCompleta = Object.values(tuneles).map(({proceso, ...t}) => t);
    res.json(listaCompleta);
});

server.listen(3006, '0.0.0.0', () => {
    console.log("🚀 Dashboard Core: http://localhost:3006");
});