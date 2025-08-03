// --- DADOS ---

const BELT_SYSTEM = [
    { level: 0, name: "Cinturão Branco", minXp: 0, color: "#ecf0f1", secondaryColor: "#bdc3c7" },
    { level: 1, name: "Cinturão Amarelo - Wing Chun", minXp: 250, color: "#f1c40f", secondaryColor: "#f39c12" },
    { level: 2, name: "Cinturão Laranja - Siu Nim Tao", minXp: 700, color: "#e67e22", secondaryColor: "#d35400" },
    { level: 3, name: "Cinturão Vermelho - Cham Kiu", minXp: 1500, color: "#e74c3c", secondaryColor: "#c0392b" },
    { level: 4, name: "Cinturão Verde - Muk Yan Jong", minXp: 2500, color: "#2ecc71", secondaryColor: "#27ae60" },
    { level: 5, name: "Cinturão Castanho - Biu Jee", minXp: 4000, color: "#a1662f", secondaryColor: "#6d4c41" },
    { level: 6, name: "Cinturão Preto", minXp: 6000, color: "#2c3e50", secondaryColor: "#000000" },
    { level: 7, name: "Cinturão Preto I - Luk Dim Boon Kwan", minXp: 8500, color: "#000000", secondaryColor: "#34495e" },
    { level: 8, name: "Cinturão Preto II - Baat Jaam Do", minXp: 12000, color: "#000000", secondaryColor: "#e74c3c" },
];

const WING_CHUN_TRAINING = {
    "Fundamentos (Nível Branco)": [
        { id: "wc1", title: "Yee Jee Kim Yeung Ma", description: "A postura base de treino. Foco na estrutura, relaxamento e enraizamento.", xp: 5, requiredBelt: 0, difficulty: 'Iniciante', videoPath: "videos/Yee_Jee_Kim_Yeung_Ma.mp4" },
        { id: "wc3", title: "Soco Direto (Yat Chi Kuen)", description: "O soco em cadeia vertical. Foco na estrutura e relaxamento, não na força bruta.", xp: 5, requiredBelt: 0, difficulty: 'Iniciante', videoPath: "videos/Soco_Direto.mp4" },
        { id: "wc4", title: "Cavalo que Avança (Seung Ma)", description: "Treino de avanço mantendo a estrutura e a linha central, para encurtar a distância.", xp: 10, requiredBelt: 0, difficulty: 'Iniciante', videoPath: "videos/Seung_Ma.mp4" },
    ],
    "Currículo (Nível Amarelo)": [
        { id: "wc5", title: "A Pequena Ideia (Siu Nim Tao)", description: "A primeira forma, base de todo o sistema. Praticar até memorizar todos os movimentos.", xp: 50, requiredBelt: 1, difficulty: 'Iniciante', videoPath: "videos/Siu_Nim_Tao.mp4" },
        { id: "wc6", title: "Andamentos (Juen Ma)", description: "Praticar o 'Cavalo que Gira' para ambos os lados, mantendo a estabilidade.", xp: 15, requiredBelt: 1, difficulty: 'Iniciante', videoPath: "videos/Juen_Ma.mp4" },
        { id: "wc7", title: "Socos nos Mitts", description: "Praticar sequências de 1, 2 e 3 socos em YJKYM, e depois combinar com Juen Ma e Seung Ma.", xp: 20, requiredBelt: 1, difficulty: 'Iniciante', videoPath: "videos/Socos_Mitts.mp4" },
        { id: "wc8", title: "Pontapés (Gerk)", description: "Praticar o pontapé Frontal (Jing Gerk) e o Lateral (Wang Gerk).", xp: 20, requiredBelt: 1, difficulty: 'Iniciante', videoPath: "videos/Gerk.mp4" },
        { id: "wc9", title: "Soco Barra Soco (Kuen Siu Kuen)", description: "Exercício de coordenação de defesa e ataque, em YJKYM e Juen Ma.", xp: 25, requiredBelt: 1, difficulty: 'Iniciante', videoPath: "videos/Kuen_Siu_Kuen.mp4" },
        { id: "wc10", title: "Exercício de Pak Sao", description: "Praticar as combinações de Pak Da, Tan Da e Kuen Siu Kuen em movimento (Seung Ma).", xp: 30, requiredBelt: 1, difficulty: 'Intermédio', videoPath: "videos/Pak_Sao_Exercicio.mp4" },
        { id: "wc11", title: "Quatro Portões", description: "Treinar a defesa dos quatro quadrantes com as combinações Tan Da e Gaun Da.", xp: 30, requiredBelt: 1, difficulty: 'Intermédio', videoPath: "videos/Quatro_Portoes.mp4" },
        { id: "wc12", title: "Mãos que Agarram (Lap Sao)", description: "Praticar as 3 trocas: Lap Sao, Soco, Gum Da, para desenvolver sensibilidade e controlo.", xp: 35, requiredBelt: 1, difficulty: 'Intermédio', videoPath: "videos/Lap_Sao.mp4" },
        { id: "wc13", title: "Mãos Coladas (Dan Chi Sao)", description: "Praticar a troca em Tan Sao e as combinações de ataque e defesa em movimento.", xp: 40, requiredBelt: 1, difficulty: 'Intermédio', videoPath: "videos/Dan_Chi_Sao.mp4" },
        { id: "wc14", title: "Mãos que Enrolam (Look Sao)", description: "Praticar a troca em Tan para desenvolver a fluidez e a capacidade de redirecionar a força.", xp: 40, requiredBelt: 1, difficulty: 'Intermédio', videoPath: "videos/Look_Sao.mp4" },
    ],
    "Técnicas Avançadas": [
        { id: "wc15", title: "Cham Kiu (Procurar a Ponte)", description: "A segunda forma. Foco na unidade corporal, rotação, passos e pontapés.", xp: 150, requiredBelt: 3, difficulty: 'Intermédio', videoPath: "videos/Cham_Kiu.mp4" },
        { id: "wc16", title: "Muk Yan Jong (Homem de Madeira)", description: "Treino na forma do boneco de madeira para refinar ângulos, posições e força.", xp: 200, requiredBelt: 4, difficulty: 'Avançado', videoPath: "videos/Muk_Yan_Jong.mp4" },
        { id: "wc17", title: "Biu Jee (Dedos que Furam)", description: "A terceira forma, focada em técnicas de emergência e recuperação da linha central.", xp: 250, requiredBelt: 5, difficulty: 'Avançado', videoPath: "videos/Biu_Jee.mp4" },
        { id: "wc18", title: "Luk Dim Boon Kwan (Bastão Longo)", description: "Treino com o bastão de 6 pontos e meio para desenvolver força e precisão.", xp: 300, requiredBelt: 7, difficulty: 'Avançado', videoPath: "videos/Bastao.mp4" },
        { id: "wc19", title: "Baat Jaam Do (Facas de Oito Cortes)", description: "Treino com as facas borboleta, a extensão máxima das mãos do praticante.", xp: 350, requiredBelt: 8, difficulty: 'Avançado', videoPath: "videos/Facas.mp4" },
    ]
};

const CONDITIONING_TRAINING = {
    "Introdução ao Condicionamento (Nível Branco)": [
        { id: "c1", title: "Flexões (Prática)", description: "Desenvolve a força do tronco e braços. Começa com um número confortável e aumenta gradualmente.", xp: 10, requiredBelt: 0, difficulty: 'Iniciante', videoPath: "videos/Flexoes.mp4" },
        { id: "c2", title: "Agachamentos (Prática)", description: "Desenvolve a força das pernas para uma postura estável. Mantém as costas direitas.", xp: 10, requiredBelt: 0, difficulty: 'Iniciante', videoPath: "videos/Agachamentos.mp4" },
        { id: "c3", title: "Prancha (Prática)", description: "Fortalece o core para manter a estrutura. Tenta aguentar por períodos crescentes.", xp: 10, requiredBelt: 0, difficulty: 'Iniciante', videoPath: "videos/Prancha.mp4" },
    ],
    "Metas de Condicionamento (Nível Amarelo)": [
        { id: "c4", title: "Meta: 30 Flexões", description: "Completa este desafio para testar a tua força. As raparigas podem fazer de joelhos.", xp: 35, requiredBelt: 1, difficulty: 'Iniciante', videoPath: "videos/Flexoes_Teste.mp4" },
        { id: "c5", title: "Meta: 1 Minuto em Prancha", description: "Completa este desafio para testar a resistência do teu core.", xp: 35, requiredBelt: 1, difficulty: 'Iniciante', videoPath: "videos/Prancha_Teste.mp4" },
        { id: "c6", title: "Meta: 30 Agachamentos", description: "Completa este desafio para testar a força e resistência das tuas pernas.", xp: 35, requiredBelt: 1, difficulty: 'Iniciante', videoPath: "videos/Agachamentos_Teste.mp4" },
    ],
};

const ULTIMATE_GUIDE_CONTENT = {
    "Introdução: Os 3 Pilares da Mestria": {
        text: "O desempenho de topo em Wing Chun não é apenas o resultado da prática técnica isolada. É um estado alcançado através da integração sinérgica de três pilares: Mestria Técnica, Condicionamento de Elite e Nutrição de Precisão. Este guia oferece um mapa para forjar o corpo e abastecer o motor biológico que executa as técnicas com eficiência devastadora."
    },
    "Condicionamento Físico de Elite": {
        text: "O seu corpo é o veículo que expressa a sua técnica. Um condicionamento superior transforma a teoria em realidade. O objetivo não é o volume muscular, mas a eficiência neuromuscular e a capacidade de gerar e absorver força de forma estrutural.",
        points: [
            "<strong>Força Explosiva e Reativa:</strong> Essencial para a potência dos socos em cadeia. Exercícios como flexões pliométricas e saltos à caixa treinam as fibras musculares de contração rápida.",
            "<strong>Força Isométrica:</strong> A capacidade de manter a estrutura sob pressão. Pranchas, isometria na parede (wall sits) e a própria postura Yee Jee Kim Yeung Ma são fundamentais.",
            "<strong>Resistência Cardiovascular:</strong> Treinos de alta intensidade (HIIT) e corrida de média distância são cruciais para manter a performance durante o Chi Sao ou um confronto real.",
            "<strong>Treino do Core:</strong> Um core forte (abdominais, oblíquos, lombar) é a ponte que liga a força das pernas à dos braços. Rotações com elásticos e levantamento de pernas são excelentes."
        ]
    },
    "Flexibilidade Funcional": {
        text: "A flexibilidade no Wing Chun não se trata de espargatas, mas de mobilidade articular e elasticidade muscular para permitir movimentos fluidos, rápidos e prevenir lesões.",
        points: [
            "<strong>Aquecimento (Dinâmico):</strong> Antes de treinar, foque-se em alongamentos que imitam os movimentos da arte. Rotações de braços e ancas, balanços de pernas (frontais e laterais) e agachamentos sem peso preparam o corpo para o esforço.",
            "<strong>Recuperação (Estático):</strong> Após o treino, com os músculos quentes, foque-se em alongamentos mantidos por 20-30 segundos. Dê especial atenção aos ombros (alongamento transverso), pulsos, isquiotibiais e flexores da anca.",
            "<strong>Libertação Miofascial:</strong> O uso de um rolo de espuma (foam roller) nas costas, pernas e ombros pode ajudar a libertar tensão muscular, melhorar a circulação e acelerar a recuperação."
        ]
    },
    "Nutrição de Precisão para o Artista Marcial": {
        text: "A nutrição é o combustível para o seu motor biológico. Uma alimentação adequada otimiza a recuperação, fornece energia para treinos exigentes e melhora a clareza mental.",
        points: [
            "<strong>Proteínas (Os Tijolos):</strong> Essenciais para a reparação e construção muscular. Consuma fontes magras como frango, peixe, ovos, iogurte grego e leguminosas em todas as refeições principais. A recomendação para atletas ronda os 1.6-2.2g por kg de peso corporal.",
            "<strong>Hidratos de Carbono (A Energia):</strong> O combustível primário. Opte por fontes complexas como aveia, batata-doce, arroz integral e quinoa para uma libertação de energia sustentada. Consuma hidratos mais simples (fruta, mel) perto dos treinos para energia rápida.",
            "<strong>Gorduras Saudáveis (O Óleo do Motor):</strong> Cruciais para a função hormonal e saúde articular. Inclua abacate, azeite, frutos secos e peixes gordos (salmão) na sua dieta.",
            "<strong>Hidratação:</strong> A desidratação, mesmo que ligeira, afeta drasticamente a performance. Beba água consistentemente ao longo do dia. O objetivo é cerca de 30-40ml por kg de peso corporal, mais o que for perdido durante o treino.",
            "<strong>Timing das Refeições:</strong> Consuma uma refeição equilibrada 2-3 horas antes de treinar. Após o treino, numa janela de 1-2 horas, consuma uma refeição rica em proteínas e hidratos de carbono para otimizar a recuperação."
        ]
    }
};

const ALL_TRAINING_ITEMS = [];
Object.values(WING_CHUN_TRAINING).forEach(cat => ALL_TRAINING_ITEMS.push(...cat));
Object.values(CONDITIONING_TRAINING).forEach(cat => ALL_TRAINING_ITEMS.push(...cat));

const ACHIEVEMENTS = {
    'BEGINNER': { title: 'Um Novo Começo', desc: 'Começa a tua jornada de Wing Chun.', icon: '🌱', check: (p) => p.xp > 0 },
    'YELLOW_BELT': { title: 'Cinturão Amarelo', desc: 'Alcança o primeiro nível de Wing Chun.', icon: '🟡', check: (p) => getUserBelt(p.xp).level >= 1 },
    'ORANGE_BELT': { title: 'Mestre da Siu Nim Tao', desc: 'Alcança o nível de Cinturão Laranja.', icon: '🟠', check: (p) => getUserBelt(p.xp).level >= 2 },
    'RED_BELT': { title: 'Mestre da Cham Kiu', desc: 'Alcança o nível de Cinturão Vermelho.', icon: '🔴', check: (p) => getUserBelt(p.xp).level >= 3 },
    'STREAK_7': { title: 'Aluno Dedicado', desc: 'Completa uma sequência de 7 dias de treino.', icon: '🔥', check: (p) => p.streak >= 7 },
    'STREAK_30': { title: 'Vontade de Ferro', desc: 'Completa uma sequência de 30 dias de treino.', icon: '❤️‍🔥', check: (p) => p.streak >= 30 },
};

const PROFILE_STORAGE_KEY = 'wingChunProfile_v7_pt';
          
