const form = document.getElementById("formCadastro");
        const infoContainer = document.getElementById("info-salva-container");

        const mostrarInfo = () => {
            const dados = JSON.parse(localStorage.getItem("dadosCrianca"));
            infoContainer.innerHTML = ""; // Limpa a área
            if (dados) {
                const infoCard = document.createElement("div");
                infoCard.className = "info-card-enter glass-card rounded-lg p-4 space-y-2";
                infoCard.innerHTML = `
                    <h2 class="text-xl font-semibold text-center text-slate-600 mb-3">Informações Salvas</h2>
                    <p class="text-slate-700"><strong>Nome:</strong> ${dados.nome}</p>
                    <p class="text-slate-700"><strong>Idade:</strong> ${dados.idade}</p>
                    <p class="text-slate-700"><strong>Diagnóstico:</strong> ${dados.diagnostico || 'Não informado'}</p>
                    <p class="text-slate-700"><strong>Observações:</strong> ${dados.observacoes || 'Nenhuma'}</p>
                    <div class="flex gap-2 pt-3">
                        <button onclick="editar()" class="flex-1 p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-md transition text-sm font-semibold">Editar</button>
                        <button onclick="excluir()" class="flex-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition text-sm font-semibold">Excluir</button>
                    </div>
                `;
                infoContainer.appendChild(infoCard);
            } else {
                infoContainer.innerHTML = `<p class="text-center text-slate-500">Nenhuma informação salva.</p>`;
            }
        };

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const dados = {
                nome: document.getElementById("nome").value,
                idade: document.getElementById("idade").value,
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
                document.getElementById("idade").value = dados.idade;
                document.getElementById("diagnostico").value = dados.diagnostico;
                document.getElementById("observacoes").value = dados.observacoes;
                document.getElementById("nome").focus();
            }
        };

        window.excluir = () => {
            // Usando um modal customizado no futuro seria melhor
            if (confirm("Tem certeza que deseja excluir as informações?")) {
                localStorage.removeItem("dadosCrianca");
                mostrarInfo();
            }
        };

        mostrarInfo();