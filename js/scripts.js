/*----- constants -----*/

// Game Deck

/*----- app's state (variables) -----*/
let deck = new Array;
let pHand = new Array;
let dHand = new Array;
let bet,winnings;

/*----- cached element references -----*/
const playBtn = document.getElementById('deal');
const stayBtn = document.getElementById('stand');
const prize = document.getElementById('prize')
const betInput = document.getElementById('bet')

/*----- event listeners -----*/
stayBtn.addEventListener('click', stay)
playBtn.addEventListener('click', deal)

/*----- functions -----*/
//start game with a shuffled deck of cards
getDeck();

function getDeck(){
  let suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  let values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  for (let i = 0; i < suits.length; i++){
    for (let x = 0; x < values.length; x++){
      let card = {Value: values[x], Suits: suits[i]}
      deck.push(card);
    }
  }
  return shuffleDeck(deck);
}

function shuffleDeck(arr){
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

function deal(){
  // when player places bet
  if (pHand.length === 0){
    //deals cards
    pHand = deck.splice(0, 2);
    dHand = deck.splice(0, 2);
    //store bet value
    bet = parseInt(betInput.value);
  }
  else if (deck.length > 0) {
    pHand.push(deck.pop());
  } else {
    //if the deck is empty shuffle a new one
    alert('Shuffling New Deck.')
    getDeck();
  }
  checkHand(pHand);
}
function init(){
}

function stay(){
  dealerPlay(dHand);
  playBtn.textContent= 'Deal next Hand';
  prize.textContent = winnings;
}
function dealerPlay(dHand){
  dScore = checkHand(dHand);
  while (checkHand(dHand) < 21){
    dHand.push(deck.pop());
    }
  console.log(dHand)
  }

function checkHand(hand){
  let score = 0;
  let faceCards = ['K', 'Q', 'J']
  hand.forEach(card =>
    parseInt(card.Value) ? score += parseInt(card.Value)
    :faceCards.includes(card.Value) ? score += 10
    :score <= 10 ? score += 11 :score += 1
  )
  console.log(score);
  if (score >= 21) stay();
}


function render(){
  playBtn.textContent = 'Hit';
  //set window for main  game loop
  stayBtn.style.display = 'inline-block';
  betInput.style.display = 'none';
  //if previous steps have already been done, draw card for player
}
