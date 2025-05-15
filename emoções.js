const mesSelecionado = document.getElementById("mesSelecionado");
const anoSelecionado = document.getElementById("anoSelecionado");
const formEmocao = document.getElementById("formEmocao");
const listaEmocoes = document.getElementById("listaEmocoes");
let emocoes = JSON.parse(localStorage.getItem("emocoes")) || [];
let graficoEmocoes = null;

// Preencher opções de mês e ano
function preencherSeletoresMesAno() {
  // Meses
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];
  mesSelecionado.innerHTML = "";
  meses.forEach((nome, i) => {
    const opt = document.createElement("option");
    opt.value = String(i + 1).padStart(2, '0');
    opt.textContent = nome;
    mesSelecionado.appendChild(opt);
  });

  // Anos (de 3 anos atrás até o atual)
  const anoAtual = new Date().getFullYear();
  anoSelecionado.innerHTML = "";
  for (let a = anoAtual; a >= anoAtual - 3; a--) {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    anoSelecionado.appendChild(opt);
  }

  // Seleciona mês/ano atual
  mesSelecionado.value = String(new Date().getMonth() + 1).padStart(2, '0');
  anoSelecionado.value = anoAtual;
}
preencherSeletoresMesAno();

// Formata data para dd/mm/aaaa
function formatarData(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Renderiza lista de emoções
function renderizarEmocoes() {
  listaEmocoes.innerHTML = "";
  emocoes.forEach((item, index) => {
    const emoji = {
      Feliz: "😊",
      Triste: "😢",
      Raiva: "😠",
      Ansioso: "😰",
      Calmo: "😌"
    }[item.emocao] || "";
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${emoji} <strong>${item.emocao}</strong> (${formatarData(item.data)})</span>
      <button class="excluir-btn" onclick="excluirEmocao(${index})">Excluir</button>
    `;
    listaEmocoes.appendChild(li);
  });
  atualizarGraficoEmocoes();
}

// Adiciona emoção
formEmocao.addEventListener("submit", (e) => {
  e.preventDefault();
  const emocao = document.getElementById("emocao").value;
  const data = document.getElementById("dataEmocao").value;
  if (!emocao || !data) return;
  emocoes.push({ emocao, data });
  localStorage.setItem("emocoes", JSON.stringify(emocoes));
  formEmocao.reset();
  renderizarEmocoes();
});

// Exclui emoção
window.excluirEmocao = function(index) {
  emocoes.splice(index, 1);
  localStorage.setItem("emocoes", JSON.stringify(emocoes));
  renderizarEmocoes();
};

// Atualiza gráfico conforme mês/ano selecionado
function atualizarGraficoEmocoes() {
  const mes = mesSelecionado.value;
  const ano = anoSelecionado.value;
  const contagem = { Feliz: 0, Triste: 0, Raiva: 0, Ansioso: 0, Calmo: 0 };
  emocoes.forEach(e => {
    const [y, m] = e.data.split("-");
    if (y === ano && m === mes) {
      contagem[e.emocao] = (contagem[e.emocao] || 0) + 1;
    }
  });

  const ctx = document.getElementById('graficoEmocoes').getContext('2d');
  if (graficoEmocoes) graficoEmocoes.destroy();
  graficoEmocoes = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Feliz', 'Triste', 'Raiva', 'Ansioso', 'Calmo'],
      datasets: [{
        label: 'Quantidade',
        data: [
          contagem.Feliz,
          contagem.Triste,
          contagem.Raiva,
          contagem.Ansioso,
          contagem.Calmo
        ],
        backgroundColor: [
          '#5de0f7', '#ffb6b6', '#ff9100', '#ffd600', '#00c853'
        ],
        borderColor: '#fff',
        borderWidth: 4,
        hoverOffset: 16
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: { size: 16 },
            color: '#333',
            padding: 18,
            usePointStyle: true,
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value}`;
            }
          }
        }
      },
      cutout: '65%',
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });
}

// Atualiza gráfico ao trocar mês/ano
mesSelecionado.addEventListener("change", atualizarGraficoEmocoes);
anoSelecionado.addEventListener("change", atualizarGraficoEmocoes);

// Inicializa
renderizarEmocoes();