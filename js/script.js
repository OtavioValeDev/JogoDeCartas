// Divs que exibem os jogadores e resultado
var divPlayer1 = document.getElementById('jogador1');
var divPlayer2 = document.getElementById('jogador2');
var divResultado = document.getElementById('resultado');

// Divs para exibir o placar
var divPlacar1 = document.getElementById('placar-jogador1');
var divPlacar2 = document.getElementById('placar-jogador2');

// Variáveis para contar as vitórias
var vitoriasJogador1 = 0;
var vitoriasJogador2 = 0;

// Botão para acionar a API
var button = document.getElementById('btn-json');
button.addEventListener('click', () => {
    iniciarJogo();
});

// Botão para resetar o jogo
var buttonReset = document.getElementById('btn-reset');
buttonReset.addEventListener('click', () => {
    // Limpa a exibição anterior
    divPlayer1.innerHTML = '';
    divPlayer2.innerHTML = '';
    divResultado.innerHTML = '';
    vitoriasJogador1 = 0;
    vitoriasJogador2 = 0;
    atualizarPlacar();
});

function iniciarJogo() {
    // Embaralhar o baralho
    var urlAPI = "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

    fetch(urlAPI)
        .then(response => response.json())
        .then(json => {
            var deckId = json.deck_id;
            var urlDesenho = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`; // 1 carta para cada jogador

            // Pega 2 cartas (1 para cada jogador)
            return fetch(urlDesenho);
        })
        .then(response => response.json())
        .then(json => {
            const cartas = json.cards;

            // Exibe as cartas de cada jogador
            exibirCartas(cartas[0], divPlayer1);
            exibirCartas(cartas[1], divPlayer2);

            // Avalia quem ganhou
            const resultado = avaliarMao(cartas);
            divResultado.textContent = resultado;

            // Atualiza o placar com base no resultado
            if (resultado === "Jogador 1 ganha!") {
                vitoriasJogador1++;
            } else if (resultado === "Jogador 2 ganha!") {
                vitoriasJogador2++;
            }

            atualizarPlacar();
        });
}

// Função para exibir as cartas
function exibirCartas(carta, divJogador) {
    divJogador.innerHTML = `<div style="display: inline-block; margin: 5px;">
        <img src="${carta.image}" alt="${carta.value} de ${carta.suit}" style="width: 100px; height: auto;">
    </div>`;
}

// Função para avaliar as cartas
function avaliarMao(cartas) {
    const valorCartas = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6,
        '7': 7, '8': 8, '9': 9, '10': 10,
        'JACK': 11, 'QUEEN': 12, 'KING': 13, 'ACE': 14
    };

    const valor1 = valorCartas[cartas[0].value];
    const valor2 = valorCartas[cartas[1].value];

    if (valor1 > valor2) {
        return "Jogador 1 ganha!";
    } else if (valor2 > valor1) {
        return "Jogador 2 ganha!";
    } else {
        return "Empate!";
    }
}

// Função para atualizar o placar
function atualizarPlacar() {
    divPlacar1.textContent = `Vitórias Jogador 1: ${vitoriasJogador1}`;
    divPlacar2.textContent = `Vitórias Jogador 2: ${vitoriasJogador2}`;
}
