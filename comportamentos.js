  const form = document.getElementById("formulario-de-comportamento");
        const lista = document.getElementById("lista-de-comportamentos");
        const botaoEnviar = document.getElementById('botao-enviar');
        const janelaModal = document.getElementById('janela-confirmar-exclusao');
        const botaoCancelar = document.getElementById('botao-cancelar-exclusao');
        const botaoConfirmar = document.getElementById('botao-confirmar-exclusao');

        let listaDeComportamentos = JSON.parse(localStorage.getItem("comportamentos")) || [];
        let itemSendoEditado = null;
        let itemParaExcluir = null;

        const mostrarListaNaTela = () => {
            lista.innerHTML = "";
            if(listaDeComportamentos.length === 0) {
                 lista.innerHTML = `<li class="text-center text-slate-500 p-4">Nenhum comportamento registrado ainda.</li>`;
                 return;
            }
            listaDeComportamentos.forEach((item, indice) => {
                const elementoDaLista = document.createElement("li");
                elementoDaLista.className = "animacao-entrada bg-blue-500/5 p-4 rounded-xl flex justify-between items-center border border-transparent hover:border-blue-300 hover:bg-blue-500/10 transition-all group";
                elementoDaLista.style.animationDelay = `${indice * 70}ms`;
                
                elementoDaLista.innerHTML = `
                    <div class="flex-1 min-w-0">
                        <p class="font-semibold text-slate-700 truncate">${item.comportamento} - <span class="font-normal text-slate-500">${formatarDataParaExibir(item.data)}</span></p>
                        <p class="text-slate-600 text-sm mt-1">${item.observacoes || 'Nenhuma observação.'}</p>
                    </div>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform-gpu group-hover:translate-x-0 translate-x-4">
                        <button onclick="editarItem(${indice})" class="p-2 text-slate-500 hover:text-blue-500 transition" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                        </button>
                        <button onclick="abrirJanelaDeExclusao(${indice})" class="p-2 text-slate-500 hover:text-red-500 transition" title="Excluir">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                        </button>
                    </div>
                `;
                lista.appendChild(elementoDaLista);
            });
        }

        form.addEventListener("submit", (evento) => {
            evento.preventDefault();
            const comportamento = document.getElementById("campo-comportamento").value.trim();
            const data = document.getElementById("campo-data").value;
            const observacoes = document.getElementById("campo-observacoes").value.trim();

            if (!comportamento || !data) return;

            const novoRegistro = { comportamento, data, observacoes };

            if (itemSendoEditado !== null) {
                listaDeComportamentos[itemSendoEditado] = novoRegistro;
                itemSendoEditado = null;
                botaoEnviar.textContent = "Adicionar Registro";
                botaoEnviar.classList.remove('from-green-500', 'to-emerald-500', 'hover:from-green-600', 'hover:to-emerald-600');
                botaoEnviar.classList.add('from-blue-500', 'to-cyan-500', 'hover:from-blue-600', 'hover:to-cyan-600');
            } else {
                listaDeComportamentos.unshift(novoRegistro);
            }

            localStorage.setItem("comportamentos", JSON.stringify(listaDeComportamentos));
            form.reset();
            document.getElementById("campo-comportamento").focus();
            mostrarListaNaTela();
        });

        window.editarItem = (indice) => {
            const item = listaDeComportamentos[indice];
            document.getElementById("campo-comportamento").value = item.comportamento;
            document.getElementById("campo-data").value = item.data;
            document.getElementById("campo-observacoes").value = item.observacoes;
            itemSendoEditado = indice;
            botaoEnviar.textContent = "Salvar Alterações";
            botaoEnviar.classList.remove('from-blue-500', 'to-cyan-500', 'hover:from-blue-600', 'hover:to-cyan-600');
            botaoEnviar.classList.add('from-green-500', 'to-emerald-500', 'hover:from-green-600', 'hover:to-emerald-600');
            document.getElementById("campo-comportamento").focus();
        }

        window.abrirJanelaDeExclusao = (indice) => {
            itemParaExcluir = indice;
            janelaModal.classList.remove('hidden');
            janelaModal.classList.add('flex');
        }

        const fecharJanelaDeExclusao = () => {
            janelaModal.classList.add('hidden');
            janelaModal.classList.remove('flex');
            itemParaExcluir = null;
        }

        botaoCancelar.addEventListener('click', fecharJanelaDeExclusao);
        
        botaoConfirmar.addEventListener('click', () => {
             if (itemParaExcluir !== null) {
                listaDeComportamentos.splice(itemParaExcluir, 1);
                localStorage.setItem("comportamentos", JSON.stringify(listaDeComportamentos));
                mostrarListaNaTela();
            }
            fecharJanelaDeExclusao();
        });
        
        janelaModal.addEventListener('click', (evento) => {
            if (evento.target === janelaModal) {
                fecharJanelaDeExclusao();
            }
        });

        const formatarDataParaExibir = (dataISO) => {
            if(!dataISO) return '';
            const [ano, mes, dia] = dataISO.split("-");
            return `${dia}/${mes}/${ano}`;
        }

        mostrarListaNaTela();