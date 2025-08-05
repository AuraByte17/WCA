/**
 * app.js
 * * Ficheiro principal da aplicação (orquestrador).
 * - Importa todos os módulos (data, profileManager, uiManager, trainingManager).
 * - Inicializa a aplicação quando o DOM está pronto.
 * - Adiciona todos os event listeners e conecta as ações do utilizador à lógica correspondente nos módulos.
 * - Gere o estado geral da aplicação, como a secção ativa.
 */

// CORREÇÃO: A variável NAV_ITEMS foi adicionada à lista de importações.
import { BELT_SYSTEM, NAV_ITEMS } from './data.js';
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
        
        if (profile) {
            uiManager.updateUI(profile, this.getBeltByLevel);
        } else {
            uiManager.toggleProfileForm(true);
        }
        uiManager.renderNavigation(profile);
        this.mostrarSeccao(this.state.activeSection);
    },
    
    addEventListeners() {
        // Adiciona um ouvinte de evento ao botão para guardar o perfil.
        const guardarPerfilBtn = document.getElementById('guardarPerfilBtn');
        if (guardarPerfilBtn) {
            guardarPerfilBtn.addEventListener('click', () => this.handleSaveProfile());
        }
        
        // Adiciona ouvintes de eventos para os outros botões de perfil.
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


        this.elements.navHub.addEventListener('click', (e) => {
            const navButton = e.target.closest('.nav-button');
            if (navButton) {
                this.mostrarSeccao(navButton.dataset.seccao);
            }
        });

        this.elements.openMenuBtn.addEventListener('click', () => uiManager.toggleMobileMenu(true));
        this.elements.closeMenuBtn.addEventListener('click', () => uiManager.toggleMobileMenu(false));
        this.elements.mobileMenuOverlay.addEventListener('click', () => uiManager.toggleMobileMenu(false));

        const themePickerContainer = document.getElementById('theme-picker-container');
        if(themePickerContainer) {
            themePickerContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('theme-dot')) {
                    const themeKey = e.target.dataset.themeKey;
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

// CORREÇÃO: A chaveta '}' extra que estava aqui foi removida.
