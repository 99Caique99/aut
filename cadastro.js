 const form = document.getElementById("formCadastro");
        const infoContainer = document.getElementById("info-salva-container");
        const deleteModal = document.getElementById('deleteModal');
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        const cancelDeleteBtn = document.getElementById('cancelDelete');

        const closeModal = () => {
            deleteModal.classList.add('hidden');
            deleteModal.classList.remove('flex');
        };
        
        const calcularIdade = (dataNascimento) => {
            if (!dataNascimento) return 'N/A';
            const hoje = new Date();
            const nascimento = new Date(dataNascimento);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
            return idade;
        };

        const formatarData = (data) => {
            if (!data) return 'Não informada';
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        }

        const mostrarInfo = () => {
            const dados = JSON.parse(localStorage.getItem("dadosCrianca"));
            infoContainer.innerHTML = "";

            if (dados) {
                const idadeCalculada = calcularIdade(dados.dataNascimento);
                const dataFormatada = formatarData(dados.dataNascimento);

                const infoCard = document.createElement("div");
                infoCard.className = "cartao-entrando bg-blue-900/10 border border-white/10 backdrop-blur-xl rounded-lg p-4 space-y-3";
                infoCard.innerHTML = `
                    <h2 class="text-xl font-semibold text-center text-slate-200 mb-3">Informações Salvas</h2>
                    <div class="text-left space-y-2 text-slate-300">
                        <p><strong>Nome:</strong> ${dados.nome}</p>
                        <p><strong>Idade:</strong> ${idadeCalculada} anos (Nasc: ${dataFormatada})</p>
                        <p><strong>Gênero:</strong> ${dados.genero || 'Não informado'}</p>
                        <p><strong>Diagnóstico:</strong> ${dados.diagnostico || 'Não informado'}</p>
                        <p><strong>Observações:</strong> ${dados.observacoes || 'Nenhuma'}</p>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button onclick="editar()" class="flex-1 p-2 bg-slate-200/10 hover:bg-slate-200/20 text-slate-200 rounded-md transition text-sm font-semibold">Editar</button>
                        <button onclick="excluir()" class="flex-1 p-2 bg-red-500/70 hover:bg-red-500/90 text-white rounded-md transition text-sm font-semibold">Excluir</button>
                    </div>
                `;
                infoContainer.appendChild(infoCard);
            } else {
                infoContainer.innerHTML = `<p class="text-center text-slate-400">Nenhuma informação salva.</p>`;
            }
        };

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const dados = {
                nome: document.getElementById("nome").value,
                dataNascimento: document.getElementById("dataNascimento").value,
                genero: document.getElementById("genero").value,
                diagnostico: document.getElementById("diagnostico").value,
                observacoes: document.getElementById("observacoes").value
            };
            localStorage.setItem("dadosCrianca", JSON.stringify(dados));
            mostrarInfo();
            form.reset();
        });

        window.editar = () => {
            const dados = JSON.parse(localStorage.getItem("dadosCrianca"));
            if (dados) {
                document.getElementById("nome").value = dados.nome;
                document.getElementById("dataNascimento").value = dados.dataNascimento;
                document.getElementById("genero").value = dados.genero;
                document.getElementById("diagnostico").value = dados.diagnostico;
                document.getElementById("observacoes").value = dados.observacoes;
                document.getElementById("nome").focus();
            }
        };
        
        window.excluir = () => {
            deleteModal.classList.remove('hidden');
            deleteModal.classList.add('flex');
        };

        confirmDeleteBtn.addEventListener('click', () => {
            localStorage.removeItem("dadosCrianca");
            mostrarInfo();
            closeModal();
        });

        cancelDeleteBtn.addEventListener('click', closeModal);
        
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeModal();
        });

        mostrarInfo();