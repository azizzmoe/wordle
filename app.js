const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;

async function init() {
  // tracks the word that has been guessed
  let currentGuess = "";
  // tracks the row wer'e on
  let currentRow = 0;

  const res = await fetch(
    "https://words.dev-apis.com/word-of-the-day?random=1"
  );
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  console.log(word);
  setLoading(false);

  // Adding letter to the dom
  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      // add letter to the end
      currentGuess += letter;
    } else {
      // replace the last letter
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText =
      letter;
  }

  // func for Enter button
  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // do nothing
      return;
    }

    // TODO validate the word

    // TODO do all the marking as "correct" "close" or "wrong"

    // TODO did they win or lose?

    currentRow++;
    currentGuess = "";
  }

  // func for removing the last letter
  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
  }
  // key press of the keyboard event
  document.addEventListener("keydown", (event) => {
    const action = event.key;

    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // do nothing
    }
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  loadingDiv.classList.toggle("show", !isLoading);
}

init();
