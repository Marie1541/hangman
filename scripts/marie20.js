const keyboard = document.getElementById("keyboard");

//const textInput = document.getElementById("text-input");
const outputSelectedLetters = document.getElementById("outputSelectedLetters");
const divMessage = document.getElementById("divMessage");
const usedKeys = new Set();

const wordDisplay = document.querySelector(".wordDisplay");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box");
const topMessageDiv = document.querySelector(".topMessageDiv");
const playAgainBtn = document.getElementById("play_againButton");

const wordList = new Set();

let currentWord;
let correctLetters;
let wrongGuessCount;

const maxGuesses = 6;

/*XXXX Fetch thing XXXXX*/

const fetch_hangman_file_location = "data/hangman2.json";

window.addEventListener("load", function () {
  fetch("data/hangman2.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.wordList);

      resetGame();
    })
    .catch((error) => console.error("Error loading level:", error));
});

function capitalizeFirstLetter(str) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function resetGame() {
  fetch("data/hangman2.json")
    .then((response) => response.json())
    .then((data) => {
      // Use the data to create game elements
      console.log(data.wordList);
      //console.log(data.wordList.length);

      let wordList = data.wordList;

      const { word, hint } =
        wordList[Math.floor(Math.random() * wordList.length)];

      currentWord = word; // Making currentWord as random word

      document.querySelector(".hint-text").innerText = hint;

      correctLetters = [];
      wrongGuessCount = 0;
      hangmanImage.src = "images/Coffee pot - 1.png";

      outputSelectedLetters.innerText = `Incorrect selected letters: ${wrongGuessCount} / ${maxGuesses}`;
      wordDisplay.innerHTML = currentWord
        .split("")
        .map(() => `<li class="letter"></li>`)
        .join("");
      keyboardDiv
        .querySelectorAll("button")
        .forEach((btn) => (btn.disabled = false));
      keyboardDiv
        .querySelectorAll("button")
        .forEach((btn) => (btn.style.backgroundColor = `#634832`));
      topMessageDiv.querySelector("h4").innerText = "Hangman Game";
      topMessageDiv.querySelector("p").innerHTML = `<b>Good luck!</b>`;
    });
}

const gameOver = (isVictory) => {
  const textLoseOrWin = isVictory
    ? `You found the word:`
    : "The correct word was:";
  hangmanImage.src = `images/${isVictory ? "cup_smiling" : "cup_crying"}.gif`;

  topMessageDiv.querySelector("h4").innerText = isVictory
    ? "Congrats!"
    : "Game Over!";
  topMessageDiv.querySelector(
    "p"
  ).innerHTML = `${textLoseOrWin} <b>${capitalizeFirstLetter(currentWord)}</b>`;
};

// Checking if clickedLetter is exist on the currentWord
const initGame = (button, clickedLetter) => {
  // Checking if clickedLetter is exist on the currentWord
  if (currentWord.includes(clickedLetter)) {
    // Showing all correct letters on the word display
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
      }
    });
  } else {
    // If clicked letter doesn't exist then update the wrongGuessCount and hangman image

    $("#imageHangmanID").fadeTo(200, 1, function () {
      $("#imageHangmanID").fadeTo(300, 0.3, function () {
        $("#imageHangmanID").fadeTo(400, 1);
      });
    });
    wrongGuessCount++;
    hangmanImage.src = `images/Coffee pot - ${wrongGuessCount}.png`;

    /* $("#imageHangmanID").fadeTo(500,0.30, function() {
    $(this).find$("#imageHangmanID").fadeOut();

}, function() {

    $(this).find$("#imageHangmanID").fadeIn();

});*/
  }
  button.disabled = true; // Disabling the clicked button so user can't click again
  button.style.backgroundColor = `#967259`;
  //button.style.cursor = `not-allowed`;

  outputSelectedLetters.innerText = `Incorrect selected letters: ${wrongGuessCount} / ${maxGuesses}`;
  // Calling gameOver function if any of these condition meets
  if (wrongGuessCount === maxGuesses) {
    keyboardDiv
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = true));
    keyboardDiv
      .querySelectorAll("button")
      .forEach((btn) => (btn.style.backgroundColor = `#967259`));
    return gameOver(false);
  }

  if (correctLetters.length === currentWord.length) {
    keyboardDiv
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = true));
    keyboardDiv
      .querySelectorAll("button")
      .forEach((btn) => (btn.style.backgroundColor = `#967259`));

    return gameOver(true);
  }
};

for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener("click", (e) =>
    initGame(e.target, String.fromCharCode(i))
  );
}

playAgainBtn.addEventListener("click", resetGame);
