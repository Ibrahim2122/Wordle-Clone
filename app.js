document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    createKeyboard();

    let word = "";
    let guessedWords = [[]];
    let availableSpace = 0;
    let guessedWordCount = 0;

    let newWordGenerator = async () => {
      try {
        const response = await fetch(
          "https://random-word-api.vercel.app/api?words=1&length=5"
        );
        const data = await response.json();
        word = data[0];
      } catch (err) {
        console.log("Error:", err);
      }
    };

    (async () => {
      await newWordGenerator();
    })();

    function getCurrentWordArr() {
      const numberOfGuessedWords = guessedWords.length;
      return guessedWords[numberOfGuessedWords - 1];
    }

    function getBackgroundColor(letter, index) {
      if (!word.includes(letter)) {
        return "#a4aec4!important";
      }

      let letterInThatPosition = word.charAt(index);
      if (letterInThatPosition === letter) {
        return "#79b851!important";
      }

      return "#f3c237!important";
    }

    function restartGame() {
      location.reload();
    }

    function haveWon() {
      const popup = document.createElement("div");
      const btn = document.createElement("button");
      popup.classList.add("popup");
      btn.classList.add("restart-btn");
      popup.textContent = "Congratulations";
      btn.textContent = "Play Again?";
      btn.onclick = restartGame;
      const container = document.querySelector(".popup-container");
      container.appendChild(popup);
      container.appendChild(btn);
      container.style.display = "block";
    }

    function haveLost() {
      const popup = document.createElement("div");
      const btn = document.createElement("button");
      popup.classList.add("popup");
      btn.classList.add("restart-btn");
      popup.innerHTML = `You have lost<br>The word is: ${word}`;
      btn.textContent = "Try Again?";
      btn.onclick = restartGame;
      const container = document.querySelector(".popup-container");
      container.appendChild(popup);
      container.appendChild(btn);
      container.style.display = "block";
    }

    function wordTooShort() {
      const popup = document.createElement("div");
      popup.classList.add("popup");
      popup.textContent = "Too Short";
      const container = document.querySelector(".popup-container");
      container.appendChild(popup);
      container.style.display = "block";

      setTimeout(() => {
        popup.remove();
        container.style.display = "none";
      }, 1500);
    }

    function wordNotFound() {
      const popup = document.createElement("div");
      popup.classList.add("popup");
      popup.textContent = "Word not found";
      const container = document.querySelector(".popup-container");
      container.appendChild(popup);
      container.style.display = "block";

      setTimeout(() => {
        popup.remove();
        container.style.display = "none";
      }, 1500);
    }

    function sumbitHandler() {
      const currentWordArr = getCurrentWordArr();

      if (currentWordArr.length != 5) {
        wordTooShort();
        return;
      }
      const currentWord = currentWordArr.join("");
      fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`
      ).then((response) => {
        if (!response.ok) {
          wordNotFound();
          return;
          throw new Error("Word not found");
        }
        const firstLetterInRow = guessedWordCount * 5;
        currentWordArr.forEach((letter, index) => {
          setTimeout(() => {
            const backgroundColor = getBackgroundColor(letter, index);
            const letterEl = document.getElementById(firstLetterInRow + index);
            letterEl.classList.add("animate__flipInX");
            letterEl.style = `background-color:${backgroundColor}; color:#fbfcff; border: 2px solid ${backgroundColor}`;
          }, 200 * index);
        });
        guessedWordCount++;

        if (currentWord === word) {
          haveWon();
        }
        if (guessedWords.length === 6) {
          haveLost();
        }
        guessedWords.push([]);
      });
    }

    function addLetter(letter) {
      let currentWord = getCurrentWordArr();

      if (currentWord && currentWord.length < 5) {
        currentWord.push(letter);

        const availableBoardMember = document.getElementById(availableSpace);
        availableBoardMember.classList.add("animate__bounceIn");
        availableBoardMember.textContent = letter;

        availableSpace++;
      }
    }

    function deleteHandler() {
      const currentWordArr = getCurrentWordArr();

      if (currentWordArr.length > 0) {
        const lastLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(
          String(availableSpace - 1)
        );
        lastLetterEl.textContent = "";
        availableSpace = availableSpace - 1;
      }
    }

    function createKeyboard() {
      const keyboardEl = document.querySelectorAll(".keyboard-row-button");
      for (let i = 0; i < keyboardEl.length; i++) {
        keyboardEl[i].addEventListener("click", () => {
          const char = keyboardEl[i].getAttribute("data-key");

          if (char === "enter") {
            sumbitHandler();
            return;
          }

          if (char === "del") {
            deleteHandler();
            return;
          }
          addLetter(char);
        });
      }
    }


    function createBoard() {
      const board = document.querySelector(".board");

      for (let i = 0; i < 30; i++) {
        let boardMember = document.createElement("div");
        boardMember.classList.add("boardMember");
        boardMember.classList.add("animate__animated");
        boardMember.setAttribute("id", i);
        board.appendChild(boardMember);
      }
    }
    
    

})