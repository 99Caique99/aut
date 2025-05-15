const form = document.getElementById("formComportamento");
const lista = document.getElementById("listaComportamentos");

let comportamentos = JSON.parse(localStorage.getItem("comportamentos")) || [];
let editandoIndex = null;

function renderizarLista() {
  lista.innerHTML = "";
  comportamentos.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.comportamento}</strong> (${formatarData(item.data)})<br>
      <em>${item.observacoes}</em><br>
      <button onclick="editar(${index})">Editar</button>
      <button onclick="excluir(${index})">Excluir</button>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const comportamento = document.getElementById("comportamento").value;
  const data = document.getElementById("data").value;
  const observacoes = document.getElementById("obsComportamento").value;

  const novoItem = { comportamento, data, observacoes };

  if (editandoIndex !== null) {
    comportamentos[editandoIndex] = novoItem;
    editandoIndex = null;
  } else {
    comportamentos.push(novoItem);
  }

  localStorage.setItem("comportamentos", JSON.stringify(comportamentos));
  form.reset();
  renderizarLista();
});

function editar(index) {
  const item = comportamentos[index];
  document.getElementById("comportamento").value = item.comportamento;
  document.getElementById("data").value = item.data;
  document.getElementById("obsComportamento").value = item.observacoes;
  editandoIndex = index;
}

function excluir(index) {
  comportamentos.splice(index, 1);
  localStorage.setItem("comportamentos", JSON.stringify(comportamentos));
  renderizarLista();
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

renderizarLista();

