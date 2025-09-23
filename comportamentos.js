  const form = document.getElementById("formComportamento");
        const lista = document.getElementById("listaComportamentos");
        const submitButton = document.getElementById('submit-button');
        const deleteModal = document.getElementById('delete-modal');
        const cancelDeleteBtn = document.getElementById('cancel-delete');
        const confirmDeleteBtn = document.getElementById('confirm-delete');

        let comportamentos = JSON.parse(localStorage.getItem("comportamentos")) || [];
        let editandoIndex = null;
        let indexParaExcluir = null;

        const renderizarLista = () => {
            lista.innerHTML = "";
            if(comportamentos.length === 0) {
                 lista.innerHTML = `<li class="text-center text-slate-500">Nenhum comportamento registrado ainda.</li>`;
            }
            comportamentos.forEach((item, index) => {
                const li = document.createElement("li");
                li.className = "list-item-enter bg-white/5 p-4 rounded-lg flex justify-between items-center border border-transparent hover:border-indigo-500/50 transition-all";
                li.innerHTML = `
                    <div>
                        <p class="font-semibold text-slate-100">${item.comportamento} - <span class="font-normal text-slate-400">${formatarData(item.data)}</span></p>
                        <p class="text-slate-300 text-sm">${item.observacoes || 'Nenhuma observação.'}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="editar(${index})" class="p-2 text-slate-400 hover:text-indigo-400 transition" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                        </button>
                        <button onclick="abrirModalExclusao(${index})" class="p-2 text-slate-400 hover:text-red-400 transition" title="Excluir">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                        </button>
                    </div>
                `;
                lista.appendChild(li);
            });
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const comportamento = document.getElementById("comportamento").value.trim();
            const data = document.getElementById("data").value;
            const observacoes = document.getElementById("obsComportamento").value.trim();

            if (!comportamento || !data) return;

            const novoItem = { comportamento, data, observacoes };

            if (editandoIndex !== null) {
                comportamentos[editandoIndex] = novoItem;
                editandoIndex = null;
                submitButton.textContent = "Adicionar Registro";
                submitButton.classList.remove('bg-pink-600', 'hover:bg-pink-500');
                submitButton.classList.add('bg-indigo-600', 'hover:bg-indigo-500');
            } else {
                comportamentos.unshift(novoItem);
            }

            localStorage.setItem("comportamentos", JSON.stringify(comportamentos));
            form.reset();
            renderizarLista();
        });

        window.editar = (index) => {
            const item = comportamentos[index];
            document.getElementById("comportamento").value = item.comportamento;
            document.getElementById("data").value = item.data;
            document.getElementById("obsComportamento").value = item.observacoes;
            editandoIndex = index;
            submitButton.textContent = "Salvar Alterações";
            submitButton.classList.remove('bg-indigo-600', 'hover:bg-indigo-500');
            submitButton.classList.add('bg-pink-600', 'hover:bg-pink-500');
            document.getElementById("comportamento").focus();
        }

        window.abrirModalExclusao = (index) => {
            indexParaExcluir = index;
            deleteModal.classList.remove('hidden');
            deleteModal.classList.add('flex');
        }

        const fecharModalExclusao = () => {
            deleteModal.classList.add('hidden');
            deleteModal.classList.remove('flex');
            indexParaExcluir = null;
        }

        cancelDeleteBtn.addEventListener('click', fecharModalExclusao);
        confirmDeleteBtn.addEventListener('click', () => {
             if (indexParaExcluir !== null) {
                comportamentos.splice(indexParaExcluir, 1);
                localStorage.setItem("comportamentos", JSON.stringify(comportamentos));
                renderizarLista();
            }
            fecharModalExclusao();
        });

        const formatarData = (dataISO) => {
            if(!dataISO) return '';
            const [ano, mes, dia] = dataISO.split("-");
            return `${dia}/${mes}/${ano}`;
        }

        renderizarLista();