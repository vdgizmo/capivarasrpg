const viewport = document.getElementById("viewport");
const imagem = document.getElementById("imagem");

const zoomMais = document.getElementById("zoomMais");
const zoomMenos = document.getElementById("zoomMenos");
const zoomReset = document.getElementById("zoomReset");


// =========================================================
// CONFIGURAÇÕES
// =========================================================

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 8;
const FATOR_ZOOM = 1.25;


// =========================================================
// ESTADO DO VISUALIZADOR
// =========================================================

let escala = 1;

let posX = 0;
let posY = 0;


// =========================================================
// ESTADO DO ARRASTE
// =========================================================

let arrastando = false;

let inicioX = 0;
let inicioY = 0;

let posicaoInicialX = 0;
let posicaoInicialY = 0;


// =========================================================
// CONTROLE DOS PONTEIROS
// =========================================================

const ponteiros = new Map();


// =========================================================
// CONTROLE DA PINÇA
// =========================================================

let distanciaInicial = null;
let escalaInicial = 1;


// =========================================================
// ATUALIZA A IMAGEM
// =========================================================

function atualizarImagem() {

    imagem.style.transform =
        `translate(${posX}px, ${posY}px) scale(${escala})`;
}


// =========================================================
// LIMITA A POSIÇÃO DA IMAGEM
// =========================================================

function limitarPosicao() {

    const largura =
        imagem.naturalWidth * escala;

    const altura =
        imagem.naturalHeight * escala;

    const larguraViewport =
        viewport.clientWidth;

    const alturaViewport =
        viewport.clientHeight;


    // -----------------------------------------
    // Eixo X
    // -----------------------------------------

    if (largura <= larguraViewport) {

        // Centraliza a imagem
        posX =
            (larguraViewport - largura) / 2;

    } else {

        /*
         * Mantém pelo menos uma pequena parte
         * da imagem dentro da área visível.
         */

        const margem = 40;

        const limiteEsquerdo =
            larguraViewport - largura - margem;

        const limiteDireito =
            margem;

        posX =
            Math.max(
                limiteEsquerdo,
                Math.min(limiteDireito, posX)
            );
    }


    // -----------------------------------------
    // Eixo Y
    // -----------------------------------------

    if (altura <= alturaViewport) {

        // Centraliza a imagem
        posY =
            (alturaViewport - altura) / 2;

    } else {

        const margem = 40;

        const limiteSuperior =
            alturaViewport - altura - margem;

        const limiteInferior =
            margem;

        posY =
            Math.max(
                limiteSuperior,
                Math.min(limiteInferior, posY)
            );
    }
}


// =========================================================
// RESTAURAR TAMANHO ORIGINAL
// =========================================================

function restaurar() {

    escala = 1;

    const largura =
        imagem.naturalWidth;

    const altura =
        imagem.naturalHeight;


    /*
     * Centraliza a imagem na tela.
     */
    posX =
        (viewport.clientWidth - largura) / 2;

    posY =
        (viewport.clientHeight - altura) / 2;


    atualizarImagem();
}


// =========================================================
// ALTERAR ZOOM
// =========================================================

function alterarZoom(novaEscala) {

    /*
     * Centro da tela.
     */
    const centroX =
        viewport.clientWidth / 2;

    const centroY =
        viewport.clientHeight / 2;


    /*
     * Descobre qual ponto da imagem está
     * atualmente sob o centro da tela.
     */
    const imagemX =
        (centroX - posX) / escala;

    const imagemY =
        (centroY - posY) / escala;


    /*
     * Aplica os limites do zoom.
     */
    escala =
        Math.max(
            ZOOM_MIN,
            Math.min(ZOOM_MAX, novaEscala)
        );


    /*
     * Ajusta a posição para que o ponto
     * central permaneça no mesmo lugar.
     */
    posX =
        centroX - imagemX * escala;

    posY =
        centroY - imagemY * escala;


    limitarPosicao();

    atualizarImagem();
}


// =========================================================
// BOTÃO +
// =========================================================

zoomMais.addEventListener("click", () => {

    alterarZoom(
        escala * FATOR_ZOOM
    );

});


// =========================================================
// BOTÃO -
// =========================================================

zoomMenos.addEventListener("click", () => {

    alterarZoom(
        escala / FATOR_ZOOM
    );

});


// =========================================================
// BOTÃO RESTAURAR
// =========================================================

zoomReset.addEventListener("click", () => {

    restaurar();

});


// =========================================================
// DISTÂNCIA ENTRE DOIS PONTEIROS
// =========================================================

function distanciaEntrePonteiros() {

    const pontos =
        [...ponteiros.values()];


    if (pontos.length < 2) {
        return null;
    }


    const ponto1 = pontos[0];
    const ponto2 = pontos[1];


    const dx =
        ponto1.x - ponto2.x;

    const dy =
        ponto1.y - ponto2.y;


    return Math.sqrt(
        dx * dx + dy * dy
    );
}


// =========================================================
// CENTRO ENTRE DOIS PONTEIROS
// =========================================================

function centroDosPonteiros() {

    const pontos =
        [...ponteiros.values()];


    return {

        x:
            (pontos[0].x + pontos[1].x) / 2,

        y:
            (pontos[0].y + pontos[1].y) / 2
    };
}


// =========================================================
// INÍCIO DO TOQUE / ARRASTE
// =========================================================

viewport.addEventListener(
    "pointerdown",
    (evento) => {

        ponteiros.set(
            evento.pointerId,
            {
                x: evento.clientX,
                y: evento.clientY
            }
        );


        /*
         * Mantém o ponteiro associado ao elemento.
         */
        viewport.setPointerCapture(
            evento.pointerId
        );


        // -----------------------------------------
        // Um dedo / mouse
        // -----------------------------------------

        if (ponteiros.size === 1) {

            arrastando = true;


            inicioX =
                evento.clientX;

            inicioY =
                evento.clientY;


            posicaoInicialX =
                posX;

            posicaoInicialY =
                posY;


            viewport.classList.add(
                "dragging"
            );
        }


        // -----------------------------------------
        // Dois dedos
        // -----------------------------------------

        if (ponteiros.size === 2) {

            arrastando = false;


            distanciaInicial =
                distanciaEntrePonteiros();


            escalaInicial =
                escala;
        }
    }
);


// =========================================================
// MOVIMENTO DO TOQUE / ARRASTE
// =========================================================

viewport.addEventListener(
    "pointermove",
    (evento) => {

        /*
         * Ignora ponteiros que não estão
         * registrados.
         */
        if (!ponteiros.has(evento.pointerId)) {
            return;
        }


        /*
         * Atualiza a posição do ponteiro.
         */
        ponteiros.set(
            evento.pointerId,
            {
                x: evento.clientX,
                y: evento.clientY
            }
        );


        // =================================================
        // PINÇA COM DOIS DEDOS
        // =================================================

        if (ponteiros.size >= 2) {

            const distanciaAtual =
                distanciaEntrePonteiros();


            if (
                distanciaInicial !== null &&
                distanciaAtual !== null
            ) {

                /*
                 * Calcula quanto os dedos
                 * se afastaram ou aproximaram.
                 */
                const fator =
                    distanciaAtual /
                    distanciaInicial;


                const novaEscala =
                    escalaInicial * fator;


                /*
                 * Centro atual da pinça.
                 */
                const centro =
                    centroDosPonteiros();


                /*
                 * Descobre o ponto da imagem que
                 * estava sob o centro da pinça.
                 */
                const imagemX =
                    (centro.x - posX) /
                    escala;

                const imagemY =
                    (centro.y - posY) /
                    escala;


                /*
                 * Aplica o novo zoom.
                 */
                escala =
                    Math.max(
                        ZOOM_MIN,
                        Math.min(
                            ZOOM_MAX,
                            novaEscala
                        )
                    );


                /*
                 * Mantém o centro da pinça
                 * sobre o mesmo ponto da imagem.
                 */
                posX =
                    centro.x -
                    imagemX * escala;

                posY =
                    centro.y -
                    imagemY * escala;


                limitarPosicao();

                atualizarImagem();
            }


            return;
        }


        // =================================================
        // ARRASTE COM UM DEDO / MOUSE
        // =================================================

        if (
            arrastando &&
            ponteiros.size === 1
        ) {

            posX =
                posicaoInicialX +
                (
                    evento.clientX -
                    inicioX
                );


            posY =
                posicaoInicialY +
                (
                    evento.clientY -
                    inicioY
                );


            limitarPosicao();

            atualizarImagem();
        }
    }
);


// =========================================================
// FINAL DO TOQUE / ARRASTE
// =========================================================

function finalizarPonteiro(evento) {

    ponteiros.delete(
        evento.pointerId
    );


    /*
     * Se deixou de haver dois dedos,
     * encerra o modo de pinça.
     */
    if (ponteiros.size < 2) {

        distanciaInicial = null;
    }


    /*
     * Se não há mais ponteiros,
     * encerra o arraste.
     */
    if (ponteiros.size === 0) {

        arrastando = false;

        viewport.classList.remove(
            "dragging"
        );
    }
}


// =========================================================
// EVENTOS DE FINALIZAÇÃO
// =========================================================

viewport.addEventListener(
    "pointerup",
    finalizarPonteiro
);

viewport.addEventListener(
    "pointercancel",
    finalizarPonteiro
);


// =========================================================
// REDIMENSIONAMENTO DA JANELA
// =========================================================

window.addEventListener(
    "resize",
    () => {

        limitarPosicao();

        atualizarImagem();
    }
);


// =========================================================
// QUANDO A IMAGEM TERMINAR DE CARREGAR
// =========================================================

imagem.addEventListener(
    "load",
    () => {

        restaurar();
    }
);


// =========================================================
// CASO A IMAGEM JÁ ESTEJA NO CACHE
// =========================================================

if (imagem.complete) {

    restaurar();
}