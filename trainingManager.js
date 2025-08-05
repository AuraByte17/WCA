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

/**
 * Inicializa o sintetizador de áudio usando Tone.js.
 * É chamado uma vez quando o utilizador interage com a página.
 */
function initAudio() {
    if (Tone.context.state !== 'running') {
        Tone.start().then(() => {
            if (!audioSynth) {
                audioSynth = new Tone.Synth().toDestination();
                console.log("Contexto de áudio iniciado pelo Training Manager.");
            }
        });
    } else if (!audioSynth) {
        audioSynth = new Tone.Synth().toDestination();
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
        document.body.addEventListener('click', initAudio, { once: true });
        document.body.addEventListener('touchend', initAudio, { once: true });
    },

    /**
     * Inicia um temporizador para um exercício individual.
     * @param {object} item - O objeto do exercício.
     */
    startTimer(item) {
        if (!profileManager.consumeStamina(item.staminaCost)) {
            uiManager.showNotification("Energia insuficiente!", "⚡");
            return;
        }

        const timerId = item.id;
        if (activeTimers[timerId]) return; // Já está a correr

        if (audioSynth) audioSynth.triggerAttackRelease('C5', '8n', Tone.now());
        
        // A UI é atualizada no uiManager, que será chamado a partir do app.js
        uiManager.showStopButton(timerId); 

        let secondsRemaining = item.duration;
        const totalDuration = item.duration;
        
        uiManager.updateTimerDisplay(timerId, secondsRemaining);
        uiManager.setTimerProgress(timerId, 0);

        const interval = setInterval(() => {
            secondsRemaining--;
            const elapsed = totalDuration - secondsRemaining;
            uiManager.updateTimerDisplay(timerId, secondsRemaining);
            uiManager.setTimerProgress(timerId, (elapsed / totalDuration) * 100);

            if (secondsRemaining <= 0) {
                // Treino concluído com sucesso
                profileManager.addXp(item.xp, item.id);
                if(audioSynth) audioSynth.triggerAttackRelease('G5', '4n', Tone.now());
                uiManager.showNotification(`+${item.xp} XP! Treino concluído.`, "🎉");
                this.stopTimer(item, false); // Não foi cancelado pelo utilizador
            }
        }, 1000);

        activeTimers[timerId] = { interval, startTime: Date.now(), item };
    },

    /**
     * Para um temporizador de exercício.
     * @param {object} item - O objeto do exercício.
     * @param {boolean} userCancelled - Se o utilizador parou o temporizador manualmente.
     */
    stopTimer(item, userCancelled) {
        const timerId = item.id;
        const timer = activeTimers[timerId];
        if (!timer) return;

        clearInterval(timer.interval);

        if (userCancelled) {
            if (audioSynth) audioSynth.triggerAttackRelease('C4', '8n', Tone.now());
            
            const elapsedSeconds = Math.round((Date.now() - timer.startTime) / 1000);
            let xpGained = 0;
            const totalDuration = item.duration;
            
            // Recompensa parcial se cancelado
            if (elapsedSeconds >= totalDuration * 0.75) {
                xpGained = Math.round(item.xp * 0.5);
            } else if (elapsedSeconds >= totalDuration * 0.4) {
                xpGained = Math.round(item.xp * 0.25);
            }
            
            if (xpGained > 0) {
                profileManager.addXp(xpGained, item.id);
                uiManager.showNotification(`+${xpGained} XP! Treino interrompido.`, "👍");
            } else {
                uiManager.showNotification("Treino interrompido.", "❌");
            }
        }
        
        delete activeTimers[timerId];
        // CORREÇÃO: Passa a duração original para o reset
        uiManager.resetTimerCard(timerId, item.duration);
    },
};
