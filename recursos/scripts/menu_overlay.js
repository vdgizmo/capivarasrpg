function abreJogador() {
  document.getElementById("navJogador").style.height = "100%";
}

function fechaJogador() {
  document.getElementById("navJogador").style.height = "0%";
}

function abreMestre() {
  document.getElementById("navMestre").style.height = "100%";
}

function fechaMestre() {
  document.getElementById("navMestre").style.height = "0%";
}

function abreCenario() {
  document.getElementById("navCenario").style.height = "100%";
}

function fechaCenario() {
  document.getElementById("navCenario").style.height = "0%";
}

function abreRegras() {
  document.getElementById("navRegras").style.height = "100%";
}

function fechaRegras() {
  document.getElementById("navRegras").style.height = "0%";
}

function abreInterpretando() {
  document.getElementById("navInterpretando").style.height = "100%";
}

function fechaInterpretando() {
  document.getElementById("navInterpretando").style.height = "0%";
}

// FECHAR TÓPICOS NOS MENUS INTERNOS

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.fechar-topico').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const details = this.closest('.topico');
            if (details) {
                details.removeAttribute('open');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.fechar-topico').forEach(function (botao) {
        botao.addEventListener('click', function () {
            const details = this.closest('.topico-personagem');
            if (details) {
                details.removeAttribute('open');
            }
        });
    });
});