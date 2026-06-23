/* ==========================================================================
   SISTEMA DE NAVEGAÇÃO E MODAIS (SPA)
   ========================================================================== */
function navTo(screenId) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    // Mostra a tela desejada
    document.getElementById(screenId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

/* ==========================================================================
   TELA 1: FECHADURA BIOMÉTRICA
   ========================================================================== */
const bioBtn = document.getElementById('fingerprint-btn');
let bioTimer;

const startBio = (e) => {
    e.preventDefault(); // Evita scroll acidental
    bioBtn.classList.add('pressing');
    // Precisa segurar por 3 segundos para "ler a biometria"
    bioTimer = setTimeout(() => {
        navTo('screen-menu');
    }, 3000); 
};

const stopBio = (e) => {
    e.preventDefault();
    bioBtn.classList.remove('pressing');
    clearTimeout(bioTimer);
};

// Eventos de toque para iPhone
bioBtn.addEventListener('touchstart', startBio, {passive: false});
bioBtn.addEventListener('touchend', stopBio);
bioBtn.addEventListener('touchcancel', stopBio);
// Eventos de mouse para teste no PC
bioBtn.addEventListener('mousedown', startBio);
bioBtn.addEventListener('mouseup', stopBio);
bioBtn.addEventListener('mouseleave', stopBio);


/* ==========================================================================
   TELA 2: CÉU GALÁCTICO (Linha do Tempo)
   ========================================================================== */
const starsData = [
    { date: "20 Ago 2025", text: "O dia em que nossos universos colidiram pela primeira vez." },
    { date: "20 Set 2025", text: "Um mês descobrindo o seu sorriso." },
    { date: "20 Out 2025", text: "Quando percebi que queria ficar." },
    { date: "20 Nov 2025", text: "Nossas conversas até de madrugada..." },
    { date: "20 Dez 2025", text: "Um final de ano inesquecível com você." },
    { date: "Jan 2026", text: "O começo do inverno entre nós. O silêncio doeu.", distanced: true },
    { date: "Fev 2026", text: "Mesmo distantes, você nunca saiu dos meus pensamentos.", distanced: true },
    { date: "Mar 2026", text: "A saudade provou que o que temos é real.", distanced: true },
    { date: "20 Abr 2026", text: "O reencontro. A primavera voltou." },
    { date: "20 Mai 2026", text: "Mais fortes, mais maduros, mais apaixonados." },
    { date: "Hoje (19 Jun)", text: "Onde estamos agora, prontos para a próxima fase.", today: true }
];

function initConstellation() {
    const container = document.getElementById('constellation-container');
    container.innerHTML = ''; 
    
    // Cria SVG para as linhas
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('constellation-svg');
    container.appendChild(svg);

    let prevPos = null;

    // Gerar posições aleatórias, mas progressivas de cima para baixo
    starsData.forEach((star, index) => {
        const starEl = document.createElement('div');
        starEl.classList.add('star');
        if (star.distanced) starEl.classList.add('distanced');
        if (star.today) starEl.classList.add('today');

        // Posição na tela (Zigue-zague descendo)
        const topPercent = 10 + (index * 8); 
        const leftPercent = (index % 2 === 0) ? 20 + Math.random() * 20 : 60 + Math.random() * 20;
        
        starEl.style.top = `${topPercent}%`;
        starEl.style.left = `${leftPercent}%`;

        // Interação de abrir modal
        starEl.onclick = () => {
            document.getElementById('star-date').innerText = star.date;
            document.getElementById('star-text').innerText = star.text;
            document.getElementById('star-modal').classList.remove('hidden');
        };

        const label = document.createElement('div');
        label.classList.add('star-label');
        label.innerText = star.date;
        starEl.appendChild(label);
        
        container.appendChild(starEl);

        // Desenha linha conectando com a anterior
        if (prevPos) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', `${prevPos.x}%`);
            line.setAttribute('y1', `${prevPos.y}%`);
            line.setAttribute('x2', `${leftPercent}%`);
            line.setAttribute('y2', `${topPercent}%`);
            line.classList.add('constellation-line');
            if (star.distanced || starsData[index-1].distanced) {
                line.classList.add('distanced');
            }
            svg.appendChild(line);
        }
        prevPos = { x: leftPercent, y: topPercent };
    });
}
// Inicializa o céu logo de cara
initConstellation();


/* ==========================================================================
   TELA 3: MURAL DE POLAROIDS
   ========================================================================== */
const poemas = [
    "Como Machado de Assis diria: 'Cada qual sabe amar a seu modo; o modo, pouco importa; o essencial é que saiba amar'.",
    "Você é a poesia que eu nunca soube escrever, mas que vivo todos os dias.",
    "O amor é o espaço e o tempo tornados sensíveis ao coração. - Marcel Proust",
    "Se eu tivesse que escolher entre te amar e respirar, usaria meu último suspiro para dizer eu te amo.",
    "Com você, descobri que as melhores histórias não estão nos livros, mas nos nossos momentos.",
    "Até os detalhes mais simples se tornam galáxias inteiras quando estou com você.",
    "Você é meu refúgio seguro em um mundo caótico.",
    "Amor é fogo que arde sem se ver... E eu queimo por você a cada instante. - Camões",
    "A distância de Jan a Mar foi apenas um intervalo para afinar nossa melodia.",
    "Nosso amor não é um ponto final, é sempre uma reticência de coisas boas que ainda virão..."
];

function initPolaroids() {
    const board = document.getElementById('polaroid-board');
    for(let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'polaroid';
        // Posição bagunçada
        p.style.top = `${Math.random() * 60 + 10}%`;
        p.style.left = `${Math.random() * 50}%`;
        p.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;

        p.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="photo-placeholder">
                        <span style="position:absolute; z-index:2;">Foto ${i+1}</span>
                        </div>
                    <div class="polaroid-caption">Lembrança ${i+1}</div>
                </div>
                <div class="card-back">
                    <p class="poem-text">"${poemas[i]}"</p>
                </div>
            </div>
        `;
        board.appendChild(p);
        dragElement(p);

        // Toque para virar a carta
        p.addEventListener('click', () => {
            p.classList.toggle('is-flipped');
        });
    }
}
initPolaroids();

// Função para arrastar elementos na tela do iPhone
function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.ontouchstart = dragTouchStart;
    
    function dragTouchStart(e) {
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementTouchDrag;
    }
    function elementTouchDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.touches[0].clientX;
        pos2 = pos4 - e.touches[0].clientY;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}


/* ==========================================================================
   TELA 4: ROLETA DA FORTUNA E COFRE
   ========================================================================== */
let spinsLeft = 3;
let currentDeg = 0;
const prizes = ["Massagem Relaxante", "Jantar por Minha Conta", "Vale Mimos Especiais", "Dia de Cinema", "Beijo de Cinema", "Desejo Livre"];
const validCodes = []; // Armazena os códigos gerados

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');

function spinRoulette() {
    if (spinsLeft <= 0) return;
    
    spinBtn.disabled = true;
    const spinDeg = Math.floor(Math.random() * 360) + 1800; // Gira pelo menos 5 voltas
    currentDeg += spinDeg;
    wheel.style.transform = `rotate(${currentDeg}deg)`;

    setTimeout(() => {
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        const code = "AMOR-" + Math.random().toString(36).substring(2, 6).toUpperCase();
        validCodes.push(code); // Salva para o Cofre
        
        document.getElementById('prize-text').innerText = prizes[prizeIndex];
        document.getElementById('prize-code').innerText = code;
        document.getElementById('prize-modal').classList.remove('hidden');

        spinsLeft--;
        document.getElementById('roulette-status').innerText = `Você tem ${spinsLeft} resgates disponíveis.`;
        if (spinsLeft > 0) spinBtn.disabled = false;
    }, 4000); // Espera a animação acabar
}
spinBtn.addEventListener('click', spinRoulette);

// Lógica do Cofre Secreto
function checkVault() {
    const input = document.getElementById('vault-input').value.toUpperCase();
    const msg = document.getElementById('vault-msg');
    
    if (validCodes.includes(input)) {
        msg.style.color = '#38ef7d';
        msg.innerText = "Código Válido! Preparando seu prêmio para o nosso encontro...";
    } else {
        msg.style.color = '#e63946';
        msg.innerText = "Código inválido ou já utilizado.";
    }
}


/* ==========================================================================
   TELA 5: TERMÔMETRO DO AMOR
   ========================================================================== */
let tempProgress = 0;
const thermoBar = document.getElementById('temperature');
const tapBtn = document.getElementById('tap-btn');

tapBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (tempProgress >= 100) return;
    
    tempProgress += 8; // Sobe rápido
    if(tempProgress > 100) tempProgress = 100;
    
    thermoBar.style.height = `${tempProgress}%`;
    tapBtn.classList.add('shake');
    setTimeout(() => tapBtn.classList.remove('shake'), 100);

    if(tempProgress === 100) {
        tapBtn.innerText = "EXPLODIU DE AMOR!";
        tapBtn.style.background = "#ff416c";
        setTimeout(() => alert("Você tem acesso livre ao meu coração!"), 500);
    }
});

// Decaimento natural (se ela parar de tocar)
setInterval(() => {
    if (tempProgress > 0 && tempProgress < 100) {
        tempProgress -= 3;
        thermoBar.style.height = `${tempProgress}%`;
    }
}, 500);


/* ==========================================================================
   TELA 6: RASPADINHA DO DESTINO
   ========================================================================== */
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// Ajusta o tamanho do canvas para cobrir a área
function initScratch() {
    canvas.width = 280;
    canvas.height = 280;
    // Pinta de cinza metálico
    ctx.fillStyle = '#8a8a99';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Texto por cima do cinza
    ctx.font = '24px Poppins';
    ctx.fillStyle = '#e0e0e0';
    ctx.textAlign = 'center';
    ctx.fillText('Raspe aqui', 140, 140);
}
initScratch();

function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

const scratchStart = (e) => { isDrawing = true; scratch(e); };
const scratchEnd = () => { isDrawing = false; };
const scratch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getTouchPos(e);
    
    // Apaga a cor cinza revelando o fundo
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
    ctx.fill();
};

canvas.addEventListener('touchstart', scratchStart, {passive: false});
canvas.addEventListener('touchmove', scratch, {passive: false});
canvas.addEventListener('touchend', scratchEnd);


/* ==========================================================================
   TELA 7: TOCA-DISCOS
   ========================================================================== */
const needle = document.getElementById('needle');
const vinyl = document.getElementById('vinyl');
let isPlaying = false;

// No iPhone, um toque simples arrasta a agulha automaticamente
document.querySelector('.record-player').addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        needle.classList.add('engaged');
        vinyl.classList.add('playing');
        // Aqui você pode adicionar um áudio
        // let audio = new Audio('sua-musica.mp3'); audio.play();
    } else {
        needle.classList.remove('engaged');
        vinyl.classList.remove('playing');
    }
});


/* ==========================================================================
   TELA 8: POTE DE MOTIVOS
   ========================================================================== */
const motives = [
    "Eu amo o seu sorriso sincero.",
    "Eu amo como você me faz sentir único.",
    "Eu amo o nosso humor que só a gente entende.",
    "Eu amo a sua determinação.",
    "Eu amo o som da sua risada."
];

function openPaper() {
    // Treme o pote um pouquinho antes de abrir
    const jar = document.querySelector('.jar');
    jar.style.transform = "rotate(10deg)";
    setTimeout(() => jar.style.transform = "rotate(-10deg)", 100);
    setTimeout(() => jar.style.transform = "rotate(0deg)", 200);

    setTimeout(() => {
        const r = Math.floor(Math.random() * motives.length);
        document.getElementById('reason-text').innerText = motives[r];
        document.getElementById('paper-modal').classList.remove('hidden');
    }, 300);
}


/* ==========================================================================
   TELA 10: O CLÍMAX & FOGOS DE ARTIFÍCIO
   ========================================================================== */
function nextClimaxPhase() {
    document.getElementById('climax-phase-1').classList.remove('active');
    document.getElementById('climax-phase-1').classList.add('hidden');
    document.getElementById('climax-phase-2').classList.remove('hidden');
    document.getElementById('climax-phase-2').classList.add('active');
}

function finalQuestion() {
    document.getElementById('climax-phase-2').classList.remove('active');
    document.getElementById('climax-phase-2').classList.add('hidden');
    document.getElementById('climax-phase-3').classList.remove('hidden');
    document.getElementById('climax-phase-3').classList.add('active');
}

// O famoso BOTÃO FUJÃO
const btnNao = document.getElementById('btn-nao');
const runaway = (e) => {
    e.preventDefault(); // Evita que ela clique no touch
    const containerWidth = document.querySelector('.final-buttons').clientWidth;
    const containerHeight = document.querySelector('.final-buttons').clientHeight;
    
    // Calcula posições aleatórias dentro do contêiner seguro
    const newX = Math.random() * (containerWidth - 80);
    const newY = Math.random() * (containerHeight - 50);
    
    btnNao.style.left = `${newX}px`;
    btnNao.style.top = `${newY}px`;
};
// Reage ao tentar tocar ou deslizar sobre ele
btnNao.addEventListener('touchstart', runaway, {passive: false});
btnNao.addEventListener('mouseover', runaway);


// FOGOS DE ARTIFÍCIO (Quando ela clicar em SIM)
function triggerFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    let particles = [];
    
    function createFirework(x, y) {
        let colors = ['#ff7597', '#ffdf00', '#38ef7d', '#00b4d8', '#a875ff'];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: Math.random() * 30 + 30
            });
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Rastro visual
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // Gravidade
            p.life--;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            if (p.life <= 0) particles.splice(index, 1);
        });

        // Estoura um novo fogo aleatório automaticamente
        if (Math.random() < 0.05) {
            createFirework(Math.random() * canvas.width, Math.random() * canvas.height / 2);
        }

        requestAnimationFrame(animate);
    }
    
    // O primeiro estouro vem do centro da tela
    createFirework(canvas.width / 2, canvas.height / 2);
    animate();
    
    // Troca o 
    document.querySelector('#climax-phase-3 h2').innerText = "Eu sabia que você diria SIM! ❤️";
    document.querySelector('.final-buttons').style.display = 'none';
}