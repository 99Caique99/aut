const form = document.getElementById("formCadastro");
const infoSalva = document.getElementById("infoSalva");

function mostrarInfo() {
  const dados = JSON.parse(localStorage.getItem("dadosCrianca"));
  if (dados) {
    infoSalva.innerHTML = `
      <p><strong>Nome:</strong> ${dados.nome}</p>
      <p><strong>Idade:</strong> ${dados.idade}</p>
      <p><strong>Diagnóstico:</strong> ${dados.diagnostico}</p>
      <p><strong>Observações:</strong> ${dados.observacoes}</p>
      <button onclick="editar()">Editar</button>
      <button onclick="excluir()">Excluir</button>
    `;
  } else {
    infoSalva.innerHTML = "<p>Nenhuma informação salva.</p>";
  }
}

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

function editar() {
  const dados = JSON.parse(localStorage.getItem("dadosCrianca"));
  document.getElementById("nome").value = dados.nome;
  document.getElementById("idade").value = dados.idade;
  document.getElementById("diagnostico").value = dados.diagnostico;
  document.getElementById("observacoes").value = dados.observacoes;
}

function excluir() {
  localStorage.removeItem("dadosCrianca");
  mostrarInfo();
}

mostrarInfo();
