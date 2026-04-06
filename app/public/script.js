const socket = io();
const gridActivos = document.getElementById('grid');
const gridBaul = document.getElementById('baul-grid'); 

function renderizarTodo(tunnels) {
    if (!gridActivos) return;
    gridActivos.innerHTML = '';
    if (gridBaul) gridBaul.innerHTML = '';

    const activos = tunnels.filter(t => t.status === 'online');
    const guardados = tunnels.filter(t => t.status === 'offline');

    if (activos.length === 0) {
        gridActivos.innerHTML = `<div class="empty-msg">No hay nodos activos</div>`;
    } else {
        activos.forEach(t => gridActivos.appendChild(crearCard(t, true)));
    }

    if (gridBaul) {
        if (guardados.length === 0) {
            gridBaul.innerHTML = `<p style="text-align:center; color:#94a3b8; font-size:13px; padding:20px;">Baúl vacío</p>`;
        } else {
            guardados.forEach(t => gridBaul.appendChild(crearCard(t, false)));
        }
    }
}

function crearCard(t, isOnline) {
    const card = document.createElement('div');
    const safeId = t.id.replace(/\s+/g, '-');
    card.className = `t-card ${!isOnline ? 'offline-style' : ''}`;
    card.id = `card-${safeId}`;
    
    card.innerHTML = `
        <div class="t-icon" style="background: ${isOnline ? '#ecfdf5' : '#f1f5f9'}; color: ${isOnline ? '#10b981' : '#94a3b8'}">
            <i class="fa-solid ${isOnline ? 'fa-link' : 'fa-box-archive'}"></i>
        </div>
        <div class="t-details">
            <h4>${t.id} ${isOnline ? '<span class="badge-online">●</span>' : ''}</h4>
            <p><i class="fa-solid fa-key"></i> ${t.token}</p>
            ${isOnline ? `<div class="mini-logs" id="logs-${safeId}">Esperando logs...</div>` : ''}
        </div>
        <div class="actions">
            ${isOnline ? 
                `<button class="btn-action btn-stop" onclick="stopT('${t.id}')"><i class="fa-solid fa-power-off"></i> Stop</button>` : 
                `<button class="btn-action btn-start" onclick="startT('${t.id}')"><i class="fa-solid fa-play"></i> Start</button>`
            }
            <button class="btn-action btn-remove" onclick="removeT('${t.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    return card;
}

socket.on('lista-actualizada', (tunnels) => {
    renderizarTodo(tunnels);
});

socket.on('log-update', (data) => {
    const logDiv = document.getElementById(`logs-${data.id.replace(/\s+/g, '-')}`);
    if (logDiv) {
        logDiv.innerText = data.msg;
        logDiv.scrollTop = logDiv.scrollHeight;
    }
});

socket.on('sys-stats', (stats) => {
    const cpuEl = document.getElementById('stat-cpu');
    const memEl = document.getElementById('stat-mem');
    if (cpuEl) cpuEl.innerText = stats.cpu + '%';
    if (memEl) memEl.innerText = stats.mem;
});

async function launch() {
    const input = document.getElementById('tokenIn');
    if(!input.value) return;
    
    const res = await fetch('/api/run', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ rawInput: input.value })
    });
    
    const data = await res.json();
    if (data.status === "success") {
        input.value = '';
        show('list', document.querySelector('.nav-link[onclick*="list"]'));
    }
}

async function stopT(id) {
    await fetch('/api/stop', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({id}) 
    });
}

async function startT(id) {
    await fetch('/api/run', { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({idExistente: id}) 
    });
}

async function removeT(id) {
    if(confirm('¿Eliminar definitivamente?')) {
        await fetch('/api/remove', { 
            method: 'POST', 
            headers: {'Content-Type':'application/json'}, 
            body: JSON.stringify({id}) 
        });
    }
}

function show(id, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    if (el) el.classList.add('active');
}

async function syncInitialData() {
    try {
        const response = await fetch('/api/tunnels');
        const data = await response.json();
        renderizarTodo(data);
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', syncInitialData);
