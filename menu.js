// Carregar nome e gênero do usuário e atualizar a saudação
const nome = localStorage.getItem('nomeUsuario') || '';
const genero = localStorage.getItem('generoUsuario') || '';
document.getElementById('saudacao').textContent = `Bem-vindo, ${genero} ${nome}!`;

// Função para pegar os compromissos armazenados no localStorage
function getAppointments() {
  return JSON.parse(localStorage.getItem('appointments')) || [];
}

// Função para exibir apenas o próximo compromisso
function displayNextAppointment() {
  const appointments = getAppointments();

  if (appointments.length === 0) {
    document.getElementById('appointments-list').innerHTML = '<li>Nenhum compromisso agendado.</li>';
    return;
  }

  // Data e hora atuais
  const now = new Date();

  // Convertendo data e hora para comparação exata
  const futureAppointments = appointments
    .map(app => {
      const dateTimeStr = `${app.date} ${app.time || '00:00'}`;
      return {
        ...app,
        fullDate: new Date(dateTimeStr)
      };
    })
    .filter(app => app.fullDate >= now) // Filtra compromissos futuros
    .sort((a, b) => a.fullDate - b.fullDate); // Ordena por data

  // Se houver compromissos, pega apenas o primeiro
  const nextAppointment = futureAppointments[0];

  if (!nextAppointment) {
    document.getElementById('appointments-list').innerHTML = '<li>Nenhum compromisso futuro encontrado.</li>';
    return;
  }

  const listElement = document.getElementById('appointments-list');
  listElement.innerHTML = '';

  const li = document.createElement('li');
  li.classList.add(nextAppointment.category ? nextAppointment.category.toLowerCase() : '');

  li.innerHTML = `
    <strong>${nextAppointment.title}</strong>
    <p><b>Data:</b> ${nextAppointment.fullDate.toLocaleDateString()}</p>
    <p><b>Hora:</b> ${nextAppointment.time || 'Não especificada'}</p>
    <p><b>Local:</b> ${nextAppointment.location || 'Não informado'}</p>
    <p><b>Categoria:</b> ${nextAppointment.category || 'Não especificada'}</p>
  `;
  listElement.appendChild(li);
}

// Chama a função para exibir o próximo compromisso ao carregar a página
document.addEventListener('DOMContentLoaded', displayNextAppointment);
// Adiciona um evento de clique ao botão "Ver todos os compromissos" 
document.getElementById('view-all-appointments').addEventListener('click', function() {
  const appointments = getAppointments();
  const listElement = document.getElementById('appointments-list');
  listElement.innerHTML = '';

  if (appointments.length === 0) {
    listElement.innerHTML = '<li>Nenhum compromisso agendado.</li>';
    return;
  }

  appointments.forEach(app => {
    const li = document.createElement('li');
    li.classList.add(app.category ? app.category.toLowerCase() : '');

    li.innerHTML = `
      <strong>${app.title}</strong>
      <p><b>Data:</b> ${app.date}</p>
      <p><b>Hora:</b> ${app.time || 'Não especificada'}</p>
      <p><b>Local:</b> ${app.location || 'Não informado'}</p>
      <p><b>Categoria:</b> ${app.category || 'Não especificada'}</p>
    `;
    listElement.appendChild(li);
  });
});
// Adiciona um evento de clique ao botão "Adicionar Compromisso"      