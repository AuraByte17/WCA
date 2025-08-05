/**
 * app.js
 * * Ficheiro principal da aplicação (orquestrador).
 * - Importa todos os módulos (data, profileManager, uiManager, trainingManager).
 * - Inicializa a aplicação quando o DOM está pronto.
 * - Adiciona todos os event listeners e conecta as ações do utilizador à lógica correspondente nos módulos.
 * - Gere o estado geral da aplicação, como a secção ativa.
 */

import {
    NAV_ITEMS,
    COLOR_THEMES,
    AVATAR_LIST,
    ALL_TRAINING_ITEMS,
    GREAT_MASTERS_DATA,
    THEORY_DATA,
    GLOSSARY_DATA,
    BELT_SYSTEM
} from './data.js';
import { profileManager } from './profileManager.js';
// O uiManager e trainingManager serão criados nos próximos passos.
// Por agora, vamos focar-nos na estrutura.

const WingChunApp = {
    state: {
        activeSection: 'seccao-perfil',
        selectedAvatar: null,
        xpChart: null,
    },
    elements: {},

    init() {
        // Simula a inicialização dos outros módulos
        this.elements = this.queryElements(); // Simula uiManager.init()
        profileManager.loadProfile();

        this.addEventListeners();
        this.renderInitialUI();
    },

    queryElements() {
        // Esta função seria parte do uiManager, mas por agora fica aqui.
        return {
             navHub: document.getElementById('navigation-hub'),
            appSidebar: document.getElementById('app-sidebar'),
            seccoes: document.querySelectorAll('.seccao'),
            mobileHeaderTitle: document.getElementById('current-section-title'),
            openMenuBtn: document.getElementById('open-menu-btn'),
            closeMenuBtn: document.getElementById('close-menu-btn'),
            mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
            mainContentArea: document.getElementById('main-content-area'),
            guardarPerfilBtn: document.getElementById('guardarPerfilBtn'),
            editarPerfilBtn: document.getElementById('editarPerfilBtn'),
            exportProfileBtn: document.getElementById('exportProfileBtn'),
            importProfileBtn: document.getElementById('importProfileBtn'),
            importFileInput: document.getElementById('import-file-input'),
            themePickerContainer: document.getElementById('theme-picker-container'),
            // Adicionar outros elementos conforme necessário
        };
    },
    
    addEventListeners() {
        this.elements.guardarPerfilBtn.addEventListener('click', () => this.handleSaveProfile());
        this.elements.editarPerfilBtn.addEventListener('click', () => this.handleEditProfile());
        this.elements.exportProfileBtn.addEventListener('click', () => this.handleExportProfile());
        this.elements.importProfileBtn.addEventListener('click', () => this.elements.importFileInput.click());
        this.elements.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));

        // Event listeners para navegação
        this.elements.navHub.addEventListener('click', (e) => {
            if (e.target.closest('.nav-button')) {
                const seccaoId = e.target.closest('.nav-button').dataset.seccao;
                this.mostrarSeccao(seccaoId);
            }
        });
        
        // ... outros event listeners (mobile menu, modais, etc.)
    },

    renderInitialUI() {
        const profile = profileManager.getProfile();
        if (profile) {
            // Simula uiManager.updateUI(profile, this.getBeltByLevel);
            console.log("Perfil carregado, a renderizar UI do dashboard.");
        } else {
            // Simula uiManager.toggleProfileForm(true);
            console.log("Nenhum perfil, a mostrar formulário de criação.");
        }
        // Simula uiManager.renderNavigation(profile);
    },

    handleSaveProfile() {
        // Lógica para obter dados do formulário
        const nome = document.getElementById('perfil-nome').value;
        const altura = parseFloat(document.getElementById('perfil-altura').value);
        const peso = parseFloat(document.getElementById('perfil-peso').value);

        if (!nome || !altura || !peso) {
            // uiManager.showNotification("Preencha todos os campos.");
            console.error("Preencha todos os campos.");
            return;
        }

        let profile = profileManager.getProfile();
        if (!profile) {
            profile = profileManager.createNewProfile(nome, altura, peso, this.state.selectedAvatar);
        } else {
            profileManager.updateProfile({ name: nome, height: altura, weight: peso, avatar: this.state.selectedAvatar });
        }
        
        this.renderInitialUI();
    },

    handleEditProfile() {
        const profile = profileManager.getProfile();
        // uiManager.toggleProfileForm(true, profile);
        this.state.selectedAvatar = profile.avatar;
    },

    handleExportProfile() {
        const profile = profileManager.getProfile();
        if (!profile) return;
        const profileJson = JSON.stringify(profile, null, 2);
        const blob = new Blob([profileJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wingchun_profile.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newProfile = JSON.parse(e.target.result);
                profileManager.setProfile(newProfile);
                this.renderInitialUI();
            } catch (err) {
                console.error("Erro ao importar ficheiro.");
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
        // Lógica para atualizar o botão ativo na navegação (seria do uiManager)
        this.elements.navHub.querySelectorAll('.nav-button').forEach(button => {
            button.classList.toggle('active', button.dataset.seccao === idSeccao);
        });
    },

    getBeltByLevel(level) {
        return BELT_SYSTEM.find(b => b.level === level) || BELT_SYSTEM[0];
    }
};

document.addEventListener('DOMContentLoaded', () => {
    WingChunApp.init();
});
