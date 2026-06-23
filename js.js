/* ==========================================================================
   SISTEMA DE NAVEGAÇÃO E MODAIS
   ========================================================================== */
function navTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

/* ==========================================================================
   TELA 0: SENHA DE ACESSO
   ========================================================================== */
let pwdAttempts = 0;
function checkPassword() {
    const input = document.getElementById('pwd-input').value.trim();
    const msg = document.getElementById('pwd-msg');
    
    if (input === "") {
        msg.innerText = "Por favor, digite uma data!";
        return;
    }
    
    if (input === "20/08/2025" || input === "20082025") {
        navTo('screen-biometrics');
    } else {
        pwdAttempts++;
        if (pwdAttempts >= 3) {
            msg.innerText = "ALERTA: Se errar mais uma vez o código do site será deletado automaticamente e você nunca verá a surpresa.";
        } else {
            msg.innerText = "Data incorreta. Tente novamente.";
        }
    }
}

/* ==========================================================================
   TELA 1: BIOMETRIA
   ========================================================================== */
const bioBtn = document.getElementById('fingerprint-btn');
let bioTimer;

const startBio = (e) => {
    e.preventDefault(); 
    bioBtn.classList.add('pressing');
    bioTimer = setTimeout(() => { navTo('screen-menu'); }, 3000); 
};
const stopBio = (e) => {
    e.preventDefault();
    bioBtn.classList.remove('pressing');
    clearTimeout(bioTimer);
};
// Mouse e Touch
bioBtn.addEventListener('touchstart', startBio, {passive: false});
bioBtn.addEventListener('touchend', stopBio);
bioBtn.addEventListener('mousedown', startBio);
bioBtn.addEventListener('mouseup', stopBio);
bioBtn.addEventListener('mouseleave', stopBio);


/* ==========================================================================
   TELA 2: CÉU GALÁCTICO E CONTADOR
   ========================================================================== */
// Data Atualizada Automaticamente
const hoje = new Date();
const dataFormatada = hoje.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'});

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
    { date: `Hoje (${dataFormatada})`, text: "Onde estamos agora, prontos para a próxima fase.", today: true }
];

function initConstellation() {
    const container = document.getElementById('constellation-container');
    container.innerHTML = ''; 
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('constellation-svg');
    container.appendChild(svg);

    let prevPos = null;
    starsData.forEach((star, index) => {
        const starEl = document.createElement('div');
        starEl.classList.add('star');
        if (star.distanced) starEl.classList.add('distanced');
        if (star.today) starEl.classList.add('today');

        const topPercent = 10 + (index * 8); 
        const leftPercent = (index % 2 === 0) ? 20 + Math.random() * 20 : 60 + Math.random() * 20;
        starEl.style.top = `${topPercent}%`; starEl.style.left = `${leftPercent}%`;

        // Explosão ao clicar
        starEl.onclick = () => {
            starEl.classList.add('exploding');
            setTimeout(() => {
                document.getElementById('star-date').innerText = star.date;
                document.getElementById('star-text').innerText = star.text;
                document.getElementById('star-modal').classList.remove('hidden');
                starEl.classList.remove('exploding'); // reseta
            }, 400); // tempo da animação CSS
        };

        const label = document.createElement('div');
        label.classList.add('star-label'); label.innerText = star.date;
        starEl.appendChild(label); container.appendChild(starEl);

        if (prevPos) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', `${prevPos.x}%`); line.setAttribute('y1', `${prevPos.y}%`);
            line.setAttribute('x2', `${leftPercent}%`); line.setAttribute('y2', `${topPercent}%`);
            line.classList.add('constellation-line');
            if (star.distanced || starsData[index-1].distanced) line.classList.add('distanced');
            svg.appendChild(line);
        }
        prevPos = { x: leftPercent, y: topPercent };
    });
}
initConstellation();

// Contador ao vivo
const startDate = new Date('2025-08-20T00:00:00');
setInterval(() => {
    const now = new Date();
    const diff = now - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    document.getElementById('time-display').innerText = `${days}d ${hours}h ${mins}m ${secs}s`;
}, 1000);


/* ==========================================================================
   TELA 3: POLAROIDS (SISTEMA DRAG CORRIGIDO)
   ========================================================================== */
function initPolaroids() {
    const board = document.getElementById('polaroid-board');
    for(let i = 0; i < 10; i++) {
        const p = document.createElement('div');
        p.className = 'polaroid';
        p.style.top = `${Math.random() * 50 + 10}%`;
        p.style.left = `${Math.random() * 40}%`;
        p.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;

        p.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="photo-placeholder"><span>Foto ${i+1}</span></div>
                    <div class="polaroid-caption">Lembrança ${i+1}</div>
                </div>
                <div class="card-back"><p class="poem-text">Poema incrível ${i+1}...</p></div>
            </div>
        `;
        board.appendChild(p);
        
        // Clique (Touch/Mouse rápido) para virar
        p.addEventListener('click', (e) => {
            // Só vira se não tiver arrastado (evitar virar ao soltar o drag)
            if(!p.dataset.dragged) p.classList.toggle('is-flipped');
        });
        
        makeDraggable(p);
    }
}
function makeDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragStart;
    elmnt.ontouchstart = dragStart;

    function dragStart(e) {
        elmnt.dataset.dragged = ""; // reseta flag de arrasto
        if(e.type === 'touchstart') { pos3 = e.touches[0].clientX; pos4 = e.touches[0].clientY; }
        else { pos3 = e.clientX; pos4 = e.clientY; }
        document.onmouseup = dragEnd;
        document.ontouchend = dragEnd;
        document.onmousemove = drag;
        document.ontouchmove = drag;
    }
    function drag(e) {
        elmnt.dataset.dragged = "true"; // Marcou como arrastado
        let clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        let clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        pos1 = pos3 - clientX; pos2 = pos4 - clientY;
        pos3 = clientX; pos4 = clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function dragEnd() {
        document.onmouseup = null; document.onmousemove = null;
        document.ontouchend = null; document.ontouchmove = null;
        // Limpa o arrasto depois de um microsegundo para o click funcionar
        setTimeout(() => elmnt.dataset.dragged = "", 50);
    }
}
initPolaroids();


/* ==========================================================================
   TELA 4: ROLETA DA FORTUNA E COFRE
   ========================================================================== */
let spinsLeft = 3;
let currentDeg = 0;
let prizes = [
    "Massagem Relaxante", "Jantar por Minha Conta", "Vale Mimos Especiais", 
    "Dia de Cinema", "Beijo de Cinema", "Desejo Livre", 
    "Café na Cama", "Vale Abraço Infinito", "Piquenique", "Eu lavo a louça hoje"
];
const validCodes = [];

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');

function spinRoulette() {
    if (spinsLeft <= 0 || prizes.length === 0) return;
    
    spinBtn.disabled = true;
    currentDeg += Math.floor(Math.random() * 360) + 1800;
    wheel.style.transform = `rotate(${currentDeg}deg)`;

    setTimeout(() => {
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        const wonPrize = prizes[prizeIndex];
        prizes.splice(prizeIndex, 1); // Remove para não repetir
        
        const code = "AMOR-" + Math.random().toString(36).substring(2, 6).toUpperCase();
        validCodes.push(code);
        
        document.getElementById('prize-text').innerText = wonPrize;
        document.getElementById('prize-code').innerText = code;
        document.getElementById('prize-modal').classList.remove('hidden');

        spinsLeft--;
        document.getElementById('roulette-status').innerText = `Você tem ${spinsLeft} resgates disponíveis.`;
        if (spinsLeft > 0) spinBtn.disabled = false;
    }, 4000);
}
spinBtn.addEventListener('click', spinRoulette);

function checkVault() {
    const input = document.getElementById('vault-input').value.toUpperCase();
    const msg = document.getElementById('vault-msg');
    if (validCodes.includes(input)) {
        msg.style.color = '#00f5d4'; msg.innerText = "Código Válido! Seu prêmio está guardado no meu coração.";
    } else {
        msg.style.color = '#ff4d4d'; msg.innerText = "Código inválido.";
    }
}


/* ==========================================================================
   TELA 5: TERMÔMETRO DO AMOR
   ========================================================================== */
let tempProgress = 0;
const thermoBar = document.getElementById('temperature');
const tapBtn = document.getElementById('tap-btn');

const fillThermo = (e) => {
    e.preventDefault();
    if (tempProgress >= 100) return;
    tempProgress += 8;
    if(tempProgress > 100) tempProgress = 100;
    
    thermoBar.style.height = `${tempProgress}%`;
    tapBtn.classList.add('shake');
    setTimeout(() => tapBtn.classList.remove('shake'), 100);

    if(tempProgress === 100) {
        tapBtn.innerText = "EXPLODIU DE AMOR!";
        tapBtn.style.background = "#00f5d4";
        tapBtn.style.color = "#011627";
        setTimeout(() => alert("Você tem acesso livre ao meu coração!"), 500);
    }
};
tapBtn.addEventListener('touchstart', fillThermo, {passive: false});
tapBtn.addEventListener('mousedown', fillThermo);

setInterval(() => {
    if (tempProgress > 0 && tempProgress < 100) {
        tempProgress -= 3; thermoBar.style.height = `${tempProgress}%`;
    }
}, 500);


/* ==========================================================================
   TELA 6: RASPADINHA (Mouse e Touch)
   ========================================================================== */
const canvasScratch = document.getElementById('scratch-canvas');
const ctxS = canvasScratch.getContext('2d');
let isDrawing = false;
let scratchPrizes = ["Vale Massagem", "Vale Beijo", "Eu pago a conta!"];
let pickedPrize = scratchPrizes[Math.floor(Math.random() * scratchPrizes.length)];
document.getElementById('scratch-prize').innerText = pickedPrize;

function initScratch() {
    canvasScratch.width = 280; canvasScratch.height = 280;
    ctxS.fillStyle = '#90e0ef';
    ctxS.fillRect(0, 0, canvasScratch.width, canvasScratch.height);
    ctxS.font = '24px Poppins'; ctxS.fillStyle = '#03045e'; ctxS.textAlign = 'center';
    ctxS.fillText('Raspe aqui', 140, 140);
}
initScratch();

function getScratchPos(e) {
    const rect = canvasScratch.getBoundingClientRect();
    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left; y = e.clientY - rect.top;
    }
    return { x, y };
}
const startScratch = (e) => { isDrawing = true; scratchLine(e); };
const stopScratch = () => { isDrawing = false; };
const scratchLine = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getScratchPos(e);
    ctxS.globalCompositeOperation = 'destination-out';
    ctxS.beginPath(); ctxS.arc(pos.x, pos.y, 25, 0, Math.PI * 2); ctxS.fill();
};

canvasScratch.addEventListener('touchstart', startScratch, {passive: false});
canvasScratch.addEventListener('touchmove', scratchLine, {passive: false});
canvasScratch.addEventListener('touchend', stopScratch);
canvasScratch.addEventListener('mousedown', startScratch);
canvasScratch.addEventListener('mousemove', scratchLine);
canvasScratch.addEventListener('mouseup', stopScratch);
canvasScratch.addEventListener('mouseleave', stopScratch);


/* ==========================================================================
   TELA 7: TOCA-DISCOS & YOUTUBE (Oceanos - Djavan)
   ========================================================================== */
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0',
        videoId: '5O6T0B38Y7U', // ID do vídeo Oceanos - Djavan
        events: { 'onReady': onPlayerReady }
    });
}
function onPlayerReady(event) { /* Pronto para tocar */ }

const needle = document.getElementById('needle');
const vinyl = document.getElementById('vinyl');
let recordPlaying = false;
let isDraggingNeedle = false;

// Lógica de arrastar a agulha
const startNeedle = (e) => { isDraggingNeedle = true; e.preventDefault(); };
const moveNeedle = (e) => {
    if(!isDraggingNeedle) return;
    // Ao arrastar pra qualquer lado, rotaciona a agulha para o disco
    needle.style.transform = `rotate(35deg)`; 
};
const stopNeedle = (e) => {
    if(!isDraggingNeedle) return;
    isDraggingNeedle = false;
    // Se soltou e a agulha está no disco (35deg), toca a música
    if (needle.style.transform === 'rotate(35deg)') {
        vinyl.classList.add('playing');
        if(player && player.playVideo) player.playVideo();
        recordPlaying = true;
    }
};
needle.addEventListener('mousedown', startNeedle);
document.addEventListener('mousemove', moveNeedle);
document.addEventListener('mouseup', stopNeedle);
needle.addEventListener('touchstart', startNeedle, {passive: false});
document.addEventListener('touchmove', moveNeedle, {passive: false});
document.addEventListener('touchend', stopNeedle);

// Tocar na agulha para parar/voltar
needle.addEventListener('click', () => {
    if(recordPlaying) {
        needle.style.transform = `rotate(0deg)`;
        vinyl.classList.remove('playing');
        if(player && player.pauseVideo) player.pauseVideo();
        recordPlaying = false;
    }
});


/* ==========================================================================
   TELA 8: POTE DE 100 MOTIVOS (Array de 100 itens únicos)
   ========================================================================== */
const hundredMotives = [
    "Seu sorriso ilumina meu dia.", "Amo o jeito que você me olha.", "Sua risada é minha música favorita.", "Você me faz querer ser melhor.", "Seu abraço é meu lar.", 
    "Amo como você entende meu silêncio.", "Você é minha pessoa favorita no mundo.", "Sua inteligência me fascina.", "O som da sua voz me acalma.", "Você transforma dias comuns em especiais.",
    "Amo sua determinação.", "Seu senso de humor combina com o meu.", "Você me dá paz.", "Amo cada pequeno detalhe do seu rosto.", "Você é a melhor parte do meu dia.", 
    "Sua força me inspira.", "Amo o jeito que você caminha.", "Suas manias são adoráveis.", "Você é meu sonho realizado.", "Amo quando você fala do que gosta.", 
    "Sua companhia é tudo que eu preciso.", "Amo sua honestidade.", "Você me faz rir mesmo quando não quero.", "Amo nosso cafuné.", "Você é minha alma gêmea.", 
    "Seu beijo me leva a outro planeta.", "Amo como nos encaixamos.", "Você tem o melhor coração.", "Amo as nossas brincadeiras.", "Você é incrivelmente linda.", 
    "Amo acordar pensando em você.", "Sua energia é contagiante.", "Amo nossos planos para o futuro.", "Você me entende como ninguém.", "Amo sua empatia.", 
    "Você traz cor pra minha vida.", "Amo suas mensagens de bom dia.", "Amo seu cheiro.", "Você é minha maior sorte.", "Amo as nossas conversas profundas.", 
    "Você me passa segurança.", "Amo sua criatividade.", "Você me faz esquecer dos problemas.", "Amo dormir abraçado com você.", "Você ilumina qualquer lugar que entra.", 
    "Amo seu otimismo.", "Você tem um jeito único de ver a vida.", "Amo nossa parceria.", "Você tira o melhor de mim.", "Amo as nossas piadas internas.", 
    "Você é meu ponto de equilíbrio.", "Amo sua paciência comigo.", "Você é o motivo da minha felicidade.", "Amo como você cuida de mim.", "Você é incrivelmente forte.", 
    "Amo o tom da sua pele.", "Você sempre sabe o que dizer.", "Amo admirar você dormindo.", "Você é a resposta das minhas orações.", "Amo como somos um time.", 
    "Você é minha musa inspiradora.", "Amo o seu gosto musical.", "Você torna a vida mais leve.", "Amo sua autenticidade.", "Você me surpreende a cada dia.", 
    "Amo nossas viagens juntos.", "Você é meu porto seguro.", "Amo sua bondade.", "Você me faz sentir amado de verdade.", "Amo assistir filmes com você.", 
    "Você desperta o melhor em mim.", "Amo sua coragem.", "Você me apoia nos meus sonhos.", "Amo como a gente divide a comida.", "Você me faz acreditar no amor.", 
    "Amo andar de mãos dadas com você.", "Você é o amor da minha vida.", "Amo seu carinho.", "Você me escuta com o coração.", "Amo nosso olhar cúmplice.", 
    "Você me faz sorrir do nada.", "Amo seu jeito doce e selvagem.", "Você é minha prioridade.", "Amo o jeito que você mexe no cabelo.", "Você transforma tudo em mágica.", 
    "Amo nossas madrugadas acordados.", "Você é meu sol.", "Amo sua simplicidade.", "Você é meu maior presente.", "Amo como nossos corações batem juntos.", 
    "Você me completa de todas as formas.", "Amo sua lealdade.", "Você me dá asas para voar.", "Amo a sua história.", "Você é a razão do meu viver.", 
    "Amo quando você fica com vergonha.", "Você é a luz do fim do túnel.", "Amo que somos amigos e namorados.", "Você é tudo o que eu sempre quis.", "Amo amar você."
];

function openPaper() {
    const jar = document.querySelector('.jar');
    jar.style.transform = "rotate(15deg)";
    setTimeout(() => jar.style.transform = "rotate(-15deg)", 100);
    setTimeout(() => jar.style.transform = "rotate(0deg)", 200);

    setTimeout(() => {
        const r = Math.floor(Math.random() * hundredMotives.length);
        document.getElementById('reason-text').innerText = hundredMotives[r];
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

// BOTÃO FUJÃO NOVO E MELHORADO
const btnNao = document.getElementById('btn-nao');
const runaway = (e) => {
    e.preventDefault(); 
    const containerWidth = document.querySelector('.final-buttons').clientWidth;
    const containerHeight = document.querySelector('.final-buttons').clientHeight;
    const newX = Math.random() * (containerWidth - 80);
    const newY = Math.random() * (containerHeight - 50);
    btnNao.style.left = `${newX}px`;
    btnNao.style.top = `${newY}px`;
};
btnNao.addEventListener('touchstart', runaway, {passive: false});
btnNao.addEventListener('mouseover', runaway);


// FOGOS DE ARTIFÍCIO (Com botão de voltar ao final)
function triggerFireworks() {
    const canvasF = document.getElementById('fireworks-canvas');
    const ctxF = canvasF.getContext('2d');
    canvasF.width = window.innerWidth; canvasF.height = window.innerHeight;
    canvasF.style.display = 'block';

    let particles = [];
    function createFirework(x, y) {
        let colors = ['#00b4d8', '#00f5d4', '#90e0ef', '#caf0f8', '#0077b6'];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: x, y: y,
                vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: Math.random() * 30 + 30
            });
        }
    }

    function animateF() {
        ctxF.fillStyle = 'rgba(1, 8, 26, 0.2)'; 
        ctxF.fillRect(0, 0, canvasF.width, canvasF.height);
        
        particles.forEach((p, index) => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life--;
            ctxF.beginPath(); ctxF.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctxF.fillStyle = p.color; ctxF.fill();
            if (p.life <= 0) particles.splice(index, 1);
        });

        if (Math.random() < 0.08) createFirework(Math.random() * canvasF.width, Math.random() * canvasF.height / 2);
        requestAnimationFrame(animateF);
    }
    
    createFirework(canvasF.width / 2, canvasF.height / 2);
    animateF();
    
    document.querySelector('#climax-phase-3 h2').innerText = "Eu sabia que você diria SIM! 💙";
    document.querySelector('.final-buttons').style.display = 'none';
    
    // Mostra o botão de voltar após 2 segundos de fogos
    setTimeout(() => {
        document.getElementById('final-back-btn').classList.remove('hidden');
    }, 2000);
}