const wordle = document.getElementById("wordle");
const letters = document.getElementById("letters");
const form = document.getElementById("guess-form");
const input = document.getElementById("guess-input");
const guesses = document.getElementById("guesses");

// An array of all the possible letters
const allLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// Generate a random set of letters
const generatedLetters = [];
for (let i = 0; i < 6; i++) {
  const index = Math.floor(Math.random() * allLetters.length);
  generatedLetters.push(allLetters[index]);
}

// Display the generated letters
generatedLetters.forEach((letter) => {
  const letterEl = document.createElement("div");
  letterEl.classList.add("letter");
  letterEl.textContent = letter;
  letters.appendChild(letterEl);
});

// Handle form submissions
document.getElementById("enter").addEventListener("click", (event) => {
  event.preventDefault();

  // Get the player's guess
  const guess = input.value.toUpperCase();

  // Check if the guess is a valid word
  if (isValidWord(guess)) {
    // Add the guess to the list of guesses
    const guessEl = document.createElement("div");
    guessEl.classList.add("guess");
    guessEl.textContent = guess;
    guesses.appendChild(guessEl);

    // Clear the input field
    input.value = "";
  } else {
    // Display an error message
    alert("Please enter a valid word.");
  }
});

document.getElementById("restart").addEventListener("click", function () {
  location.reload();
});

// Check if a word is valid
function isValidWord(word) {
  // Check if the word is made up of only the generated letters
  for (let i = 0; i < word.length; i++) {
    if (!generatedLetters.includes(word[i])) {
      return false;
    }
  }

  // Check if the word is at least 3 letters long
  if (word.length < 3) {
    return false;
  }

  // Check if the word is a real word (you could use a dictionary API for this)
  // For the purposes of this example, we'll just assume that any word made up of the generated letters is valid
  return true;
}
