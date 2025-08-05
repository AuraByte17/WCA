/**
 * uiManager.js
 * * Módulo responsável por toda a manipulação do DOM e atualizações da interface.
 * - Centraliza a busca por elementos do DOM.
 * - Contém todas as funções de renderização para as diferentes secções da app.
 * - Gere a exibição de modais, notificações e a navegação entre as abas.
 * - É chamado pelos outros módulos para refletir as mudanças de estado no ecrã.
 */
import { NAV_ITEMS, COLOR_THEMES, AVATAR_LIST, ALL_TRAINING_ITEMS, GREAT_MASTERS_DATA, THEORY_DATA, GLOSSARY_DATA, BELT_SYSTEM } from './data.js';

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
        const avatarId = avatar ? avatar.id.substring(6, 7) : "?";
        elements.userStatusAvatar.src = `https://placehold.co/60x60/2c2c2c/ecf0f1?text=${avatarId}`;
        elements.passaporteAvatarDisplay.src = `https://placehold.co/150x150/2c2c2c/ecf0f1?text=${avatarId}`;

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
        elements.passaporteAlturaSpan.textContent = userProfile.altura || 'N/A';
        elements.passaportePesoSpan.textContent = userProfile.peso || 'N/A';
        elements.passaporteImcSpan.textContent = userProfile.imc || 'N/A';
        elements.passaporteStreakSpan.textContent = userProfile.streak;
        elements.passaporteAchievementsSpan.textContent = `${userProfile.achievements.length} / ${Object.keys(ACHIEVEMENTS).length}`;

        this.renderNavigation(userProfile);
        this.updateStaminaBar(userProfile.stamina, userProfile.maxStamina);
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
        if (show && profile) {
            elements.perfilNomeInput.value = profile.name;
            elements.perfilAlturaInput.value = profile.altura;
            elements.perfilPesoInput.value = profile.peso;
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
            // O event listener será adicionado no app.js
            navContainer.appendChild(button);
        });
    },
    
    // ... (outras funções de renderização como renderLibraryList, createTimerCard, etc., seriam movidas para aqui)
    // Por uma questão de brevidade, vamos focar-nos na estrutura principal.
    // O código completo para cada função de renderização seria movido para este módulo.

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
        notification.style.animation = 'none';
        void notification.offsetWidth; // Trigger reflow
        notification.style.animation = 'slideInDown 0.5s forwards, fadeOut 0.5s 3.5s forwards';
        
        setTimeout(() => {
            notification.classList.add('hidden');
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
            dot.dataset.themeKey = key; // Adiciona o data attribute
            if (key === currentThemeKey) {
                dot.classList.add('active');
            }
            // O event listener será adicionado no app.js
            container.appendChild(dot);
        }
    }
};
