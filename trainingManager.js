/**
 * trainingManager.js
 * * Módulo para gerir toda a lógica de treino.
 * - Controla o início, paragem e reset de temporizadores de exercícios individuais.
 * - Gere a execução de planos de treino completos, incluindo as suas diferentes fases.
 * - Comunica com o uiManager para atualizar a interface do temporizador.
 * - Comunica com o profileManager para consumir energia e adicionar XP.
 * - Utiliza Tone.js para os sinais sonoros.
 */

let uiManager, profileManager;
let audioSynth = null;
const activeTimers = {};
let currentPlan = null;

/**
 * Inicializa o sintetizador de áudio usando Tone.js.
 */
function initAudio() {
    if (Tone.context.state !== 'running') {
        Tone.start();
    }
    if (!audioSynth) {
        audioSynth = new Tone.Synth().toDestination();
        console.log("Contexto de áudio iniciado pelo Training Manager.");
    }
}

export const trainingManager = {
    /**
     * Inicializa o módulo de treino com as dependências necessárias.
     * @param {object} ui - A instância do uiManager.
     * @param {object} profile - A instância do profileManager.
     */
    init(ui, profile) {
        uiManager = ui;
        profileManager = profile;
        // O áudio é iniciado com a primeira interação do utilizador no app.js
        document.body.addEventListener('click', initAudio, { once: true });
        document.body.addEventListener('touchend', initAudio, { once: true });
    },

    /**
     * Inicia um temporizador para um exercício individual.
     * @param {object} item - O objeto do exercício.
     * @param {number} duration - A duração do exercício em segundos.
     */
    startTimer(item, duration) {
        if (!profileManager.consumeStamina(item.staminaCost)) {
            uiManager.showNotification("Energia insuficiente!", "⚡");
            return;
        }

        const timerId = item.id;
        if (activeTimers[timerId] || !audioSynth) return;

        audioSynth.triggerAttackRelease('C5', '8n', Tone.now());
        
        // A UI é atualizada no uiManager, que será chamado a partir do app.js
        // uiManager.showStopButton(timerId); 

        let secondsElapsed = 0;
        const totalDuration = duration;

        const interval = setInterval(() => {
            secondsElapsed++;
            uiManager.updateTimerDisplay(timerId, secondsElapsed);
            uiManager.setTimerProgress(timerId, (secondsElapsed / totalDuration) * 100);

            if (secondsElapsed >= totalDuration) {
                profileManager.addXp(item.xp, item.id);
                if(audioSynth) audioSynth.triggerAttackRelease('G5', '4n', Tone.now());
                this.stopTimer(item, false, duration);
            }
        }, 1000);

        activeTimers[timerId] = { interval, startTime: Date.now(), item };
    },

    /**
     * Para um temporizador de exercício.
     * @param {object} item - O objeto do exercício.
     * @param {boolean} userCancelled - Se o utilizador parou o temporizador manualmente.
     * @param {number} duration - A duração total do exercício.
     */
    stopTimer(item, userCancelled, duration) {
        const timerId = item.id;
        const timer = activeTimers[timerId];
        if (!timer) return;

        if (audioSynth && userCancelled) audioSynth.triggerAttackRelease('C4', '8n', Tone.now());

        clearInterval(timer.interval);
        
        const durationSeconds = Math.round((Date.now() - timer.startTime) / 1000);
        
        if (userCancelled) {
            let xpGained = 0;
            const totalDuration = duration || item.duration;
            const tier1 = totalDuration * 0.33;
            const tier2 = totalDuration * 0.66;
            
            if (durationSeconds >= tier2) xpGained = Math.round(item.xp * 0.6);
            else if (durationSeconds >= tier1) xpGained = Math.round(item.xp * 0.3);
            
            profileManager.addXp(xpGained, item.id);
        }
        
        // profileManager.updateTrainingStats(item.id, durationSeconds);
        delete activeTimers[timerId];
        uiManager.resetTimerCard(timerId);

        if (userCancelled) {
            uiManager.showNotification("Treino interrompido.", "❌");
        }
    },

    // ... A lógica para startTrainingPlan, stopTrainingPlan, etc., seria movida para aqui
    // de forma semelhante, interagindo com os outros módulos.
};
