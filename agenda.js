document.addEventListener('DOMContentLoaded', function() {
    const calendario = document.getElementById('calendario');
    const mesAno = document.getElementById('mesAno');
    const formEvento = document.getElementById('formEvento');
    const inputTitulo = document.getElementById('titulo');
    const inputDescricao = document.getElementById('descricao');
    const infoEvento = document.getElementById('infoEvento');
    const btnCancelar = document.getElementById('cancelar');
    const dataEvento = document.getElementById('dataEvento');

    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    let dataSelecionada = null;
    let eventoExistente = null;

    // Função para exibir o calendário
    function renderizarCalendario(mes, ano) {
        mesAno.textContent = `${getMesNome(mes)} ${ano}`;
        calendario.innerHTML = '';

        const primeiroDia = new Date(ano, mes, 1);
        const ultimoDia = new Date(ano, mes + 1, 0);
        const diasNoMes = ultimoDia.getDate();
        const diaDaSemanaInicio = primeiroDia.getDay();

        // Preenche os dias vazios do começo
        for (let i = 0; i < diaDaSemanaInicio; i++) {
            const diaVazio = document.createElement('div');
            calendario.appendChild(diaVazio);
        }

        // Preenche os dias do mês
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const diaElemento = document.createElement('div');
            diaElemento.classList.add('dia');
            diaElemento.textContent = dia;
            diaElemento.dataset.dia = dia;

            // Verifica se há evento para o dia
            if (eventos.some(evento => evento.data === `${ano}-${mes + 1}-${dia}`)) {
                diaElemento.classList.add('evento');
            }

            diaElemento.addEventListener('click', function() {
                dataSelecionada = new Date(ano, mes, dia);
                eventoExistente = eventos.find(evento => evento.data === `${ano}-${mes + 1}-${dia}`);
                mostrarFormulario(dataSelecionada);
            });

            calendario.appendChild(diaElemento);
        }
    }

    // Função para mostrar o formulário de adicionar/editar evento
    function mostrarFormulario(data) {
        inputTitulo.value = eventoExistente ? eventoExistente.titulo : '';
        inputDescricao.value = eventoExistente ? eventoExistente.descricao : '';

        // Exibe a data selecionada
        dataEvento.textContent = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;

        // Exibe o formulário de evento acima do calendário
        infoEvento.style.display = 'block';
        
        // Ao submeter, salvar ou atualizar o evento
        formEvento.onsubmit = function(e) {
            e.preventDefault();

            const titulo = inputTitulo.value;
            const descricao = inputDescricao.value;

            const evento = {
                titulo,
                descricao,
                data: formatarData(data)
            };

            // Verifica se já existe evento para a data
            if (eventoExistente) {
                // Atualiza o evento existente
                const index = eventos.findIndex(evento => evento.data === eventoExistente.data);
                eventos[index] = evento;
            } else {
                // Adiciona um novo evento
                eventos.push(evento);
            }

            // Salva no localStorage
            localStorage.setItem('eventos', JSON.stringify(eventos));

            // Atualiza o calendário
            renderizarCalendario(data.getMonth(), data.getFullYear());
            eventoExistente = null;  // Limpa a variável de evento existente após salvar
            infoEvento.style.display = 'none';  // Esconde o formulário de evento
        };
    }

    // Função para formatar a data
    function formatarData(data) {
        return `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
    }

    // Função para obter o nome do mês
    function getMesNome(mes) {
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return meses[mes];
    }

    // Inicializa o calendário
    const dataAtual = new Date();
    renderizarCalendario(dataAtual.getMonth(), dataAtual.getFullYear());

    // Navegação entre os meses
    document.getElementById('mesAnterior').addEventListener('click', function() {
        const mes = dataAtual.getMonth() - 1;
        renderizarCalendario(mes, dataAtual.getFullYear());
    });

    document.getElementById('mesProximo').addEventListener('click', function() {
        const mes = dataAtual.getMonth() + 1;
        renderizarCalendario(mes, dataAtual.getFullYear());
    });

    // Botão cancelar
    btnCancelar.addEventListener('click', function() {
        // Limpa os campos de título e descrição
        inputTitulo.value = '';
        inputDescricao.value = '';

        // Fecha o formulário de evento
        infoEvento.style.display = 'none';
        eventoExistente = null;  // Reseta o evento existente
    });
});
