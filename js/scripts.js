/*----- app's state (variables) -----*/
let deck = new Array;
let pHand = new Array;
let dHand = new Array;
let bet, winner;
let winnings = 0;
let turn ={
  'player': handEl = document.getElementById('#dealer-hand')
}
/*----- constants -----*/
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

const faceCards = ['K', 'Q', 'J'];

/*----- cached element references -----*/
let dHandEl = document.getElementById('dealer-hand');
let pHandEl = document.getElementById('player-hand');
let playBtn = document.getElementById('deal');
let stayBtn = document.getElementById('stand');
let totalScoreEl = document.getElementById('prize');
let betInput = document.getElementById('bet');
let scoreBoardEl= document.getElementById('score-board');
//let dealerHandCardsEl = document.querySelectorAll('#dealer-hand .card');
//let playerHandCardsEl = document.querySelectorAll('#player-hand .card');

/*----- event listeners -----*/
stayBtn.addEventListener('click', dealerPlay);
playBtn.addEventListener('click', onBet);

/*----- functions -----*/

function onBet(){
  // if deck is empty generate a new one
  if (deck.length === 0) getDeck();
  // if player's hand is empty, start a new game
  if (pHand.length === 0){
    init();
    //otherwise add a card to the players hand
  }else {
    pHand.push(deck.pop());
    render(pHand);
  }
  if (checkHand(pHand) === 21 && !winner){
    winner = 'player';
  } else if (checkHand(pHand) > 21){
    alert('bust');
    winner = 'dealer';
  }
  if (winner) settleBet();
  }

function render(hand){
  let turn; (hand === pHand) ? turn = pHandEl :turn = dHandEl;
  if (hand.length === 0 || hand.length > 2) {
    while(turn.hasChildNodes()){
      turn.removeChild(turn.lastChild);
    }
  }
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
}

function settleBet(){
    scoreBoardEl.textContent = winner;
    if (winner === 'player') winnings += bet;
    if (winner === 'dealer') winnings -= bet;
    if (winner === 'BlackJack') winnings += bet*2;
    resetHand();
}

// function checkWin(){
//   let pTotal = checkHand(pHand);
//   let dTotal = checkHand(dHand);
//   if (dTotal < pTotal){
//       winner = 'player';
//     }

function dealerPlay(){
  dScore = checkHand(dHand);
  while (checkHand(dHand) < 17){
    dHand.push(deck.pop());
    render(dHand);
    }
  (dScore < 21 && dScore > checkHand(pHand)) ? winner = 'dealer' :winner ='player';
  settleBet();
  }

function checkHand(hand){
  let score = 0;
  hand.forEach(card =>
    parseInt(card.Value) ? score += parseInt(card.Value)
    :faceCards.includes(card.Value) ? score += 10
    :((card.Suits === 'A') && (score <= 10)) ? score += 11 :score += 1
  )
  return score;
  }

function init(){
  //deals cards
  pHand = deck.splice(0, 2);
  dHand = deck.splice(0, 2);
  //store bet value
  bet = betInput.value;
  playBtn.textContent = 'Hit';
  //set window for main  game loop
  winner = false;
  stayBtn.style.display = 'inline-block';
  betInput.style.display = 'none';
  //if previous steps have already been done, draw card for player
  //if (faceCards.includes(pHand.Value) && (pHand.Value === 'A'){
    //winner = 'BlackJack';
    //alert('BLACKJACK!');
  render(pHand);
}

function resetHand(){
  pHand = new Array;
  dHand = new Array;
  totalScoreEl.textContent = JSON.stringify(winnings);
  betInput.style.display = 'inline-block';
  playBtn.textContent = 'Place Bet';
  stayBtn.style.display = 'none';
  render(pHand);
}
