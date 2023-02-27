const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const title = document.querySelector(".brand");
const note = document.querySelector("span");
const result = document.querySelector(".result");
const qq = document.querySelector(".qq");
const closeOverlayBtn = document.getElementById("close-overlay-btn");
const overlay = document.getElementById("overlay");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
  let currentGuess = "";
  let currentRow = 0;
  let done = false;
  let isLoading = true;

  const res = await fetch(
    "https://words.dev-apis.com/word-of-the-day?random=1"
  );
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");
  isLoading = false;
  setLoading(isLoading);

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

    //   validate the word

    isLoading = true;
    setLoading(isLoading);

    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });
    const resObj = await res.json();
    const validWord = resObj.validWord;

    isLoading = false;
    setLoading(isLoading);

    // validation word
    if (!validWord) {
      for (let i = 0; i < ANSWER_LENGTH; i++) {
        letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");

        // long enough for the browser to repaint without the "invalid class" so we can then add it again
        setTimeout(
          () =>
            letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid"),
          1
        );
      }
      return;
    }

    //   do all the marking as "correct" "close" or "wrong"

    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);
    console.log(map);

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // mark as correct
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // mark as correct
      if (guessParts[i] === wordParts[i]) {
        // do nothing we already did it
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        // mark as close
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
        map[guessParts[i]]--;
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }
    currentRow++;
    //   did they win or lose?

    if (currentGuess === word) {
      overlay.style.display = "flex";
      result.textContent = "Awesome!! YOU WIN";
      result.classList.add("winner");
      title.innerHTML = `<img src="./img/oh my.jpg">`;
      done = true;
      return;
    } else if (currentRow === ROUNDS) {
      overlay.style.display = "flex";
      result.textContent = `You've lost this round the word was ${word}`;
      title.innerHTML = `<img src="./img/keep it up.jpg">`;
      done = true;
    }

    currentGuess = "";
  }

  // func for removing the last letter
  function backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
  }
  // key press of the keyboard event
  document.addEventListener("keydown", (event) => {
    if (done || isLoading) {
      // do nothing
      return;
    }

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

  // Mobile key board
  const mKey = document.querySelectorAll(".key");
  for (let i = 0; i < mKey.length; i++) {
    mKey[i].addEventListener("click", (e) => {
      const mobileKey = e.target.innerHTML;

      console.log(e.target.innerHTML);
      if (mobileKey === "Enter") {
        commit();
      } else if (mobileKey === "⬅") {
        backspace();
      } else if (isLetter(mobileKey)) {
        addLetter(mobileKey.toUpperCase());
      } else {
        // do nothing
      }
    });
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// show the loading spinner when needed
function setLoading(isLoading) {
  loadingDiv.classList.toggle("hidden", !isLoading);
}

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}
closeOverlayBtn.addEventListener("click", function () {
  overlay.style.display = "none";
  window.location.reload();
});
init();
