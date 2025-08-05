/**
 * app.js
 * * Ficheiro principal da aplicação (orquestrador).
 * - Importa todos os módulos (data, profileManager, uiManager, trainingManager).
 * - Inicializa a aplicação quando o DOM está pronto.
 * - Adiciona todos os event listeners e conecta as ações do utilizador à lógica correspondente nos módulos.
 * - Gere o estado geral da aplicação, como a secção ativa.
 */

// CORREÇÃO: Importa todos os itens de treino para fácil acesso.
import { BELT_SYSTEM, NAV_ITEMS, ALL_TRAINING_ITEMS } from './data.js';
import { profileManager } from './profileManager.js';
import { uiManager } from './uiManager.js';
import { trainingManager } from './trainingManager.js';

const WingChunApp = {
    state: {
        activeSection: 'seccao-perfil',
        selectedAvatar: null,
        xpChart: null,
    },
    elements: {},

    init() {
        uiManager.init();
        this.elements = uiManager.getElements();
        trainingManager.init(uiManager, profileManager);
        
        const profile = profileManager.loadProfile();
        
        this.addEventListeners();
        
        uiManager.renderAllStaticContent(profile);
        
        if (profile) {
            uiManager.updateUI(profile, this.getBeltByLevel);
        } else {
            uiManager.toggleProfileForm(true);
        }
        uiManager.renderNavigation(profile);
        this.mostrarSeccao(this.state.activeSection);
    },
    
    addEventListeners() {
        // Listeners estáticos (não mudam)
        const guardarPerfilBtn = document.getElementById('guardarPerfilBtn');
        if (guardarPerfilBtn) {
            guardarPerfilBtn.addEventListener('click', () => this.handleSaveProfile());
        }
        
        const editarPerfilBtn = document.getElementById('editarPerfilBtn');
        if (editarPerfilBtn) {
            editarPerfilBtn.addEventListener('click', () => this.handleEditProfile());
        }

        const exportProfileBtn = document.getElementById('exportProfileBtn');
        if (exportProfileBtn) {
            exportProfileBtn.addEventListener('click', () => this.handleExportProfile());
        }

        const importProfileBtn = document.getElementById('importProfileBtn');
        const importFileInput = document.getElementById('import-file-input');
        if (importProfileBtn && importFileInput) {
            importProfileBtn.addEventListener('click', () => importFileInput.click());
            importFileInput.addEventListener('change', (e) => this.handleImportFile(e));
        }

        // Menu móvel
        this.elements.openMenuBtn.addEventListener('click', () => uiManager.toggleMobileMenu(true));
        this.elements.closeMenuBtn.addEventListener('click', () => uiManager.toggleMobileMenu(false));
        this.elements.mobileMenuOverlay.addEventListener('click', () => uiManager.toggleMobileMenu(false));

        // Navegação principal
        this.elements.navHub.addEventListener('click', (e) => {
            const navButton = e.target.closest('.nav-button');
            if (navButton) {
                this.mostrarSeccao(navButton.dataset.seccao);
                uiManager.toggleMobileMenu(false); // Fecha o menu ao navegar
            }
        });

        // Seleção de Avatar no formulário
        if (this.elements.avatarChoicesGrid) {
            this.elements.avatarChoicesGrid.addEventListener('click', (e) => {
                const target = e.target.closest('.avatar-choice:not(.locked)');
                if (!target) return;
                
                const selected = this.elements.avatarChoicesGrid.querySelector('.selected');
                if(selected) selected.classList.remove('selected');

                target.classList.add('selected');
                this.state.selectedAvatar = target.dataset.avatarId;
                
                if(this.elements.formAvatarPreview) {
                    this.elements.formAvatarPreview.src = target.src;
                }
            });
        }

        // CORREÇÃO: Listener delegado para todo o conteúdo dinâmico
        this.elements.mainContentArea.addEventListener('click', (e) => {
            const target = e.target;

            // Botões dos cartões de treino
            const startBtn = target.closest('.start-btn:not(:disabled)');
            if (startBtn) {
                const itemId = startBtn.dataset.itemId;
                const item = ALL_TRAINING_ITEMS.find(i => i.id === itemId);
                if (item) {
                    trainingManager.startTimer(item);
                    uiManager.showStopButton(itemId);
                }
                return;
            }

            const stopBtn = target.closest('.stop-btn');
            if (stopBtn) {
                const itemId = stopBtn.dataset.itemId;
                const item = ALL_TRAINING_ITEMS.find(i => i.id === itemId);
                if (item) {
                    trainingManager.stopTimer(item, true);
                }
                return;
            }
            
            const videoBtn = target.closest('.video-btn:not(:disabled)');
            if (videoBtn) {
                uiManager.showVideoModal(videoBtn.dataset.videoUrl, videoBtn.dataset.title);
                return;
            }

            // Acordeões (Cinturões e Condicionamento)
            const accordionHeader = target.closest('.belt-accordion-header, .conditioning-accordion-header');
            if (accordionHeader) {
                accordionHeader.parentElement.classList.toggle('active');
                return;
            }
            
            // Abas (Perfil, Planos, etc.)
            const tabBtn = target.closest('.profile-tab-btn');
            if (tabBtn && !tabBtn.classList.contains('active')) {
                this.handleTabClick(tabBtn);
                return;
            }
            
            // Cartões dos Mestres (Flip)
            const flipCard = target.closest('.master-flip-card');
            if (flipCard && typeof gsap !== 'undefined') {
                const cardInner = flipCard.querySelector('.master-flip-card-inner');
                const isFlipped = cardInner.style.transform.includes('rotateY(180deg)');
                gsap.to(cardInner, {
                    rotationY: isFlipped ? 0 : 180,
                    duration: 0.7,
                    ease: 'power3.inOut'
                });
                return;
            }
        });
        
        // Fechar o modal de vídeo
        if (this.elements.modal) {
            this.elements.modal.addEventListener('click', (e) => {
                if (e.target === this.elements.modal || e.target.closest('.close-modal')) {
                    uiManager.hideVideoModal();
                }
            });
        }
        
        // Listener para o seletor de temas (já existia, mas movido para consistência)
        const themePickerContainer = document.getElementById('theme-picker-container');
        if(themePickerContainer) {
            themePickerContainer.addEventListener('click', (e) => {
                const themeDot = e.target.closest('.theme-dot');
                if (themeDot) {
                    const themeKey = themeDot.dataset.themeKey;
                    const profile = profileManager.getProfile();
                    if (profile) {
                        profile.theme = themeKey;
                        profileManager.saveProfile();
                        uiManager.applyTheme(themeKey);
                        uiManager.renderThemePicker(themeKey);
                    }
                }
            });
        }
    },

    handleSaveProfile() {
        const nome = this.elements.perfilNomeInput.value;
        const altura = parseFloat(this.elements.perfilAlturaInput.value);
        const peso = parseFloat(this.elements.perfilPesoInput.value);

        if (!nome || !altura || !peso || altura < 100 || altura > 250 || peso < 30 || peso > 250) {
            uiManager.showNotification("Por favor, preencha todos os campos com valores realistas.", "⚠️");
            return;
        }
        
        if (!this.state.selectedAvatar) {
            uiManager.showNotification("Por favor, selecione um avatar.", "⚠️");
            return;
        }

        let profile = profileManager.getProfile();
        if (!profile) {
            profile = profileManager.createNewProfile(nome, altura, peso, this.state.selectedAvatar);
        } else {
            profileManager.updateProfile({ name: nome, height: altura, weight: peso, avatar: this.state.selectedAvatar || profile.avatar });
        }
        
        uiManager.updateUI(profile, this.getBeltByLevel);
        uiManager.toggleProfileForm(false);
    },

    handleEditProfile() {
        const profile = profileManager.getProfile();
        this.state.selectedAvatar = profile.avatar;
        uiManager.toggleProfileForm(true, profile);
    },

    handleExportProfile() {
        const profile = profileManager.getProfile();
        if (!profile) {
            uiManager.showNotification("Nenhum perfil para exportar.", "⚠️");
            return;
        }
        const profileJson = JSON.stringify(profile, null, 2);
        const blob = new Blob([profileJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wingchun_profile.json';
        a.click();
        URL.revokeObjectURL(url);
        uiManager.showNotification("Perfil exportado com sucesso!", "📥");
    },

    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newProfile = JSON.parse(e.target.result);
                if (newProfile && typeof newProfile.xp === 'number' && newProfile.name) {
                    profileManager.setProfile(newProfile);
                    uiManager.updateUI(newProfile, this.getBeltByLevel);
                    uiManager.showNotification("Perfil importado com sucesso!", "📤");
                } else {
                    uiManager.showNotification("Ficheiro de perfil inválido.", "❌");
                }
            } catch (err) {
                uiManager.showNotification("Erro ao ler o ficheiro.", "❌");
                console.error("Erro ao importar ficheiro:", err);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    },
    
    // CORREÇÃO: Nova função para gerir a troca de abas
    handleTabClick(tabButton) {
        const tabContainer = tabButton.closest('.profile-tabs');
        const contentContainer = tabContainer.nextElementSibling;

        if (tabContainer.querySelector('.active')) {
            tabContainer.querySelector('.active').classList.remove('active');
        }
        if (contentContainer.querySelector('.active')) {
            contentContainer.querySelector('.active').classList.remove('active');
        }

        tabButton.classList.add('active');
        const newPaneId = `tab-pane-${tabButton.dataset.tab}`;
        const newPane = contentContainer.querySelector(`#${newPaneId}`);
        if (newPane) {
            newPane.classList.add('active');
        }
    },

    mostrarSeccao(idSeccao) {
        this.state.activeSection = idSeccao;
        this.elements.seccoes.forEach(seccao => {
            seccao.classList.toggle('visivel', seccao.id === idSeccao);
        });
        this.elements.navHub.querySelectorAll('.nav-button').forEach(button => {
            button.classList.toggle('active', button.dataset.seccao === idSeccao);
        });
        const navItem = NAV_ITEMS.find(item => item.id === idSeccao);
        if (navItem) {
            this.elements.mobileHeaderTitle.textContent = navItem.text;
        }
    },

    getBeltByLevel(level) {
        return BELT_SYSTEM.find(b => b.level === level) || BELT_SYSTEM[0];
    }
};

document.addEventListener('DOMContentLoaded', () => {
    WingChunApp.init();
});
