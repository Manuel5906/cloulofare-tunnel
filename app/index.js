const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { spawn, exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    const auth = { login: "admin", password: "darkcore2026" };
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    if (login === auth.login && password === auth.password) return next();
    res.set('WWW-Authenticate', 'Basic realm="Acceso Requerido"');
    res.status(401).send('Autenticación fallida');
});

const DB_PATH = path.join(__dirname, 'sis', 'tunnels_db.json');
const esWindows = os.platform() === 'win32';

if (!fs.existsSync('./sis')) fs.mkdirSync('./sis', { recursive: true });

let tuneles = {};

if (fs.existsSync(DB_PATH)) {
    try {
        tuneles = JSON.parse(fs.readFileSync(DB_PATH));
        Object.keys(tuneles).forEach(id => {
            tuneles[id].status = 'offline';
            tuneles[id].proceso = null;
            tuneles[id].logs = "";
        });
    } catch (e) { tuneles = {}; }
}

function guardarDB() {
    const copia = {};
    Object.keys(tuneles).forEach(id => {
        const { proceso, logs, ...datos } = tuneles[id];
        copia[id] = datos;
    });
    fs.writeFileSync(DB_PATH, JSON.stringify(copia, null, 2));
}

function esTokenSeguro(token) {
    return /^[a-zA-Z0-9._-]+$/.test(token);
}

function extraerToken(input) {
    if (input.includes('--token')) return input.split('--token')[1].trim().split(' ')[0];
    if (input.includes('install')) {
        const partes = input.split(/\s+/);
        return partes[partes.length - 1].trim();
    }
    return input.trim();
}

const emitirLista = () => {
    const dataParaEnviar = Object.values(tuneles).map(({proceso, logs, ...t}) => t);
    io.emit('lista-actualizada', dataParaEnviar);
};

app.post('/api/run', (req, res) => {
    const { rawInput, idExistente } = req.body;
    let token = idExistente ? tuneles[idExistente].rawToken : extraerToken(rawInput);

    if (!esTokenSeguro(token)) return res.status(400).json({ status: "error", message: "Token inválido" });

    let id = idExistente || `Tunnel ${Object.keys(tuneles).length + 1}`;
    if (tuneles[id]?.status === 'online') return res.json({ status: "error", message: "Ya en ejecución" });

    const cmd = esWindows ? (fs.existsSync('./cloudflared.exe') ? '.\\cloudflared.exe' : 'cloudflared') : 'cloudflared';
    const proceso = spawn(cmd, ['tunnel', '--no-autoupdate', 'run', '--token', token]);

    tuneles[id] = {
        id,
        inicio: new Date().toLocaleTimeString(),
        token: token.substring(0, 10) + "...",
        rawToken: token,
        proceso,
        status: 'online',
        logs: ""
    };

    proceso.stderr.on('data', (data) => {
        const linea = data.toString();
        if (tuneles[id]) {
            tuneles[id].logs = (tuneles[id].logs + linea).slice(-1000);
            io.emit('log-update', { id, msg: linea });
        }
    });

    proceso.on('exit', () => {
        if (tuneles[id]) {
            tuneles[id].status = 'offline';
            tuneles[id].proceso = null;
            emitirLista();
        }
    });

    guardarDB();
    emitirLista();
    res.json({ status: "success", id });
});

app.post('/api/stop', (req, res) => {
    const { id } = req.body;
    const tunel = tuneles[id];
    if (tunel?.proceso) {
        try {
            esWindows ? exec(`taskkill /pid ${tunel.proceso.pid} /f /t`) : process.kill(tunel.proceso.pid, 'SIGKILL');
        } catch (e) {}
    }
    res.json({ ok: true });
});

app.post('/api/remove', (req, res) => {
    const { id } = req.body;
    if (tuneles[id]) {
        if (tuneles[id].proceso) {
            try {
                esWindows ? exec(`taskkill /pid ${tuneles[id].proceso.pid} /f /t`) : process.kill(tuneles[id].proceso.pid, 'SIGKILL');
            } catch(e) {}
        }
        delete tuneles[id];
        guardarDB();
        emitirLista();
    }
    res.json({ ok: true });
});

setInterval(() => {
    io.emit('sys-stats', {
        cpu: (os.loadavg()[0]).toFixed(2),
        mem: ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(2) + " GB",
        uptime: Math.floor(os.uptime() / 3600) + "h",
        tunnels: Object.values(tuneles).filter(t => t.status === 'online').length
    });
}, 3000);

io.on('connection', () => emitirLista());

const PORT = 3006;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`DASHBOARD: http://localhost:${PORT}`);
});
