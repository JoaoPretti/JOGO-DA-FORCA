
var objFacil = ["caneta", "camisa", "copo", "mesa", "caixa"],
    objNormal = ["mochila", "computador", "lapiseira", "teclado", "mouse"],
    objDificil = ["microondas", "lustre", "candelabro", "tomada", "cadeira"];

var aniFacil = ["gato", "rato", "tigre", "urso", "pomba"],
    aniNormal = ["zebra", "minhoca", "besouro", "toupeira", "elefante"],
    aniDificil = ["rinoceronte", "tamandua", "guepardo", "alpaca", "lhama"];

var corFacil = ["azul", "verde", "branco", "preto", "prata"],
    corNormal = ["violeta", "cinza", "rosa", "dourado", "prateado"],
    corDificil = ["marrom", "turquesa", "magenta", "esmeralda", "salmao"];

var i = 0,
    l = 0,
    k = 0;

var usadas = '';
var tentativas = 6; // vai subtraindo quando erra
var pontuacao = 0; // vai aumentando ou diminuindo
var contadorTempo = 0;


//FUNÇÃO - recebe a letra
function recebeLetra() {
    "use strict";

    return document.forms.resposta.elements.letra.value;
}

function letraRandom() {
    "use strict";

    var letrasPossiveis = "abcdefghijklmnopqrstuvwxyz",
        x = Math.floor(Math.random() * letrasPossiveis.length),
        a,
        random = letrasPossiveis.charAt(x); // escolhe a letra mediante o numero aleatorio

    if (usadas !== null) {
        for (a = 0; a < usadas.length; a += 1) {
            if (random === usadas.charAt(a)) {
                x = Math.floor(Math.random() * letrasPossiveis.length);
                random = letrasPossiveis.charAt(x);
                a = 0;
            }
        }
    }
    return random;
}

//FUNÇÃO - junta as preferências do jogador ao seu vetor
function addInfo(modo, dificuldade) {
    "use strict";

    var copiaArray = [],
        arrayTemp = [];

    if (sessionStorage.getItem("jogadorActual")) {
        copiaArray[0] = sessionStorage.getItem("jogadorActual"); //username
        copiaArray[1] = modo;
        copiaArray[2] = dificuldade;
        sessionStorage.clear();
        sessionStorage.setItem("jogadorActual", copiaArray);
    }
}

//FUNCAO - junta o tempo ao vetor do jogador
function addTempo() {
    "use strict";

    var copiaArray = [],
        arrayTemp = [];

    if (sessionStorage.getItem("jogadorActual")) {
        copiaArray = sessionStorage.getItem("jogadorActual").split(',');
        copiaArray[4] = contadorTempo;
        sessionStorage.clear();
        sessionStorage.setItem("jogadorActual", copiaArray);
    }
}


//FUNÇÃO - escolhe a palavra mediante as definições
function getPalavra(tema, dificuldade) {
    "use strict";

    var x = Math.floor(Math.random() * 4), // devolve um numero inteiro entre 0 e 5 (tamanho do vetor)
        palavra = '';

    switch (tema) {
    case 'objetos':
        if (dificuldade === 'facil') {
            palavra = objFacil[x];
        } else if (dificuldade === 'normal') {
            palavra = objNormal[x];
        } else if (dificuldade === 'dificil') {
            palavra = objDificil[x];
        }
        break;

    case 'animais':
        if (dificuldade === 'facil') {
            palavra = aniFacil[x];
        } else if (dificuldade === 'normal') {
            palavra = aniNormal[x];
        } else if (dificuldade === 'dificil') {
            palavra = aniDificil[x];
        }
        break;

    case 'cores':
        if (dificuldade === 'facil') {
            palavra = corFacil[x];
        } else if (dificuldade === 'normal') {
            palavra = corNormal[x];
        } else if (dificuldade === 'dificil') {
            palavra = corDificil[x];
        }
        break;
    }
    return palavra;
}


//FUNÇÃO - relogio do jogo
function tempoJogo() {
    "use strict";

    var minutos,
        segundos;

    setTimeout(tempoJogo, 1000);
    contadorTempo += 1;

    if (contadorTempo < 60) {
        document.getElementById('relogio').innerHTML = contadorTempo + 's';
    } else {
        minutos = Math.floor(contadorTempo / 60);
        segundos = contadorTempo - minutos * 60;
        document.getElementById('relogio').innerHTML = minutos + 'm ' + segundos + 's';
    }
}

//FUNÇÃO - Finalizar a jogada
function tempoScore() {
    "use strict";

    if (contadorTempo < 15) {
        pontuacao += 10;
    } else if (contadorTempo < 30) {
        pontuacao += 6;
    } else if (contadorTempo < 45) {
        pontuacao += 3;
    }

}

//FUNÇÃO - reiniciar
function clearForm() {
    "use strict";
    document.forms.resposta.reset();
}

//FUNÇÕES - função principal que corre o jogo
function jogoForca(modo, dificuldade, tema) {
    "use strict";

    tempoJogo(); // inicia o relogio

    var respostaJogador = '',
        respostaCopia = '',
        letra = '',
        palavra = getPalavra(tema, dificuldade);

    while (i < palavra.length) {
        respostaJogador += "-";
        respostaCopia += "-";
        i += 1;
    }

    $('#temaPalavra').append('O tema da palavra é "<strong>' + tema + '</strong>".');
    $('#mensagem').append("<p>A palavra tem  " + palavra.length.toString() + " letras.</p>");
    $('#tracinhos').append("<p>" + respostaJogador + "</p>"); // apresenta os tracinhos correspondentes a cada letra na página

    /*                      MODO RANDOM                     */
    /*                      MODO RANDOM                     */
    /*                      MODO RANDOM                     */

    if (modo.toString() === 'random') {

        letra = letraRandom();
        $('#letraRand').append('<p>' + letra + '</p>');

        $('#nao').on('click', function () {
            letra = letraRandom();
            $('#letraRand').children().remove();
            $('#letraRand').append('<p>' + letra + '</p>');
        });

        $('#sim').on('click', function () {

            if (usadas === null) {
                usadas = letra;
            } else {
                usadas += letra;
            }

            l = 0; //
            k = 0; // Faz reset nos contadores

            //verifica se acertou alguma letra e substitui na string da resposta
            while (l < palavra.length) {
                if (letra === palavra.charAt(l)) {
                    pontuacao += 2;
                    respostaJogador = respostaJogador.substituir(l, palavra.charAt(l));
                }
                l += 1;
            }

            // compara com a resposta anterior e, se forem diferentes (tiver acertado uma letra), atualiza a cópia
            // se forem as mesmas é porque não acertou e reduz o numero de tentativas
            if (respostaJogador !== respostaCopia) {
                while (k < palavra.length) {
                    respostaCopia = respostaCopia.substituir(k, respostaJogador.charAt(k));
                    k += 1;
                }
            } else {
                tentativas -= 1;
                pontuacao -= 1;
                if (tentativas > 1) {
                    $('#mensagem').children().remove();
                    $('#mensagem').append("<p>Letra errada. Tens mais " + tentativas + " tentativas.</p>");
                    $('#letrasErradas').children('p').remove();
                    $('#letrasErradas').append(letra + " ");

                    enforcado();
                } else if (tentativas === 1) {
                    $('#mensagem').children().remove();
                    $('#mensagem').append("<p>Letra errada. Tens mais 1 tentativa.</p>");
                    $('#letrasErradas').append(letra);

                    enforcado();
                }
            }

            // quebra o ciclo se o jogador esgotar as tentativas e diz a resposta
            // caso contrario, continua mostrando as letras adivinhadas ate agora pelo jogador
            if (tentativas === 0) {
                enforcado();
                $('#mensagem').children().remove();
                $('#modoRandom, #relogio').hide();
                $('#mensagem').append("<p> Perdeste. A palavra era: " + palavra + "</p>");
                $('#novoJogo').show();
            } else {
                $('#tracinhos').children().remove();
                $('#tracinhos').append("<p>" + respostaJogador.toString() + "</p>");

                if (respostaJogador === palavra) {
                    if (dificuldade === 'facil') {
                        pontuacao += 5;
                    } else if (dificuldade === 'normal') {
                        pontuacao += 10;
                    } else if (dificuldade === 'dificil') {
                        pontuacao += 15;
                    }

                    clearTimeout();
                    tempoScore();
                    addScore();
                    addTempo();

                    if (tentativas === 6) {
                        $('#letrasErradas').append(' 0').css('color', 'green');
                    }

                    $('#mensagem').children().remove();
                    $('#modoRandom, #relogio').hide();
                    $('#registoScore').show();
                    $('#novoJogo').show();

                    $('#registoBotao').on('click', function () {

                        if (sessionStorage.getItem("jogadorActual")) {
                            addListaScores();
                            $('#registoBotao').hide();
                            $('#mensagemScore').attr('class', 'w3-section w3-green');
                            $('#mensagemScore').append('<p>Pontuação registada com sucesso!</p>');
                            $('#mensagemScore').show();
                        } else {
                            $('#registoBotao').hide();
                            $('#mensagemScore').attr('class', 'w3-red');
                            $('#mensagemScore').show();
                        }

                    });
                }
            }
        });
    } else {
        /*                      MODO NORMAL                     */

        $('#botaoResposta').on('click', function () {

            letra = recebeLetra().toLowerCase();

            l = 0; //
            k = 0; // faz o reset nos contadores

            //verifica se acertou alguma letra e substitui na string da resposta
            while (l < palavra.length) {
                if (letra === palavra.charAt(l)) {
                    pontuacao += 2;
                    respostaJogador = respostaJogador.substituir(l, palavra.charAt(l));
                }
                l += 1;
            }

            // compara com a resposta anterior e, se forem diferentes (tiver acertado uma letra), atualiza a cópia
            // se forem as mesmas é porque não acertou e reduz o numero de tentativas
            if (respostaJogador !== respostaCopia) {
                while (k < palavra.length) {
                    respostaCopia = respostaCopia.substituir(k, respostaJogador.charAt(k));
                    k += 1;
                }
            } else {
                tentativas -= 1;
                pontuacao -= 1;
                if (tentativas > 1) {
                    $('#mensagem').children().remove();
                    $('#mensagem').append("<p>Letra errada. Tens mais " + tentativas + " tentativas.</p>");
                    $('#letrasErradas').children('p').remove();
                    $('#letrasErradas').append(letra + " ");

                    enforcado();
                } else if (tentativas === 1) {
                    $('#mensagem').children().remove();
                    $('#mensagem').append("<p>Letra errada. Tens mais 1 tentativa.</p>");
                    $('#letrasErradas').append(letra);

                    enforcado();
                }
            }

            // quebra o ciclo se o jogador esgotar as tentativas e diz a resposta
            // caso contrario, continua mostrando as letras adivinhadas ate agora pelo jogador
            if (tentativas === 0) {
                enforcado();
                $('#mensagem').children().remove();
                $('#modoRandom, #relogio').hide();
                $('#mensagem').append("<p> Perdeste. A palavra era: " + palavra + "</p>");
                $('#novoJogo').show();
            } else {
                $('#tracinhos').children().remove();
                $('#tracinhos').append("<p>" + respostaJogador.toString() + "</p>");

                if (respostaJogador === palavra) {
                    pontuacao += 5;

                    clearTimeout();
                    tempoScore();
                    addScore();
                    addTempo();

                    if (tentativas === 6) {
                        $('#letrasErradas').append(' 0').css('color', 'green');
                    }

                    $('#mensagem').children().remove();
                    $('#mensagem').append("<p>Parabéns, voce acertou!</p>");
                    $('#modoNormal, #relogio').hide();
                    $('#registoScore').show();
                    $('#novoJogo').show();

                    $('#registoBotao').on('click', function () {

                        if (sessionStorage.getItem("jogadorActual")) {
                            addListaScores();
                            $('#registoBotao').hide();
                            $('#mensagemScore').attr('class', 'w3-section w3-green');

                            $('#mensagemScore').show();
                        } else {
                            $('#registoBotao').hide();
                            $('#mensagemScore').attr('class', 'w3-red');
                            $('#mensagemScore').show();
                        }
                    });
                }
            }
            clearForm();
        });
    }
}

// FUNÇÃO - substitui a letra inserida pelo utilizador numa string
String.prototype.substituir = function (indice, caracter) {
    "use strict";

    return this.substr(0, indice) + caracter + this.substr(indice + 1);
};


$(document).ready(function () {
    "use strict";

    $('#botaoInicia').on('click', function () {
        var modo = document.forms.modo.option.value.toString(),
            dificuldade = document.forms.dificuldade.option.value.toString(),
            tema = document.forms.tema.option.value.toString();

        addInfo(modo, dificuldade); //junta a info ao vetor do jogador

        $('#preferencias').hide();
        $('#elemJogo').css('display', 'block');
        if (modo !== 'random') {
            $('#modoRandom').hide();
        } else {
            $('#modoNormal').hide();
        }

        jogoForca(modo, dificuldade, tema); //inicia o jogo

    });
});