  // --- DOM Elements ---
        const emotionSelector = document.getElementById("emotion-selector");
        const formEmocao = document.getElementById("formEmocao");
        const mesSelecionado = document.getElementById("mesSelecionado");
        const anoSelecionado = document.getElementById("anoSelecionado");
        let selectedEmotion = null;
        let graficoEmocoes = null;

        // --- Data ---
        let emocoes = JSON.parse(localStorage.getItem("emocoes")) || [];

        // --- Functions ---
        
        // Criar partículas de fundo
        const createParticles = () => {
            const container = document.getElementById('particle-container');
            const particleCount = 30;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                const size = Math.random() * 3 + 1;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.bottom = `-${Math.random() * 20}%`;
                particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
                particle.style.animationDelay = `${Math.random() * 10}s`;
                container.appendChild(particle);
            }
        };
        
        const preencherSeletoresMesAno = () => {
            const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            meses.forEach((nome, i) => {
                const opt = new Option(nome, String(i + 1).padStart(2, '0'));
                mesSelecionado.add(opt);
            });

            const anoAtual = new Date().getFullYear();
            for (let a = anoAtual; a >= anoAtual - 3; a--) {
                const opt = new Option(a, a);
                anoSelecionado.add(opt);
            }
            mesSelecionado.value = String(new Date().getMonth() + 1).padStart(2, '0');
            anoSelecionado.value = anoAtual;
        };
        
        const handleEmotionSelection = (e) => {
            const button = e.target.closest('.emotion-btn');
            if (!button) return;

            document.querySelectorAll('.emotion-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedEmotion = button.dataset.emotion;
        };
        
        const handleFormSubmit = (e) => {
            e.preventDefault();
            const data = document.getElementById("dataEmocao").value;
            if (!selectedEmotion || !data) {
                // Usar um pop-up mais sutil no futuro
                alert("Por favor, selecione uma emoção e uma data.");
                return;
            }
            emocoes.unshift({ emocao: selectedEmotion, data });
            localStorage.setItem("emocoes", JSON.stringify(emocoes));
            
            document.querySelectorAll('.emotion-btn').forEach(btn => btn.classList.remove('selected'));
            selectedEmotion = null;
            document.getElementById("dataEmocao").valueAsDate = new Date();
            
            atualizarGraficoEmocoes();
        };

        const atualizarGraficoEmocoes = () => {
            const mes = mesSelecionado.value;
            const ano = anoSelecionado.value;
            const contagem = { Feliz: 0, Calmo: 0, Triste: 0, Ansioso: 0, Raiva: 0 };
            
            emocoes.forEach(e => {
                const [y, m] = e.data.split("-");
                if (y === ano && m === mes && contagem.hasOwnProperty(e.emocao)) {
                    contagem[e.emocao]++;
                }
            });

            const ctx = document.getElementById('graficoEmocoes').getContext('2d');
            if (graficoEmocoes) graficoEmocoes.destroy();
            
            graficoEmocoes = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Feliz', 'Calmo', 'Triste', 'Ansioso', 'Raiva'],
                    datasets: [{
                        data: [contagem.Feliz, contagem.Calmo, contagem.Triste, contagem.Ansioso, contagem.Raiva],
                        backgroundColor: ['#60a5fa', '#818cf8', '#a78bfa', '#facc15', '#fb7185'],
                        borderColor: 'transparent',
                        borderWidth: 4,
                        hoverOffset: 12
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                color: '#94a3b8', // Cor da legenda
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#1e293b',
                            titleFont: { size: 14 },
                            bodyFont: { size: 12 },
                            padding: 10,
                            cornerRadius: 8
                        }
                    }
                }
            });
        };

        // --- Event Listeners ---
        emotionSelector.addEventListener("click", handleEmotionSelection);
        formEmocao.addEventListener("submit", handleFormSubmit);
        mesSelecionado.addEventListener("change", atualizarGraficoEmocoes);
        anoSelecionado.addEventListener("change", atualizarGraficoEmocoes);

        // --- Initializations ---
        document.getElementById("dataEmocao").valueAsDate = new Date();
        preencherSeletoresMesAno();
        atualizarGraficoEmocoes();
        createParticles();