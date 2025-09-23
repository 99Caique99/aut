 document.addEventListener('DOMContentLoaded', () => {
            // --- VARIÁVEIS E CONSTANTES ---
            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            let currentDate = new Date();
            let selectedDate = null;
            let events = JSON.parse(localStorage.getItem("agendaEventos")) || [];

            // --- ELEMENTOS DO DOM ---
            const calendarEl = document.getElementById("calendar");
            const monthLabel = document.getElementById("monthLabel");
            const eventListEl = document.getElementById("eventList");
            const prevMonthBtn = document.getElementById("prevMonth");
            const nextMonthBtn = document.getElementById("nextMonth");
            
            // Modal de Evento
            const modalOverlay = document.getElementById("modalOverlay");
            const eventModal = document.getElementById("eventModal");
            const modalTitle = document.getElementById("modalTitle");
            const closeModalBtn = document.getElementById("closeModal");
            const addEventFab = document.getElementById('addEventFab');
            const eventForm = document.getElementById('eventForm');
            const deleteEventBtn = document.getElementById('deleteEvent');
            const cancelEventBtn = document.getElementById('cancelEvent');
            
            // Modal de Confirmação
            const confirmOverlay = document.getElementById('confirmOverlay');
            const confirmModal = document.getElementById('confirmModal');
            const confirmOkBtn = document.getElementById('confirmOk');
            const confirmCancelBtn = document.getElementById('confirmCancel');
            const confirmTitle = document.getElementById('confirmTitle');
            const confirmMessage = document.getElementById('confirmMessage');
            let resolveConfirm;


            // --- FUNÇÕES PRINCIPAIS ---

            /**
             * Renderiza o calendário para o mês e ano atuais.
             */
            function renderCalendar() {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();

                monthLabel.textContent = `${monthNames[month]} ${year}`;
                calendarEl.innerHTML = '';

                // Cabeçalho dos dias da semana
                const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
                weekdays.forEach(day => {
                    const dayHeader = document.createElement("div");
                    dayHeader.textContent = day;
                    dayHeader.className = "font-semibold text-xs text-gray-500 py-2";
                    calendarEl.appendChild(dayHeader);
                });

                const firstDay = new Date(year, month, 1).getDay();
                const lastDate = new Date(year, month + 1, 0).getDate();
                const today = new Date();

                // Células vazias para o início do mês
                for (let i = 0; i < firstDay; i++) {
                    calendarEl.appendChild(document.createElement("div"));
                }

                // Células dos dias do mês
                for (let i = 1; i <= lastDate; i++) {
                    const dayCell = document.createElement("div");
                    const date = new Date(year, month, i);
                    const dateString = date.toISOString().split('T')[0];
                    
                    dayCell.className = "relative h-12 sm:h-16 flex items-center justify-center cursor-pointer rounded-lg transition-all duration-300 ease-in-out";
                    
                    const dayNumber = document.createElement('span');
                    dayNumber.textContent = i;
                    dayNumber.className = "z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300";
                    dayCell.appendChild(dayNumber);
                    
                    // Marca o dia de hoje
                    if (date.toDateString() === today.toDateString()) {
                        dayNumber.classList.add("bg-blue-500", "text-white", "font-bold");
                        dayNumber.style.animation = 'pulse-glow 2s infinite';
                    } else {
                        dayNumber.style.animation = '';
                    }

                    // Marca o dia selecionado
                    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                        dayNumber.classList.add("bg-blue-200", "text-blue-700", "font-bold");
                        dayCell.classList.add("bg-blue-50");
                    } else {
                        dayCell.classList.add("hover:bg-blue-100");
                    }
                    
                    // Adiciona indicadores de eventos (pontos coloridos)
                    const eventsOnDay = events.filter(e => e.date === dateString);
                    if (eventsOnDay.length > 0) {
                        const dotsContainer = document.createElement('div');
                        dotsContainer.className = 'absolute bottom-1.5 flex justify-center space-x-1';
                        
                        const uniqueEventTypes = [...new Set(eventsOnDay.map(e => e.type))];
                        uniqueEventTypes.slice(0, 3).forEach(type => {
                            const dot = document.createElement('div');
                            dot.className = `w-1.5 h-1.5 rounded-full dot-${type}`;
                            dotsContainer.appendChild(dot);
                        });
                        dayCell.appendChild(dotsContainer);
                    }

                    dayCell.addEventListener("click", () => selectDate(date));
                    calendarEl.appendChild(dayCell);
                }
            }

            /**
             * Seleciona uma data, atualiza a UI e a lista de eventos.
             * @param {Date} date - A data selecionada.
             */
            function selectDate(date) {
                selectedDate = date;
                renderCalendar();
                updateEventList();
            }

            /**
             * Atualiza a lista de eventos para o dia selecionado.
             */
            function updateEventList() {
                eventListEl.innerHTML = '';
                if (!selectedDate) {
                    eventListEl.innerHTML = '<p class="text-gray-500 text-sm">Selecione uma data para ver os eventos.</p>';
                    return;
                }

                const dateString = selectedDate.toISOString().split('T')[0];
                const eventsOnDay = events.filter(e => e.date === dateString);

                if (eventsOnDay.length === 0) {
                    eventListEl.innerHTML = '<p class="text-gray-500 text-sm">Nenhum compromisso para este dia.</p>';
                    return;
                }

                eventsOnDay.forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.className = `p-3 rounded-lg border-l-4 cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-300 bg-white`;
                    eventItem.style.borderLeftColor = getCategoryColor(event.type);
                    eventItem.innerHTML = `
                        <p class="font-semibold text-sm text-gray-800">${event.title}</p>
                        <p class="text-xs text-gray-500 truncate">${event.description || 'Sem descrição'}</p>
                    `;
                    eventItem.addEventListener('click', () => openModal(event));
                    eventListEl.appendChild(eventItem);
                });
            }
            
            function getCategoryColor(type) {
                const colors = {
                    terapia: '#ef4444', escola: '#3b82f6', lazer: '#facc15', outro: '#a855f7'
                };
                return colors[type] || '#6b7280';
            }

            /**
             * Abre o modal para adicionar ou editar um evento.
             * @param {object|null} event - O evento a ser editado, ou null para um novo evento.
             */
            function openModal(event = null) {
                eventForm.reset();
                eventForm.dataset.eventId = '';

                if (event) { // Editando
                    modalTitle.textContent = 'Editar Compromisso';
                    document.getElementById('eventTitle').value = event.title;
                    document.getElementById('eventDescription').value = event.description;
                    document.getElementById('eventType').value = event.type;
                    eventForm.dataset.eventId = event.id;
                    deleteEventBtn.classList.remove('hidden');
                } else { // Adicionando
                    if (!selectedDate) {
                        alert("Por favor, selecione uma data no calendário primeiro.");
                        return;
                    }
                    modalTitle.textContent = 'Adicionar Compromisso';
                    deleteEventBtn.classList.add('hidden');
                }

                modalOverlay.classList.remove('hidden');
                eventModal.classList.remove('modal-leave', 'modal-leave-active');
                eventModal.classList.add('modal-enter-active');
            }

            /**
             * Fecha o modal de evento.
             */
            function closeModal() {
                eventModal.classList.remove('modal-enter-active');
                eventModal.classList.add('modal-leave-active');
                setTimeout(() => modalOverlay.classList.add('hidden'), 300);
            }
            
            /**
             * Mostra o modal de confirmação.
             * @param {string} title - O título do modal.
             * @param {string} message - A mensagem do modal.
             * @returns {Promise<boolean>} - Resolve como true se confirmado, false se cancelado.
             */
            function showConfirmModal(title, message) {
                confirmTitle.textContent = title;
                confirmMessage.textContent = message;

                confirmOverlay.classList.remove('hidden');
                confirmModal.classList.remove('modal-leave', 'modal-leave-active');
                confirmModal.classList.add('modal-enter-active');
                
                return new Promise((resolve) => {
                    resolveConfirm = resolve;
                });
            }
            
            /**
             * Fecha o modal de confirmação.
             * @param {boolean} decision - O resultado da confirmação.
             */
            function hideConfirmModal(decision) {
                confirmModal.classList.remove('modal-enter-active');
                confirmModal.classList.add('modal-leave-active');
                setTimeout(() => {
                    confirmOverlay.classList.add('hidden');
                    if (resolveConfirm) resolveConfirm(decision);
                }, 300);
            }

            /**
             * Salva os eventos no localStorage e re-renderiza a UI.
             */
            function saveAndRender() {
                localStorage.setItem("agendaEventos", JSON.stringify(events));
                renderCalendar();
                updateEventList();
            }

            // --- EVENT LISTENERS ---

            prevMonthBtn.addEventListener("click", () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });

            nextMonthBtn.addEventListener("click", () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });

            addEventFab.addEventListener('click', () => openModal(null));
            closeModalBtn.addEventListener('click', closeModal);
            cancelEventBtn.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) closeModal();
            });
            
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = eventForm.dataset.eventId;
                const newEvent = {
                    id: id || Date.now().toString(),
                    title: document.getElementById('eventTitle').value,
                    description: document.getElementById('eventDescription').value,
                    type: document.getElementById('eventType').value,
                    date: selectedDate.toISOString().split('T')[0]
                };

                if (id) {
                    events = events.map(ev => ev.id === id ? newEvent : ev);
                } else {
                    events.push(newEvent);
                }
                
                saveAndRender();
                closeModal();
            });

            deleteEventBtn.addEventListener('click', async () => {
                const id = eventForm.dataset.eventId;
                const confirmed = await showConfirmModal('Excluir Compromisso', 'Tem certeza que deseja excluir este compromisso? Esta ação não pode ser desfeita.');

                if (confirmed) {
                    events = events.filter(ev => ev.id !== id);
                    saveAndRender();
                    closeModal();
                }
            });
            
            confirmOkBtn.addEventListener('click', () => hideConfirmModal(true));
            confirmCancelBtn.addEventListener('click', () => hideConfirmModal(false));
            confirmOverlay.addEventListener('click', (e) => {
                if (e.target === confirmOverlay) hideConfirmModal(false);
            });

            // --- INICIALIZAÇÃO ---
            selectDate(new Date()); // Seleciona o dia de hoje ao carregar
        });