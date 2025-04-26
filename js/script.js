import { db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function getInputs() {
  return {
    nome: document.getElementById("nome"),
    idade: document.getElementById("idade"),
    cargo: document.getElementById("cargo"),
  };
}
function getValues({ nome, idade, cargo }) {
  return {
    nome: nome.value.trim(),
    idade: parseInt(idade.value.trim()),
    cargo: cargo.value.trim(),
  };
}
function limpar({ nome, idade, cargo }) {
  nome.value = "";
  idade.value = "";
  cargo.value = "";
}

document.getElementById("botao").addEventListener("click", async function () {
  const inputs = getInputs();
  const dados = getValues(inputs);
  console.log("Inputs: ", inputs);
  console.log("Dados: ", dados);

  if (!(dados.idade || dados.nome || dados.cargo)) {
    alert("Preencha todos os campos");
    return;
  }

  try {
    const ref = await addDoc(collection(db, "funcionarios"), dados);
    console.log("ID do documento", ref.id);
    limpar(inputs);
    alert("Funcionário cadastrado com sucesso", ref.id);
  } catch (e) {
    console.log("Erro: ", e);
  }
});

async function buscarFuncionario() {
  const dadosBanco = await getDocs(collection(db, "funcionarios"));
  const funcionarios = [];
  for (let funcionario of dadosBanco.docs) {
    funcionarios.push({ id: funcionario.id, ...funcionario.data() });
  }
  console.log(funcionarios);
  return funcionarios;
}
document.getElementById("botao").addEventListener("click", carregarLista);
const listarFuncionariosDiv = document.getElementById("listar-funcionarios");

async function carregarLista() {
  listarFuncionariosDiv.innerHTML =
    "<p>Carregando lista de funcionarios...</p>";

  try {
    let funcionario = await buscarFuncionario();
    console.log(funcionario);
    renderizacaoFuncionarios(funcionario);
  } catch (error) {
    console.log("Erro ao carregar a lista de funcionarios", error);
    listarFuncionariosDiv.innerHTML =
      "<p>Erro ao carregar a lista de funcionarios...</p>";
  }
}

function renderizacaoFuncionarios(funcionarios) {
  listarFuncionariosDiv.innerHTML = "";
  if (funcionarios.length === 0) {
    listarFuncionariosDiv.innerHTML =
      "<p>Nenhum funcionario cadastrado ainda<p>";
    return;
  }
  for (let funcionario of funcionarios) {
    const funcionarioDiv = document.createElement("div");
    funcionarioDiv.innerHTML = `<strong>Nome:</strong>${funcionario.nome}<br>
   <strong>Idade:</strong>${funcionario.idade}<br>
  <strong>Cargo:</strong>${funcionario.cargo}<br>
  <button class="btn-excluir" data-id=${funcionario.id}>Excluir</button>
  <button class="btn-editar" data-id=${funcionario.id}>Editar</button>
  <hr>
  `;

    listarFuncionariosDiv.appendChild(funcionarioDiv);
  }
}

document.addEventListener("DOMContentLoaded", carregarLista);

async function excluirFuncionario(idFuncionario) {
  try {
    const documentoDeletar = doc(db, "funcionarios", idFuncionario);
    await deleteDoc(documentoDeletar);
    console.log("Funcionario com ID" + idFuncionario + "foi excluido");
    return true;
  } catch (erro) {
    console.log("Erro ao excluir o funcionarios", erro);
    alert("Ocorreu um erro ao excluir funcionario, tente novamente");
    return false;
  }
}

async function lidarClique(eventoDeClique) {
  const btnExcluir = eventoDeClique.target.closest(".btn-excluir");

  if (btnExcluir) {
    const confirmar = confirm("Quer demiti-lo?");
    if (confirmar) {
      const idFuncionario = btnExcluir.dataset.id;
      const exclusaoBemSucedida = await excluirFuncionario(idFuncionario);

      if (exclusaoBemSucedida) {
        carregarLista();
        alert("Funcionario exluído com sucesso!!!");
      }
    } else {
      alert("Então não");
    }
  }

  const btnEditar = eventoDeClique.target.closest(".btn-editar");

  if (btnEditar) {
    const idFuncionario = btnEditar.dataset.id;
    const funcionario = await buscarFuncionario(idFuncionario);
    const edicao = getValoresEditar();

    if (!funcionario) {
      alert("Funcionario não encontrado.");
      return;
    }

    edicao.editarNome.value = funcionario.nome;
    edicao.editarIdade.value = funcionario.idade;
    edicao.editarCargo.value = funcionario.cargo;
    edicao.editarId.value = funcionario.id;

    edicao.formularioEdicao.style.display = "block";
  }
}

function getValoresEditar() {
  return {
    editarNome: document.getElementById("editar-nome"),
    editarIdade: document.getElementById("editar-idade"),
    editarCargo: document.getElementById("editar-cargo"),
    editarId: document.getElementById("editar-id"),
    formularioEdicao: document.getElementById("formulario-edicao"),
  };
}

let listarFuncionarioDiv;

document.addEventListener("DOMContentLoaded", function () {
  listarFuncionarioDiv = document.getElementById("listar-funcionarios");
  listarFuncionarioDiv = document.addEventListener("click", lidarClique);
  carregarLista();
});

async function buscarFuncionarios(id) {
  try {
    const funcionarioDoc = doc(db, "funcionario", id);
    const dadosBanco = await getDoc(funcionarioDoc);
    if (dadosBanco.exists()) {
      return { idFuncionario: dadosBanco.id, ...dadosBanco.data() };
    } else {
      console.log("Funcionário não encontrado com ID: " + id);
    }
  } catch (erro) {
    console.log("Erro ao buscar funcionario ID: ", erro);
    alert("Erro ao buscar o funcionario para edição!");
    return null;
  }
}

document
  .getElementById("btn-salvar-edicao")
  .addEventListener("click", async function () {
    const edicao = getValoresEditar();

    const id = edicao.editarId.value;
    const novosDados = {
      nome: edicao.editarNome.value.trim(),
      idade: parseInt(edicao.editarIdade.value),
      cargo: edicao.editarCargo.value.trim(),
    };

    try {
      const ref = doc(db, "funcionario", id);
      await setDoc(ref, novosDados);
      alert("Funcionarios atualizado com sucesso");
      edicao.formularioEdicao.style.display = "none";
    } catch (erro) {
      console.log("Erro ao salvar edição: ", erro);
      alert("Erro ao atualizar funcionario");
    }
  });

document
  .getElementById("btn-cancelar-edicao")
  .addEventListener("click", function () {
    document.getElementById("formulario-edicao").style.display = "none";
  });

function adicionarListeners() {
  listarFuncionariosDiv.addEventListener("click", lidarClique);
}

document.addEventListener("DOMContentLoaded", carregarLista);
