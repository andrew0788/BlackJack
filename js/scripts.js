/*----- app's state (variables) -----*/
let deck = new Array;
let pHand = new Array;
let dHand = new Array;
let bet, winner;
let winnings = 0;

/*----- constants -----*/
// Game Deck
function getDeck(){
  let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
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
let playerHandCardsEl = document.querySelectorAll('#player-hand .card');
let dealerHandCardsEl = document.querySelectorAll('#dealer-hand .card');
let playBtn = document.getElementById('deal');
let stayBtn = document.getElementById('stand');
let totalScoreEl = document.getElementById('prize');
let betInput = document.getElementById('bet');
let scoreBoardEl= document.getElementById('score-board');

/*----- event listeners -----*/
stayBtn.addEventListener('click', dealerPlay);
playBtn.addEventListener('click', onBet);

/*----- functions -----*/

function onBet(){
  // if deck is empty generate a new one
  if (deck.length === 0) getDeck();
  // if new hand, deal cards for player and dealer
  if (pHand.length === 0){
    init();
  }else{
    pHand.push(deck.pop());
    render();
  }
  //render will display cards, and call function to look for a winner
  if (checkHand(pHand) === 21){
    winner = 'player';
    winnings += bet;
  } else if (checkHand(pHand) > 21){
    alert('bust');
    winner = 'dealer';
  }
  if (winner) settleBet();
  }

function render(){
  for (let i=0; i < pHand.length; i++){
  playerHandCardsEl[i].textContent = pHand[i].Value;
  dealerHandCardsEl[i].textContent = dHand[i].Value;
  }
}

function settleBet(){
    scoreBoardEl.textContent = winner;
    if (winner === 'player') winnings += bet;
    if (winner === 'dealer') winnings -= bet;
    if (winner === 'BlackJack') winnings += bet*2;
    resetHand();
}

function checkWin(){
  let pTotal = checkHand(pHand);
  let dTotal = checkHand(dHand);
  if (dTotal < pTotal){
      winner = 'player';
    }
}
function dealerPlay(){
  dScore = checkHand(dHand);
  while (checkHand(dHand) < 17){
    dHand.push(deck.pop());
    for (let i=1; i < dHand.length; i++){
      dealerHandCardsEl[i].textContent = dHand[i].Value;
    }
  }
  (dScore < 21 && dScore > checkHand(pHand)) ? winner = 'dealer' :winner ='player';
  settleBet();
  }

function checkHand(hand){
  let score = 0;
  hand.forEach(card =>
    parseInt(card.Value) ? score += parseInt(card.Value)
    :faceCards.includes(card.Value) ? score += 10
    :this.suits === 'A' && score <= 10 ? score += 11 :score += 1
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
  if (pHand[1].Values && pHand[2].Values === 'A') {
    score = 21
  }
  if (faceCards.includes(pHand.Values) && pHand.Values.includes('A')){
    winner = 'BlackJack'
    alert('BLACKJACK!')
  }
  render();
}

function resetHand(){
  pHand = new Array;
  dHand = new Array;
  totalScoreEl.text = winnings;
  betInput.style.display = 'inline-block';
  playBtn.textContent = 'Place Bet';
  stayBtn.style.display = 'none';
  render();
}
