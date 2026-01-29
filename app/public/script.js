const socket = io();
const gridActivos = document.getElementById('grid');
const gridBaul = document.getElementById('baul-grid'); 

// 1. FUNCIÓN DE RENDERIZADO REUTILIZABLE
function renderizarTodo(tunnels) {
    gridActivos.innerHTML = '';
    if(gridBaul) gridBaul.innerHTML = '';

    const activos = tunnels.filter(t => t.status === 'online');
    const guardados = tunnels.filter(t => t.status === 'offline');

    // Nodos Online
    if (activos.length === 0) {
        gridActivos.innerHTML = `<div class="empty-msg">No hay nodos activos</div>`;
    } else {
        activos.forEach(t => gridActivos.appendChild(crearCard(t, true)));
    }

    // Nodos en el Baúl
    if (gridBaul) {
        if (guardados.length === 0) {
            gridBaul.innerHTML = `<p style="text-align:center; color:#94a3b8; font-size:13px; padding:20px;">Baúl vacío</p>`;
        } else {
            guardados.forEach(t => gridBaul.appendChild(crearCard(t, false)));
        }
    }
}

// 2. SINCRONIZACIÓN INICIAL (Al cargar la web)
async function syncInitialData() {
    try {
        const response = await fetch('/api/tunnels'); // Pide la lista al servidor
        const data = await response.json();
        renderizarTodo(data);
    } catch (error) {
        console.error("Error cargando datos iniciales:", error);
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', syncInitialData);

// --- ACTUALIZACIÓN POR SOCKET (En tiempo real) ---
socket.on('lista-actualizada', (tunnels) => {
    renderizarTodo(tunnels);
});

function show(id, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}

async function launch() {
    const input = document.getElementById('tokenIn');
    if(!input.value) return;
    
    await fetch('/api/run', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ rawInput: input.value })
    });
    
    input.value = '';
    show('list', document.querySelector('.nav-link:nth-child(2)'));
}

function crearCard(t, isOnline) {
    const card = document.createElement('div');
    card.className = `t-card ${!isOnline ? 'offline-style' : ''}`;
    
    card.innerHTML = `
        <div class="t-icon" style="background: ${isOnline ? '#ecfdf5' : '#f1f5f9'}; color: ${isOnline ? '#10b981' : '#94a3b8'}">
            <i class="fa-solid ${isOnline ? 'fa-link' : 'fa-box-archive'}"></i>
        </div>
        <div class="t-details">
            <h4>${t.id} ${isOnline ? '<span class="badge-online">●</span>' : ''}</h4>
            <p><i class="fa-solid fa-key"></i> ${t.token}</p>
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

// --- ACCIONES API ---
async function stopT(id) {
    await fetch('/api/stop', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id}) });
}

async function startT(id) {
    await fetch('/api/run', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({idExistente: id}) });
}

async function removeT(id) {
    if(confirm('¿Eliminar definitivamente de la base de datos?')) {
        await fetch('/api/remove', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id}) });
    }
}