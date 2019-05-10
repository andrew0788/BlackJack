/*----- app's state (variables) -----*/
let deck = new Array;
let pHand = new Array;
let dHand = new Array;
let winner = null;
let bet, winnings = 100;

/*----- constants -----*/
const faceCards = ['K', 'Q', 'J'];
// Game Deck
function getDeck(){
  let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  let values = ['A', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K'];
  for (let i = 0; i < suits.length; i++){
    for (let x = 0; x < values.length; x++){
      let card = {Value: values[x], Suits: suits[i]}
      deck.push(card);
    }
  }
  function shuffleDeck(){
    let i = 0;
    let j = 0;
    let temp = null;
    for (i = deck.length -1; i > 0; i -= 1){
      j = Math.floor(Math.random() * (i+1))
      temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
    return temp;
  }
  return shuffleDeck(deck);
}


/*----- cached element references -----*/
let playerTotalEl = document.getElementById('player-total')
let dealerTotalEl = document.getElementById('dealer-total')
let dHandEl = document.getElementById('dealer-hand');
let pHandEl = document.getElementById('player-hand');
let playBtn = document.getElementById('deal');
let stayBtn = document.getElementById('stay');
let totalScoreEl = document.getElementById('prize');
let betInput = document.getElementById('bet');
let scoreBoardEl= document.getElementById('score-board');


/*----- event listeners -----*/
stayBtn.addEventListener('click', dealerPlay);
playBtn.addEventListener('click', onBet);

/*----- functions -----*/

function onBet(){
  dealerTotalEl.textContent= ' '
  if (deck.length === 0) getDeck();
  if (winner){
     resetHand();
   }if (pHand.length === 0){
      init();
    }else {
      pHand.push(deck.pop());
      render(pHand);
      if (checkHand(pHand) === 21){
        winner = 'player';
        dealerPlay();
      }
      if (checkHand(pHand) > 21){
        winner = 'dealer';
        dealerPlay();
    }
  }
}

function render(hand){
  let turn; (hand === pHand) ? turn = pHandEl :turn = dHandEl;
  while(turn.hasChildNodes()){
      turn.removeChild(turn.lastChild);
    }
  //}
  for (let i=0; i < hand.length; i++){
    (faceCards.includes(hand[i].Value) || hand[i].Value == 'A') ? makeFaceCardEl(i) :makeValueCardEl(i);
  }
    function makeFaceCardEl(index){
      let newCard = hand[index];
      let cardEl = document.createElement('figure');
      turn.appendChild(cardEl).className = `card ${newCard.Suits} ${newCard.Value}`;
    }
    function makeValueCardEl(index){
      let newCard = hand[index];
      let cardEl = document.createElement('figure');
      turn.appendChild(cardEl).className = `card ${newCard.Suits} r${newCard.Value}`;
    }
  playerTotalEl.textContent = checkHand(pHand)
}

function settleBet(){
  dealerTotalEl.textContent = checkHand(dHand);
  render(dHand);
  if (winner === 'player') winnings += parseInt(bet);
  if (winner === 'dealer') winnings -= parseInt(bet);
  //if (winner === 'BlackJack') winnings += parseInt(bet*2);
  scoreBoardEl.textContent = `Last Winner: ${winner}`;
  playBtn.textContent = 'Play next hand';
  betInput.style.display = 'inline-block';
  stayBtn.style.display = 'none';
}

function dealerPlay(){
  let dTotal = checkHand(dHand);
  let pTotal = checkHand(pHand);
  dealerTotalEl.textContent = dTotal;
  if (pTotal < 21){
    while (dTotal < 17 && winner === null){
      dHand.push(deck.pop());
      dTotal = checkHand(dHand);
      }
      (dTotal > 21 || (pTotal <= 21 && pTotal > dTotal)) ? winner ='player'
    :(dTotal > pTotal) ? winner = 'dealer'
    :winner = 'draw';
  }
  settleBet();
  }

function checkHand(hand){
  let score = 0;
  hand.sort(function (card){
    if (card.Value === 'A'){ return 1;
    } else return -1;
    });
  hand.forEach(card =>
    parseInt(card.Value) ? score += parseInt(card.Value)
    :faceCards.includes(card.Value) ? score += 10
    :(score <= 10) ? score += 11 :score += 1
  )
  return score;
}

function init(){
  //deals cards
  pHand = deck.splice(0, 2);
  dHand = deck.splice(0, 2);
  //store bet value
  bet = betInput.value;
  //set window for main  game loop
  winner = null;
  playBtn.textContent = 'Hit';
  stayBtn.style.display = 'inline-block';
  betInput.style.display = 'none';
  if (checkHand(pHand) === 21) {
    winner = 'BlackJack';
    settleBet();
  };
  render(pHand);
  renderDealerFirstDeal();
}

function resetHand(){
  pHand = new Array;
  dHand = new Array;
  totalScoreEl.textContent = `Current Total: ${parseInt(winnings)}`;
  betInput.style.display = 'inline-block';
  playBtn.textContent = 'Place Bet';
  stayBtn.style.display = 'none';
  winnner = null;
  render(pHand);
  render(dHand);
}
function renderDealerFirstDeal(){
  while(dHandEl.hasChildNodes()){
      dHandEl.removeChild(dHandEl.lastChild);
    }
  let dCardBack = document.createElement('figure');
  let dCard = document.createElement('figure');
  dHandEl.appendChild(dCardBack).className = 'card back';
  dHandEl.appendChild(dCard).className = `card ${dHand[1].Suits} r${dHand[1].Value} ${dHand[1].Value}`;
}
