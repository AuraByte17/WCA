/**
 * uiManager.js
 * * Módulo responsável por toda a manipulação do DOM e atualizações da interface.
 * - Centraliza a busca por elementos do DOM.
 * - Contém todas as funções de renderização para as diferentes secções da app.
 * - Gere a exibição de modais, notificações e a navegação entre as abas.
 * - É chamado pelos outros módulos para refletir as mudanças de estado no ecrã.
 */
import { NAV_ITEMS, COLOR_THEMES, AVATAR_LIST, WING_CHUN_TRAINING, CONDITIONING_TRAINING, GREAT_MASTERS_DATA, THEORY_DATA, GLOSSARY_DATA, BELT_SYSTEM, ACHIEVEMENTS } from './data.js';

// Objeto para guardar referências aos elementos do DOM para acesso rápido.
const elements = {};

/**
 * Mapeia todos os elementos HTML necessários para variáveis no objeto `elements`.
 */
function queryElements() {
    const els = {
        navHub: document.getElementById('navigation-hub'),
        appSidebar: document.getElementById('app-sidebar'),
        seccoes: document.querySelectorAll('.seccao'),
        mobileHeaderTitle: document.getElementById('current-section-title'),
        openMenuBtn: document.getElementById('open-menu-btn'),
        closeMenuBtn: document.getElementById('close-menu-btn'),
        mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
        mainContentArea: document.getElementById('main-content-area'),
        notificationEl: document.getElementById('notification'),
        notificationIcon: document.getElementById('notification-icon'),
        notificationText: document.getElementById('notification-text'),
        perfilFormView: document.getElementById('perfil-form-view'),
        perfilDashboardView: document.getElementById('perfil-dashboard-view'),
        perfilNomeInput: document.getElementById('perfil-nome'),
        perfilAlturaInput: document.getElementById('perfil-altura'),
        perfilPesoInput: document.getElementById('perfil-peso'),
        avatarChoicesGrid: document.getElementById('avatar-choices-grid'),
        formAvatarPreview: document.getElementById('form-avatar-preview'),
        passaporteNomeSpan: document.getElementById('passaporte-nome'),
        passaporteBeltSpan: document.getElementById('passaporte-belt'),
        passaportePontosSpan: document.getElementById('passaporte-pontos'),
        studentIdDisplay: document.getElementById('student-id-display'),
        passaporteAlturaSpan: document.getElementById('passaporte-altura'),
        passaportePesoSpan: document.getElementById('passaporte-peso'),
        passaporteImcSpan: document.getElementById('passaporte-imc'),
        passaporteStreakSpan: document.getElementById('passaporte-streak'),
        passaporteAchievementsSpan: document.getElementById('passaporte-achievements'),
        passaporteAvatarDisplay: document.getElementById('passaporte-avatar-display'),
        userStatusDisplay: document.getElementById('user-status-display'),
        userStatusName: document.getElementById('user-status-name'),
        userStatusBelt: document.getElementById('user-status-belt'),
        userStatusAvatar: document.getElementById('user-status-avatar'),
        userProgressBarFill: document.getElementById('user-progress-bar-fill'),
        userProgressBarText: document.getElementById('user-progress-bar-text'),
        staminaBarFill: document.getElementById('stamina-bar-fill'),
        staminaBarText: document.getElementById('stamina-bar-text'),
        skillContainer: document.getElementById('container-skill'),
        conditioningContainer: document.getElementById('container-condicionamento'),
        plansContainer: document.getElementById('saved-plans-container'),
        recommendedPlansContainer: document.getElementById('recommended-plans-container'),
        recommendedPlanCategories: document.getElementById('recommended-plan-categories'),
        planCreatorForm: document.querySelector('.plan-creator-form'),
        planNameInput: document.getElementById('plan-name-input'),
        planExerciseSelection: document.getElementById('plan-exercise-selection'),
        achievementsGrid: document.getElementById('achievements-grid'),
        beltProgressionContainer: document.getElementById('belt-progression-container'),
        mastersContainer: document.getElementById('container-mestres'),
        theoryContainer: document.getElementById('container-teoria'),
        glossaryContainerCinto: document.getElementById('container-glossario-cinto'),
        glossaryContainerGlobal: document.getElementById('container-glossario-global'),
        dailyChallengeCard: document.getElementById('daily-challenge-card'),
        modal: document.getElementById('video-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalVideoContainer: document.getElementById('modal-video-container'),
        closeModalBtn: document.querySelector('.close-modal'),
        statTotalXp: document.getElementById('stat-total-xp'),
        statTotalTime: document.getElementById('stat-total-time'),
        statFavExercise: document.getElementById('stat-fav-exercise'),
        xpChartCanvas: document.getElementById('xp-chart'),
        onboardingModal: document.getElementById('onboarding-modal'),
        onboardingTitle: document.getElementById('onboarding-title'),
        onboardingText: document.getElementById('onboarding-text'),
        onboardingPrevBtn: document.getElementById('onboarding-prev-btn'),
        onboardingNextBtn: document.getElementById('onboarding-next-btn'),
        onboardingDots: document.getElementById('onboarding-dots'),
        profileTabBtns: document.querySelectorAll('#seccao-perfil .profile-tab-btn'),
        profileTabPanes: document.querySelectorAll('#seccao-perfil .profile-tab-pane'),
        planosTabBtns: document.querySelectorAll('#seccao-planos .profile-tab-btn'),
        planosTabPanes: document.querySelectorAll('#seccao-planos .profile-tab-pane'),
        glossaryTabBtns: document.querySelectorAll('#seccao-glossario .profile-tab-btn'),
        glossaryTabPanes: document.querySelectorAll('#seccao-glossario .profile-tab-pane'),
        themePickerContainer: document.getElementById('theme-picker-container'),
        planExecutionModal: document.getElementById('plan-execution-modal'),
        planExecutionTitle: document.getElementById('plan-execution-title'),
        planExecutionTimerDisplay: document.getElementById('plan-execution-timer-display'),
        planExecutionProgressBar: document.getElementById('plan-execution-progress-bar'),
        planExecutionCurrentExercise: document.getElementById('plan-execution-current-exercise'),
        planExecutionPhaseInfo: document.getElementById('plan-execution-phase-info'),
    };
    // Copia as propriedades para o objeto `elements` global do módulo.
    Object.assign(elements, els);
}

/**
 * O objeto principal que encapsula toda a lógica de gestão da UI.
 */
export const uiManager = {
    /**
     * Inicializa o módulo, começando por mapear os elementos do DOM.
     */
    init() {
        queryElements();
    },

    /**
     * Retorna o objeto com as referências aos elementos do DOM.
     * @returns {object}
     */
    getElements() {
        return elements;
    },
    
    /**
     * Renderiza todo o conteúdo estático da aplicação que não muda com frequência.
     * @param {object|null} profile - O perfil do utilizador para verificações de nível.
     */
    renderAllStaticContent(profile) {
        this.renderAvatarChoices(profile);
        this.renderSkillLibrary(profile);
        this.renderConditioningLibrary(profile);
        this.renderMasters();
        this.renderTheory();
        this.renderBeltProgression(profile);
        this.renderGlossary(profile);
        this.renderAchievements(profile);
    },

    /**
     * Atualiza toda a interface do utilizador com base no perfil atual.
     * @param {object} userProfile - O perfil do utilizador.
     * @param {function} getBeltByLevel - Função para obter os detalhes de um cinturão.
     */
    updateUI(userProfile, getBeltByLevel) {
        if (!userProfile) {
            elements.userStatusDisplay.style.display = 'none';
            this.renderNavigation(null);
            return;
        }

        this.applyTheme(userProfile.theme);
        this.renderThemePicker(userProfile.theme);

        elements.perfilFormView.style.display = 'none';
        elements.perfilDashboardView.style.display = 'block';

        const currentBelt = getBeltByLevel(userProfile.unlockedBeltLevel);
        const nextBelt = getBeltByLevel(userProfile.unlockedBeltLevel + 1);

        elements.userStatusDisplay.style.display = 'flex';
        elements.userStatusName.textContent = userProfile.name;
        elements.userStatusBelt.textContent = currentBelt.name;

        const avatar = AVATAR_LIST.find(a => a.id === userProfile.avatar);
        const avatarSrc = avatar ? `./assets/avatars/${avatar.id}` : 'https://placehold.co/150x150/2c2c2c/ecf0f1?text=?';
        elements.userStatusAvatar.src = avatarSrc;
        elements.passaporteAvatarDisplay.src = avatarSrc;

        if (nextBelt) {
            const xpForNextLevel = nextBelt.minXp;
            const progressPercentage = Math.min(100, (userProfile.xp / xpForNextLevel) * 100);
            elements.userProgressBarFill.style.width = `${progressPercentage}%`;
            elements.userProgressBarText.textContent = `${userProfile.xp} / ${xpForNextLevel} XP`;
        } else {
            elements.userProgressBarFill.style.width = '100%';
            elements.userProgressBarText.textContent = 'Mestria Alcançada';
        }

        elements.passaporteNomeSpan.textContent = userProfile.name;
        elements.passaporteBeltSpan.textContent = currentBelt.name;
        elements.passaportePontosSpan.textContent = userProfile.xp;
        elements.studentIdDisplay.textContent = userProfile.studentId;
        elements.passaporteAlturaSpan.textContent = userProfile.height || 'N/A';
        elements.passaportePesoSpan.textContent = userProfile.weight || 'N/A';
        elements.passaporteImcSpan.textContent = userProfile.imc || 'N/A';
        elements.passaporteStreakSpan.textContent = userProfile.streak;
        elements.passaporteAchievementsSpan.textContent = `${userProfile.achievements.length} / ${Object.keys(ACHIEVEMENTS).length}`;

        this.renderNavigation(userProfile);
        this.updateStaminaBar(userProfile.stamina, userProfile.maxStamina);
        
        // Re-renderiza conteúdo que depende do nível do utilizador
        this.renderAllStaticContent(userProfile);
    },

    /**
     * Atualiza a barra de energia na interface.
     * @param {number} current - Energia atual.
     * @param {number} max - Energia máxima.
     */
    updateStaminaBar(current, max) {
        elements.staminaBarText.textContent = `⚡ ${Math.floor(current)} / ${max}`;
        elements.staminaBarFill.style.width = `${(current / max) * 100}%`;
    },

    /**
     * Mostra ou esconde a vista de criação/edição de perfil.
     * @param {boolean} show - Se deve mostrar o formulário.
     * @param {object|null} profile - O perfil do utilizador para preencher os campos (opcional).
     */
    toggleProfileForm(show, profile = null) {
        elements.perfilFormView.style.display = show ? 'block' : 'none';
        elements.perfilDashboardView.style.display = show ? 'none' : 'block';
        if (show) {
            elements.perfilNomeInput.value = profile ? profile.name : '';
            elements.perfilAlturaInput.value = profile ? profile.height : '';
            elements.perfilPesoInput.value = profile ? profile.weight : '';
            this.renderAvatarChoices(profile);
        }
    },

    /**
     * Renderiza os botões de navegação na barra lateral.
     * @param {object|null} userProfile - O perfil do utilizador para verificar notificações.
     */
    renderNavigation(userProfile) {
        const navContainer = elements.navHub;
        navContainer.innerHTML = '';
        
        const hasNewSkill = userProfile?.newContent?.skill ?? false;
        const hasNewBelts = userProfile?.newContent?.belts ?? false;

        NAV_ITEMS.forEach(item => {
            const button = document.createElement('button');
            button.className = 'nav-button';
            button.dataset.seccao = item.id;
            
            let buttonHTML = `<span class="icon">${item.icon}</span> ${item.text}`;
            
            if ((item.id === 'seccao-skill' && hasNewSkill) || (item.id === 'seccao-cinturoes' && hasNewBelts)) {
                buttonHTML += '<span class="nav-badge"></span>';
            }
            
            button.innerHTML = buttonHTML;
            navContainer.appendChild(button);
        });
    },
    
    /**
     * Renderiza as opções de avatares no formulário de perfil.
     * @param {object|null} profile - O perfil do utilizador para verificar os avatares desbloqueados.
     */
    renderAvatarChoices(profile) {
        const grid = elements.avatarChoicesGrid;
        if (!grid) return;
        grid.innerHTML = '';
        const userLevel = profile ? profile.unlockedBeltLevel : 0;

        AVATAR_LIST.forEach(avatar => {
            const img = document.createElement('img');
            img.src = `./assets/avatars/${avatar.id}`;
            img.alt = `Avatar ${avatar.id}`;
            img.className = 'avatar-choice';
            img.dataset.avatarId = avatar.id;

            if (avatar.requiredBelt > userLevel) {
                img.classList.add('locked');
                img.title = `Desbloqueado no ${BELT_SYSTEM.find(b => b.level === avatar.requiredBelt)?.name || ''}`;
            } else {
                img.title = 'Selecionar este avatar';
            }
            grid.appendChild(img);
        });
    },

    /**
     * Cria o HTML para um cartão de exercício.
     * @param {object} item - O objeto do exercício.
     * @param {boolean} isLocked - Se o exercício está bloqueado.
     * @returns {string} O HTML do cartão.
     */
    createTimerCard(item, isLocked) {
        const lockIcon = isLocked ? '<span class="lock-icon">🔒</span>' : '';
        const videoButton = item.videoUrl ? `<button class="action-button video-btn" data-video-url="${item.videoUrl}" data-title="${item.title}" ${isLocked ? 'disabled' : ''}>Ver Vídeo</button>` : '';
        
        return `
            <div class="timer-card floating-card zoom-on-hover ${isLocked ? 'locked' : ''}" id="timer-${item.id}">
                <h3>${item.title} ${lockIcon}</h3>
                <p>${item.description}</p>
                <div class="timer-visual-container">
                    <svg class="timer-progress-ring" width="160" height="160">
                        <circle class="timer-progress-ring__background" r="70" cx="80" cy="80"></circle>
                        <circle class="timer-progress-ring__circle" r="70" cx="80" cy="80"></circle>
                    </svg>
                    <div class="timer-display">${item.duration}s</div>
                </div>
                <div class="timer-controls">
                    <button class="action-button start-btn" data-item-id="${item.id}" ${isLocked ? 'disabled' : ''}>Iniciar</button>
                    <button class="action-button stop-btn" data-item-id="${item.id}" style="display: none;">Parar</button>
                    ${videoButton}
                </div>
                <div class="timer-xp-info">Ganha ${item.xp} XP | Custa ${item.staminaCost} ⚡</div>
            </div>
        `;
    },
    
    /**
     * Renderiza uma lista de exercícios numa categoria.
     * @param {HTMLElement} container - O elemento onde a lista será renderizada.
     * @param {object} categoryData - Os dados da categoria de exercícios.
     * @param {object|null} profile - O perfil do utilizador.
     */
    renderLibraryList(container, categoryData, profile) {
        const userLevel = profile ? profile.unlockedBeltLevel : 0;
        container.innerHTML = '';

        for (const categoryName in categoryData) {
            const category = categoryData[categoryName];
            let categoryHtml = `<h2 class="subtitulo-seccao">${categoryName}</h2><div class="card-grid">`;
            
            category.forEach(item => {
                const isLocked = item.requiredBelt > userLevel;
                categoryHtml += this.createTimerCard(item, isLocked);
            });

            categoryHtml += `</div>`;
            container.innerHTML += categoryHtml;
        }
    },

    renderSkillLibrary(profile) {
        this.renderLibraryList(elements.skillContainer, WING_CHUN_TRAINING, profile);
    },

    renderConditioningLibrary(profile) {
        elements.conditioningContainer.innerHTML = '';
        const userLevel = profile ? profile.unlockedBeltLevel : 0;

        for (const categoryName in CONDITIONING_TRAINING) {
            const category = CONDITIONING_TRAINING[categoryName];
            const accordionItem = document.createElement('div');
            accordionItem.className = 'conditioning-accordion-item floating-card';
            
            let contentHtml = '<div class="card-grid">';
            category.items.forEach(item => {
                const isLocked = item.requiredBelt > userLevel;
                contentHtml += this.createTimerCard(item, isLocked);
            });
            contentHtml += '</div>';

            accordionItem.innerHTML = `
                <div class="conditioning-accordion-header" style="border-left-color: ${category.color};">
                    <h2 class="subtitulo-seccao">${categoryName}</h2>
                    <span class="accordion-arrow">▶</span>
                </div>
                <div class="conditioning-accordion-content">
                    ${contentHtml}
                </div>
            `;
            elements.conditioningContainer.appendChild(accordionItem);
        }
    },
    
    renderMasters() {
        elements.mastersContainer.innerHTML = GREAT_MASTERS_DATA.map(master => `
            <div class="master-flip-card">
                <div class="master-flip-card-inner">
                    <div class="master-flip-card-front">
                        <div class="master-image-placeholder">
                            <img src="${master.image_placeholder}" alt="Imagem de ${master.name}">
                        </div>
                        <div class="master-front-info">
                            <h3>${master.name}</h3>
                            <p>${master.dynasty}</p>
                        </div>
                    </div>
                    <div class="master-flip-card-back card-prose">
                        ${master.content}
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderTheory() {
        elements.theoryContainer.innerHTML = THEORY_DATA.map(item => `
            <div class="floating-card">
                <div class="card-header"><h2 class="titulo-seccao">${item.title}</h2></div>
                <div class="card-content card-prose">${item.content}</div>
            </div>
        `).join('');
    },

    renderBeltProgression(profile) {
        const container = elements.beltProgressionContainer;
        container.innerHTML = '';
        const userLevel = profile ? profile.unlockedBeltLevel : 0;
        const userXp = profile ? profile.xp : 0;

        BELT_SYSTEM.forEach(belt => {
            const isUnlocked = belt.level <= userLevel;
            const canPromote = userLevel === belt.level - 1 && userXp >= belt.minXp;
            
            const item = document.createElement('div');
            item.className = `belt-accordion-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            item.style.borderLeftColor = belt.color;

            item.innerHTML = `
                <div class="belt-accordion-header">
                    <h3 style="color: ${belt.color};">${belt.name}</h3>
                    <span class="belt-requirement">${isUnlocked ? 'Desbloqueado' : `Requer ${belt.minXp} XP`}</span>
                </div>
                <div class="belt-accordion-content">
                    <p>Conteúdo relacionado com o ${belt.name} aparecerá aqui.</p>
                    ${canPromote ? `
                        <div class="promotion-area">
                            <p>Parabéns! Atingiste o XP necessário para este cinturão.</p>
                            <button class="action-button promote-btn" data-level="${belt.level}">Promover a ${belt.name}</button>
                        </div>
                    ` : ''}
                </div>
            `;
            container.appendChild(item);
        });
    },
    
    renderGlossary(profile) {
        const userLevel = profile ? profile.unlockedBeltLevel : 0;

        const renderCategory = (categoryData) => {
            let html = '';
            for (const categoryName in categoryData) {
                const terms = categoryData[categoryName].filter(term => term.requiredBelt <= userLevel);
                if (terms.length > 0) {
                    html += `<h3 class="subtitulo-seccao">${categoryName}</h3>`;
                    terms.forEach(term => {
                        const beltColor = BELT_SYSTEM.find(b => b.level === term.requiredBelt)?.color || '#ecf0f1';
                        html += `
                            <div class="term-entry">
                                <h4>
                                    <span class="belt-dot" style="background-color: ${beltColor};"></span>
                                    ${term.term}
                                </h4>
                                <p>${term.definition}</p>
                            </div>`;
                    });
                }
            }
            return html;
        };
        
        elements.glossaryContainerCinto.innerHTML = renderCategory(GLOSSARY_DATA);
        elements.glossaryContainerGlobal.innerHTML = renderCategory(GLOSSARY_DATA); // Simplificado, poderia ter lógica diferente
    },

    renderAchievements(profile) {
        const grid = elements.achievementsGrid;
        grid.innerHTML = '';
        const userAchievements = profile ? profile.achievements : [];

        for (const id in ACHIEVEMENTS) {
            const achievement = ACHIEVEMENTS[id];
            const isUnlocked = userAchievements.includes(id);
            
            grid.innerHTML += `
                <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="icon">${achievement.icon}</div>
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    ${isUnlocked ? `<span class="unlocked-date">Desbloqueado em: ${new Date(achievement.date).toLocaleDateString()}</span>` : ''}
                </div>
            `;
        }
    },

    /**
     * Mostra uma notificação no ecrã.
     * @param {string} text - O texto da notificação.
     * @param {string} icon - O ícone a ser exibido.
     */
    showNotification(text, icon = 'ℹ️') {
        const notification = elements.notificationEl;
        elements.notificationIcon.textContent = icon;
        elements.notificationText.textContent = text;
        
        notification.classList.remove('hidden');
        notification.style.display = 'flex';
        notification.style.animation = 'none';
        void notification.offsetWidth; // Trigger reflow
        notification.style.animation = 'slideInDown 0.5s forwards, fadeOut 0.5s 3.5s forwards';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 4000);
    },

    /**
     * Aplica o tema de cores selecionado à aplicação.
     * @param {string} themeKey - A chave do tema (ex: 'default', 'ocean').
     */
    applyTheme(themeKey) {
        const theme = COLOR_THEMES[themeKey] || COLOR_THEMES['default'];
        document.documentElement.style.setProperty('--cor-primaria', theme.primary);
        document.documentElement.style.setProperty('--cor-secundaria', theme.secondary);
    },

    /**
     * Renderiza o seletor de temas no perfil.
     * @param {string} currentThemeKey - A chave do tema atual.
     */
    renderThemePicker(currentThemeKey) {
        const container = elements.themePickerContainer.querySelector('.theme-options');
        container.innerHTML = '';

        for (const key in COLOR_THEMES) {
            const theme = COLOR_THEMES[key];
            const dot = document.createElement('div');
            dot.className = 'theme-dot';
            dot.style.background = `linear-gradient(145deg, ${theme.primary}, ${theme.secondary})`;
            dot.title = theme.name;
            dot.dataset.themeKey = key;
            if (key === currentThemeKey) {
                dot.classList.add('active');
            }
            container.appendChild(dot);
        }
    }
};
