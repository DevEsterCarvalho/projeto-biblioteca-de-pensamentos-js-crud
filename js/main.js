import ui from "./ui.js"
import api from "./api.js"

function removerEspacos(string) {
    return string.replaceAll(/\s+/g, '')
}

const validacaoConteudoRegex = /^[A-Za-z\s]{10,}$/
function validarConteudo(conteudo){
    return validacaoConteudoRegex.test(conteudo)
}

const validacaoAutoriaRegex = /^[A-Za-z]{3,15}$/
function validarAutoria(autoria) {
    return validacaoAutoriaRegex.test(autoria)
}

document.addEventListener("DOMContentLoaded", () => {
    ui.renderizarPensamentos()

    const formPensamento = document.getElementById('pensamento-form')
    const botaoCancelar = document.getElementById("botao-cancelar")
    const inputBusca = document.getElementById("campo-busca")

    formPensamento.addEventListener("submit", manipularSubmissaoFormulario)
    botaoCancelar.addEventListener("click", manipularCancelamento)
    inputBusca.addEventListener("input", manipularBusca)

})

async function manipularSubmissaoFormulario(event) {
    event.preventDefault()
    const id = document.getElementById('pensamento-id').value
    const conteudo = document.getElementById('pensamento-conteudo').value
    const autoria = document.getElementById('pensamento-autoria').value
    const data = document.getElementById("pensamento-data").value

    const conteudoSemEspacos = removerEspacos(conteudo)
    const autoriaSemEspacos = removerEspacos(autoria)

    if (!validarConteudo(conteudoSemEspacos)) {
        alert('É permitido apenas a inclusão de letras com no mínimo 10 caracteres e não é permitido a inserção somente de espaços')
        return
    }

    if (!validarAutoria(autoriaSemEspacos)) {
        alert('A autoria deve conter letras, entre 3 e 15 caracteres e não pode conter espaços. Por favor, tente novamente.')
    }

    if (!validarData(data)) {
        alert("Não é permitido o cadastro de datas futuras, selecione uma data novamente.")
    }

    try {
        if (id) {
            await api.editarPensamento({ id, conteudo, autoria, data })
        } else {
            await api.salvarPensamento({conteudo, autoria, data})
        }
        ui.renderizarPensamentos
    } catch {
        alert('Erro ao salvar pensamento')
    }
} 


function manipularCancelamento() {
    ui.limparFormulario();
}

async function manipularBusca() {
    const termoBusca = document.getElementById("campo-busca").value
    try {
        const pensamentosFiltrados = await api.buscarPensamentosPorTermo(termoBusca)
        ui.renderizarPensamentos(pensamentosFiltrados)
    } catch (error) {
        alert("Erro ao realizar busca")
    }
}

function validarData(data){
    const dataAtual = new Date()
    const dataInserida = new Date(data)
    return dataInserida <= dataAtual
}