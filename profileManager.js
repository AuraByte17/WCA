/**
 * profileManager.js
 * * Módulo responsável por toda a gestão dos dados do perfil do utilizador.
 * - Carrega e guarda o perfil no localStorage.
 * - Cria novos perfis com valores padrão, incluindo o sistema de energia.
 * - Garante a integridade dos dados ao carregar perfis antigos.
 * - Gere a lógica de adição de XP, atualização do histórico e consumo/regeneração de energia.
 * - Lida com a importação e exportação dos dados do perfil.
 */

// A chave usada para guardar os dados no armazenamento local do browser.
const PROFILE_STORAGE_KEY = 'wingChunProfile';

// Configurações para o sistema de energia.
const STAMINA_REGEN_RATE = 1; // Pontos de energia a regenerar por intervalo.
const STAMINA_REGEN_INTERVAL_MINS = 5; // Intervalo em minutos para regenerar.

let userProfile = null;

/**
 * Garante que o objeto do perfil contém todos os campos necessários,
 * adicionando valores padrão se estiverem em falta. Útil para migrar perfis antigos.
 * @param {object} profile - O objeto do perfil a ser verificado.
 */
function ensureProfileIntegrity(profile) {
    const defaults = {
        unlockedBeltLevel: 0,
        achievements: [],
        daily: {},
        streak: 0,
        history: [],
        trainingStats: {},
        customPlans: [],
        studentId: `WC-${new Date(profile.createdAt || Date.now()).getTime().toString(36).toUpperCase()}`,
        newContent: { skill: false, belts: false },
        theme: 'default',
        stamina: 100,
        maxStamina: 100,
        lastStaminaUpdate: new Date().toISOString(),
    };

    for (const key in defaults) {
        if (typeof profile[key] === 'undefined') {
            profile[key] = defaults[key];
        }
    }
}

/**
 * O objeto principal que encapsula toda a lógica de gestão de perfil.
 */
export const profileManager = {
    /**
     * Carrega o perfil do utilizador a partir do localStorage.
     * @returns {object|null} O perfil do utilizador ou null se não existir.
     */
    loadProfile() {
        const profileData = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (profileData) {
            try {
                userProfile = JSON.parse(profileData);
                ensureProfileIntegrity(userProfile);
                return userProfile;
            } catch (e) {
                console.error("Erro ao carregar perfil, dados corrompidos:", e);
                localStorage.removeItem(PROFILE_STORAGE_KEY);
                userProfile = null;
                return null;
            }
        }
        return null;
    },

    /**
     * Guarda o perfil atual no localStorage.
     */
    saveProfile() {
        if (userProfile) {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
        }
    },

    /**
     * Cria um novo perfil de utilizador com base nos dados fornecidos.
     * @param {string} name - Nome do utilizador.
     * @param {number} height - Altura em cm.
     * @param {number} weight - Peso em kg.
     * @param {string} avatar - ID do avatar selecionado.
     * @returns {object} O novo objeto de perfil criado.
     */
    createNewProfile(name, height, weight, avatar) {
        const createdAt = new Date().toISOString();
        const imc = (weight / ((height / 100) ** 2)).toFixed(1);

        userProfile = {
            name,
            height,
            weight,
            imc,
            avatar,
            xp: 0,
            unlockedBeltLevel: 0,
            achievements: [],
            streak: 0,
            daily: {},
            history: [],
            trainingStats: {},
            customPlans: [],
            createdAt,
            studentId: `WC-${new Date(createdAt).getTime().toString(36).toUpperCase()}`,
            isNew: true,
            newContent: { skill: false, belts: false },
            theme: 'default',
            stamina: 100,
            maxStamina: 100,
            lastStaminaUpdate: createdAt,
        };
        this.saveProfile();
        return userProfile;
    },

    /**
     * Atualiza os dados de um perfil existente.
     * @param {object} updatedData - Objeto com os novos dados (name, height, weight, avatar).
     */
    updateProfile(updatedData) {
        if (!userProfile) return;
        userProfile.name = updatedData.name;
        userProfile.avatar = updatedData.avatar;
        userProfile.height = updatedData.height;
        userProfile.weight = updatedData.weight;
        userProfile.imc = (updatedData.weight / ((updatedData.height / 100) ** 2)).toFixed(1);
        this.saveProfile();
    },

    /**
     * Adiciona XP ao perfil e atualiza o histórico.
     * @param {number} xpToAdd - Quantidade de XP a adicionar.
     * @param {string} trainingId - ID do treino que concedeu o XP.
     */
    addXp(xpToAdd, trainingId) {
        if (!userProfile || xpToAdd <= 0) return;
        userProfile.xp += xpToAdd;
        this.updateHistory(xpToAdd, trainingId);
        this.saveProfile();
    },

    /**
     * Atualiza o histórico de treinos para um determinado dia.
     * @param {number} xpGained - XP ganho na sessão.
     * @param {string} trainingId - ID do treino realizado.
     */
    updateHistory(xpGained, trainingId) {
        const today = new Date().toISOString().split('T')[0];
        let todayHistory = userProfile.history.find(h => h.date === today);
        if (todayHistory) {
            todayHistory.xpGained += xpGained;
            if (trainingId !== 'misc' && !todayHistory.trainings.includes(trainingId)) {
                todayHistory.trainings.push(trainingId);
            }
        } else {
            userProfile.history.push({ date: today, xpGained, trainings: [trainingId] });
        }
    },

    /**
     * Calcula e regenera a energia (stamina) com base no tempo passado.
     */
    updateStamina() {
        if (!userProfile) return;

        const now = new Date();
        const lastUpdate = new Date(userProfile.lastStaminaUpdate);
        const diffMs = now - lastUpdate;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins >= STAMINA_REGEN_INTERVAL_MINS) {
            const staminaToRegen = Math.floor(diffMins / STAMINA_REGEN_INTERVAL_MINS) * STAMINA_REGEN_RATE;
            userProfile.stamina = Math.min(userProfile.maxStamina, userProfile.stamina + staminaToRegen);
            userProfile.lastStaminaUpdate = new Date().toISOString();
            this.saveProfile();
        }
    },

    /**
     * Consome uma quantidade de energia.
     * @param {number} cost - A quantidade de energia a consumir.
     * @returns {boolean} Verdadeiro se a energia foi consumida, falso se não havia energia suficiente.
     */
    consumeStamina(cost) {
        if (!userProfile || userProfile.stamina < cost) {
            return false;
        }
        userProfile.stamina -= cost;
        this.saveProfile();
        return true;
    },

    /**
     * Retorna o perfil de utilizador atual.
     * @returns {object|null} O perfil do utilizador.
     */
    getProfile() {
        return userProfile;
    },

    /**
     * Define um novo perfil (usado na importação).
     * @param {object} newProfile - O novo objeto de perfil.
     */
    setProfile(newProfile) {
        userProfile = newProfile;
        ensureProfileIntegrity(userProfile);
        this.saveProfile();
    },

    /**
     * Adiciona um plano personalizado à lista do utilizador.
     * @param {object} plan - O objeto do plano a ser adicionado.
     */
    addCustomPlan(plan) {
        if (userProfile) {
            userProfile.customPlans.push(plan);
            this.saveProfile();
        }
    }
};
