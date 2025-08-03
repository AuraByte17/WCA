// --- ELEMENTOS DOM ---
const navButtons = document.querySelectorAll('.nav-button');
const seccoes = document.querySelectorAll('.seccao');
const notificationEl = document.getElementById('notification');
const perfilFormView = document.getElementById('perfil-form-view');
const perfilNomeInput = document.getElementById('perfil-nome');
const guardarPerfilBtn = document.getElementById('guardarPerfilBtn');
const perfilPassaporteView = document.getElementById('perfil-passaporte-view');
const editarPerfilBtn = document.getElementById('editarPerfilBtn');
const passaporteNomeSpan = document.getElementById('passaporte-nome');
const passaporteBeltSpan = document.getElementById('passaporte-belt');
const passaportePontosSpan = document.getElementById('passaporte-pontos');
const passaporteStreakSpan = document.getElementById('passaporte-streak');
const passaporteAchievementsSpan = document.getElementById('passaporte-achievements');
const userStatusDisplay = document.getElementById('user-status-display');
const userStatusName = document.getElementById('user-status-name');
const userStatusBelt = document.getElementById('user-status-belt');
const userProgressBarFill = document.getElementById('user-progress-bar-fill');
const userProgressBarText = document.getElementById('user-progress-bar-text');
const wcContainer = document.getElementById('container-treinos-wc');
const conditioningContainer = document.getElementById('container-treinos-condicionamento');
const achievementsGrid = document.getElementById('achievements-grid');
const beltProgressionContainer = document.getElementById('belt-progression-container');
const guideContainer = document.getElementById('container-guia');
const modal = document.getElementById('video-modal');
const modalTitle = document.getElementById('modal-title');
const modalVideoContainer = document.getElementById('modal-video-container');
const closeModalBtn = document.querySelector('.close-modal');
const dailyChallengeCard = document.getElementById('daily-challenge-card');

let userProfile = {};

// --- FUNÇÕES ---

function mostrarSeccao(idSeccao) {
    seccoes.forEach(seccao => seccao.classList.remove('visivel'));
    const seccaoAtiva = document.getElementById(idSeccao);
    if (seccaoAtiva) seccaoAtiva.classList.add('visivel');
    navButtons.forEach(button => button.classList.toggle('active', button.dataset.seccao === idSeccao));
}

function getUserBelt(xp) {
    return BELT_SYSTEM.slice().reverse().find(belt => xp >= belt.minXp) || BELT_SYSTEM[0];
}

function applyBeltTheme(belt) {
    const root = document.documentElement.style;
    root.setProperty('--primary-color', belt.color);
    root.setProperty('--secondary-color', belt.secondaryColor);
}

function updateUI() {
    if (!userProfile.name) {
        userStatusDisplay.style.display = 'none';
        return;
    }

    const currentBelt = getUserBelt(userProfile.xp);
    const nextBelt = BELT_SYSTEM[currentBelt.level + 1];

    applyBeltTheme(currentBelt);

    userStatusDisplay.style.display = 'flex';
    userStatusName.textContent = userProfile.name;
    userStatusBelt.textContent = currentBelt.name;

    if (nextBelt) {
        const xpInCurrentLevel = userProfile.xp - currentBelt.minXp;
        const xpForNextLevel = nextBelt.minXp - currentBelt.minXp;
        const progressPercentage = (xpInCurrentLevel / xpForNextLevel) * 100;
        userProgressBarFill.style.width = `${progressPercentage}%`;
        userProgressBarText.textContent = `${userProfile.xp} / ${nextBelt.minXp} XP`;
    } else {
        userProgressBarFill.style.width = '100%';
        userProgressBarText.textContent = 'Mestria Alcançada';
    }

    passaporteNomeSpan.textContent = userProfile.name;
    passaporteBeltSpan.textContent = currentBelt.name;
    passaportePontosSpan.textContent = userProfile.xp;
    passaporteStreakSpan.textContent = userProfile.streak;
    passaporteAchievementsSpan.textContent = `${userProfile.achievements.length} / ${Object.keys(ACHIEVEMENTS).length}`;

    const unlockedItems = ALL_TRAINING_ITEMS.filter(item => item.requiredBelt <= currentBelt.level);

    renderTrainingList(WING_CHUN_TRAINING, wcContainer, unlockedItems);
    renderTrainingList(CONDITIONING_TRAINING, conditioningContainer, unlockedItems);
    renderBeltProgression();
    renderAchievements();
    renderDailyChallenge();
}

function saveProfile() {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    updateUI();
}

function loadProfile() {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
        perfilFormView.style.display = 'none';
        perfilPassaporteView.style.display = 'block';
    } else {
        userProfile = { name: '', xp: 0, achievements: [], streak: 0, daily: {} };
        perfilFormView.style.display = 'block';
        perfilPassaporteView.style.display = 'none';
    }
    checkDailyChallenge();
    updateUI();
}

function showNotification(text, type = 'normal') {
    notificationEl.textContent = text;
    if(type === 'achievement') {
        notificationEl.textContent = `🏆 ${text}`;
        notificationEl.style.animation = 'pulse 1.5s ease-out';
    }
    notificationEl.style.display = 'block';
    setTimeout(() => {
        notificationEl.style.display = 'none';
        notificationEl.style.animation = '';
    }, 3000);
}

function checkAchievements() {
    Object.keys(ACHIEVEMENTS).forEach(key => {
        if (!userProfile.achievements.includes(key)) {
            if (ACHIEVEMENTS[key].check(userProfile)) {
                userProfile.achievements.push(key);
                showNotification(`Conquista Desbloqueada: ${ACHIEVEMENTS[key].title}`, 'achievement');
            }
        }
    });
}

function completeTraining(xpToAdd, button) {
    const oldBelt = getUserBelt(userProfile.xp);
    userProfile.xp += xpToAdd;
    const newBelt = getUserBelt(userProfile.xp);

    showNotification(`+${xpToAdd} XP!`);

    if (newBelt.level > oldBelt.level) {
        setTimeout(() => {
            showNotification(`Promovido a ${newBelt.name}!`, 'achievement');
        }, 3100);
    }

    checkAchievements();
    saveProfile();
    if (button) {
        button.disabled = true;
        setTimeout(() => { button.disabled = false; }, 3000); // Cooldown
    }
}

function openModal(title, videoId) {
    modalTitle.textContent = title;
    const videoUrl = `https://placehold.co/600x350/111111/ffffff?text=${encodeURIComponent(title)}`;
    modalVideoContainer.innerHTML = `<img src="${videoUrl}" alt="${title}" style="width:100%; height:auto; border-radius: 8px;">`;
    modal.style.display = 'flex';
}

function renderTrainingList(data, container, unlockedItems) {
    container.innerHTML = '';
    let itemsRendered = 0;
    for (const category in data) {
        const categoryItems = data[category].filter(item => unlockedItems.some(unlocked => unlocked.id === item.id));

        if (categoryItems.length === 0) continue;
        itemsRendered += categoryItems.length;

        const categoryEl = document.createElement('div');
        categoryEl.className = 'training-category';
        categoryEl.innerHTML = `<h2 class="subtitulo-seccao">${category}</h2>`;

        const listEl = document.createElement('div');
        listEl.className = 'lista-treinos';

        categoryItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'item-treino';
            const videoPlaceholderUrl = `https://placehold.co/300x150/1a1a1a/555555?text=${encodeURIComponent(item.title)}`;

            itemEl.innerHTML = `
                <div class="item-treino-video">
                    <img src="${videoPlaceholderUrl}" alt="Vídeo para ${item.title}">
                </div>
                <h3 class="item-treino-titulo">${item.title}</h3>
                <p class="item-treino-descricao">${item.description}</p>
                <div class="item-treino-info">
                    <span class="item-treino-xp">+${item.xp} XP</span>
                    <button class="action-button complete-training-btn">Completar</button>
                </div>
            `;

            itemEl.querySelector('.complete-training-btn').addEventListener('click', (e) => {
                completeTraining(item.xp, e.target);
            });
            itemEl.querySelector('.item-treino-video').addEventListener('click', () => {
                openModal(item.title, item.videoPath);
            });

            listEl.appendChild(itemEl);
        });

        categoryEl.appendChild(listEl);
        container.appendChild(categoryEl);
    }
    if (itemsRendered === 0) {
        container.innerHTML = `<p>Não há treinos disponíveis para o teu nível atual. Avança para o próximo cinturão para desbloquear mais!</p>`;
    }
}

function renderBeltProgression() {
    beltProgressionContainer.innerHTML = '';
    BELT_SYSTEM.forEach(belt => {
        const isUnlocked = userProfile.xp >= belt.minXp;
        const card = document.createElement('div');
        card.className = `belt-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        if (isUnlocked) {
            card.style.borderColor = belt.color;
        }

        let requirementHTML = isUnlocked 
            ? `<span class="belt-requirement" style="color: ${belt.color};">DESBLOQUEADO</span>`
            : `<span class="belt-requirement">Requer ${belt.minXp} XP</span>`;

        let contentHTML = '';
        const itemsInBelt = ALL_TRAINING_ITEMS.filter(item => item.requiredBelt === belt.level);
        if (itemsInBelt.length > 0) {
            contentHTML += `<div class="belt-content-title">Conteúdo Desbloqueado:</div><div class="belt-content-grid">`;
            itemsInBelt.forEach(item => {
                contentHTML += `<div class="belt-item"><span class="title">${item.title}</span><span class="xp"> (+${item.xp} XP)</span></div>`;
            });
            contentHTML += `</div>`;
        }

        card.innerHTML = `
            <div class="belt-header">
                <h3 style="color: ${belt.color};">${belt.name}</h3>
                ${requirementHTML}
            </div>
            ${contentHTML}
        `;
        beltProgressionContainer.appendChild(card);
    });
}

function renderAchievements() {
    achievementsGrid.innerHTML = '';
    Object.keys(ACHIEVEMENTS).forEach(key => {
        const ach = ACHIEVEMENTS[key];
        const isUnlocked = userProfile.achievements.includes(key);
        const badgeEl = document.createElement('div');
        badgeEl.className = `achievement-badge ${isUnlocked ? 'unlocked' : ''}`;
        badgeEl.innerHTML = `
            <div class="icon">${ach.icon}</div>
            <h4>${ach.title}</h4>
            <p>${ach.desc}</p>
        `;
        achievementsGrid.appendChild(badgeEl);
    });
}

function renderUltimateGuide() {
    guideContainer.innerHTML = '';
    for (const sectionTitle in ULTIMATE_GUIDE_CONTENT) {
        const sectionData = ULTIMATE_GUIDE_CONTENT[sectionTitle];
        const entryEl = document.createElement('div');
        entryEl.className = 'guide-entry';
        
        let pointsHTML = '';
        if (sectionData.points) {
            pointsHTML = '<ul>';
            sectionData.points.forEach(point => {
                pointsHTML += `<li>${point}</li>`;
            });
            pointsHTML += '</ul>';
        }

        entryEl.innerHTML = `
            <h3>${sectionTitle}</h3>
            <p>${sectionData.text}</p>
            ${pointsHTML}
        `;
        guideContainer.appendChild(entryEl);
    }
}

function checkDailyChallenge() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = userProfile.daily?.date;

    if (today !== lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate === yesterday.toISOString().split('T')[0] && userProfile.daily.completed) {
            // Streak continues
        } else if (lastDate !== today) {
            userProfile.streak = 0;
        }

        const availableChallenges = ALL_TRAINING_ITEMS.filter(item => item.requiredBelt <= getUserBelt(userProfile.xp).level);
        const randomChallenge = availableChallenges.length > 0 ? availableChallenges[Math.floor(Math.random() * availableChallenges.length)] : null;

        userProfile.daily = {
            date: today,
            challenge: randomChallenge,
            completed: false
        };
        saveProfile();
    }
}

function renderDailyChallenge() {
    if (!userProfile.daily || !userProfile.daily.challenge) {
        dailyChallengeCard.innerHTML = `<p>Nenhum desafio disponível. Aumenta de nível para desbloquear mais treinos!</p>`;
        return;
    }
    const { challenge, completed } = userProfile.daily;
    const bonusXp = 50;
    dailyChallengeCard.innerHTML = `
        <div class="streak-counter">🔥 ${userProfile.streak} Dias de Sequência</div>
        <h3>${challenge.title}</h3>
        <p>${challenge.description}</p>
        <button id="complete-daily-btn" class="action-button perfil-action-button" ${completed ? 'disabled' : ''}>
            ${completed ? 'Concluído!' : `Completar por +${bonusXp} XP`}
        </button>
    `;

    if (!completed) {
        document.getElementById('complete-daily-btn').addEventListener('click', (e) => {
            userProfile.daily.completed = true;
            if(!userProfile.streak){
                userProfile.streak = 0;
            }
            userProfile.streak += 1;
            completeTraining(bonusXp, e.target);
        });
    }
}

// --- EVENT LISTENERS E INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    navButtons.forEach(button => {
        button.addEventListener('click', () => mostrarSeccao(button.dataset.seccao));
    });

    guardarPerfilBtn.addEventListener('click', () => {
        const name = perfilNomeInput.value.trim();
        if (name) {
            userProfile.name = name;
            checkAchievements();
            saveProfile();
            perfilFormView.style.display = 'none';
            perfilPassaporteView.style.display = 'block';
        }
    });

    editarPerfilBtn.addEventListener('click', () => {
        perfilFormView.style.display = 'block';
        perfilPassaporteView.style.display = 'none';
    });

    closeModalBtn.onclick = () => { modal.style.display = 'none'; }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    renderUltimateGuide();
    loadProfile();
});
