const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Usuário';
const generoUsuario = localStorage.getItem('generoUsuario') || '';

const saudacao = document.createElement('h2');
saudacao.textContent = `Bem-vindo, ${generoUsuario} ${nomeUsuario}!`;
saudacao.style.textAlign = 'center';
saudacao.style.marginBottom = '20px';
saudacao.style.color = '#009688';
saudacao.style.fontSize = '22px';

document.querySelector('.container').prepend(saudacao);
