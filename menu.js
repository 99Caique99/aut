        document.addEventListener('DOMContentLoaded', () => {

            /**
             * Adiciona compromissos de exemplo ao localStorage se não houver nenhum.
             * Útil para demonstração e desenvolvimento.
     

            /**
             * Anima a saudação com um efeito de "máquina de escrever".
             * @param {HTMLElement} el - O elemento HTML da saudação.
             * @param {string} text - O texto a ser exibido.
             */
            function animarSaudacao(el, text) {
                let i = 0;
                el.textContent = '';
                const typing = setInterval(() => {
                    if (i < text.length) {
                        el.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typing);
                    }
                }, 50); // Velocidade da digitação
            }

            /**
             * Carrega os dados do usuário e personaliza a saudação na tela.
             */
            function personalizarSaudacao() {
                const nome = localStorage.getItem('nomeUsuario') || '';
                const genero = localStorage.getItem('generoUsuario') || '';
                const saudacaoEl = document.getElementById('saudacao');
                let textoFinal = "Olá! Bem-vindo(a)!";

                if (nome && genero) {
                    let prefixo = 'Bem-vindo(a),';
                    if (genero.toLowerCase() === 'mamãe') prefixo = 'Bem-vinda,';
                    else if (genero.toLowerCase() === 'papai') prefixo = 'Bem-vindo,';
                    
                    const generoCapitalizado = genero.charAt(0).toUpperCase() + genero.slice(1);
                    textoFinal = `${prefixo} ${generoCapitalizado} ${nome}!`;
                }
                
                animarSaudacao(saudacaoEl, textoFinal);
            }

            /**
             * Busca, filtra e exibe os próximos 3 compromissos futuros.
             */
            function mostrarProximosCompromissos() {
                const compromissos = JSON.parse(localStorage.getItem('appointments') || '[]');
                const agora = new Date();

                const proximosCompromissos = compromissos
                    .map(c => ({ ...c, fullDate: new Date(`${c.date}T${c.time || '00:00:00'}`) }))
                    .filter(c => c.fullDate >= agora)
                    .sort((a, b) => a.fullDate - b.fullDate)
                    .slice(0, 3);

                const listaEl = document.getElementById('lista-compromissos');
                listaEl.innerHTML = '';

                if (proximosCompromissos.length === 0) {
                    listaEl.innerHTML = '<li class="nenhum-compromisso">Você não tem compromissos futuros.</li>';
                    return;
                }

                proximosCompromissos.forEach((c, index) => {
                    const li = document.createElement('li');
                    li.style.animationDelay = `${index * 0.1 + 0.8}s`; // Animação escalonada
                    
                    const dataFormatada = c.fullDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                    const horaFormatada = c.fullDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    li.innerHTML = `
                        <div class="compromisso-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                        </div>
                        <div class="compromisso-details">
                            <strong>${c.title}</strong>
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                ${c.location || 'Local não informado'}
                            </p>
                        </div>
                    `;
                    listaEl.appendChild(li);
                });
            }

            // --- INICIALIZAÇÃO ---
            criarCompromissosDeExemplo();
            personalizarSaudacao();
            mostrarProximosCompromissos();
        });