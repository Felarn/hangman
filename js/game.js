const wordLists = {
  animals: ['аллигатор', 'антилопа', 'бабуин', 'барсук', 'медведь', 'кошка', 'хамелеон', 'гепард', 'шиншилла', 'кобра', 'койот', 'выхухоль', 'жираф', 'гекон', 'свинья'],
  fish: ['креветка', 'мидия', 'краб', 'осьминог', 'кальмар', 'устрица', 'скумбрия', 'лосось', 'тунец', 'корюшка', 'дельфин', 'акула', 'пиранья', 'планктон', 'коралл'],
  transport: ['вертолёт', 'самолёт', 'автобус', 'автомобиль', 'корабль', 'грузовик', 'паром', 'мотоцикл', 'велосипед', 'самокат', 'лодка', 'самокат', 'поезд', 'метро', 'яхта'],
  berries: ['арбуз', 'барбарис', 'боярышник', 'брусника', 'голубика', 'еживика', 'земляника', 'калина', 'кизил', 'клюква', 'морошка', 'фейхоа', 'физалис', 'шелковица', 'черёмуха'],
  space: ['пространство', 'звезда', 'планета', 'спутник', 'комета', 'космонавт', 'астронавт', 'ракета', 'метеорит', 'телескоп', 'скафандр', 'невесомость', 'вакуум', 'иллюминатор', 'гравитация'],
  music: ['аккордеон', 'банджо', 'флагот', 'кларнет', 'флейта', 'барабан', 'гитара', 'арфа', 'мандолина', 'фортепьяно', 'орган', 'труба', 'саксофон', 'скрипка', 'виолончель'],
};

const maxAttempts = 6;
const alphabet = 'абвгдежзийклмнопрстуфхцчшщъыьэюя';
const alphabetLetters = alphabet.split('');

function pickRandomWord(list) {
  const index = Math.trunc(Math.random() * list.length);
  return list[index];
}

const gameState = {
  topic: null,
  word: null,
  openedLetters: [],
  attempts: 0,
  init() {
    this.topic = new URLSearchParams(window.location.search).get('topic');
    this.word = pickRandomWord(wordLists[this.topic]);
    /* next line for testing: */
    console.log(this.word);
  },
  openLetter(letter) {
    this.openedLetters.push(letter);

    const isLetterFound = this.getWordLetters().includes(letter);
    if (!isLetterFound) {
      this.attempts += 1;
      if (this.isGameOver()) {
        this.endGame();
      }
    }
  },
  getWordLetters() {
    return this.word.split('');
  },
  isGameOver() {
    return this.attempts === maxAttempts;
  },
  isWin() {
    return !this.isGameOver() && this
      .getWordLetters().every((letter) => this.openedLetters.includes(letter));
  },
  endGame() {
    this.openedLetters = alphabetLetters;
  },
};

const view = {
  /* why we have this one line? (it isn't used anywhere) */
  keyboardButtons: [],

  renderTitle() {
    document.getElementById('topic').innerText = gameState.topic;
  },

  renderWord() {
    const container = document.querySelector('.word');
    container.innerHTML = '';
    const displayedWord = gameState.getWordLetters().map((letter) => {
      if (gameState.openedLetters.includes(letter)) {
        return letter;
      }
      return '_';
    });
    for (const letter of displayedWord) {
      const placeholder = document.createElement('span');
      placeholder.className = 'letter';
      placeholder.innerText = letter;
      container.appendChild(placeholder);
    }
  },

  renderKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    keyboardContainer.innerHTML = '';
    for (const letter of alphabetLetters) {
      const button = document.createElement('button');
      button.disabled = gameState.openedLetters.includes(letter);
      button.innerText = letter;
      keyboardContainer.appendChild(button);

      button.addEventListener('click', () => {
        gameState.openLetter(letter);
        this.render();
      });
    }
  },

  renderHangman() {
  // implement this
  // use gameState.attempts and maxAttempts
    document.querySelector('.hangman').setAttribute('data-step', gameState.attempts);
  },

  renderTryAgain() {
    document.getElementById('gameover').style.display = 'block';
    document.getElementById('word-guess').style.color = 'red';
  },

  renderWin() {
    document.getElementById('gameover').style.display = 'block';
    document.getElementById('word-guess').style.color = 'green';
  },

  render() {
    this.renderTitle();
    this.renderWord();
    this.renderHangman();
    this.renderKeyboard();
    if (gameState.isGameOver()) {
      this.renderTryAgain();
    }
    if (gameState.isWin()) {
      this.renderWin();
      gameState.endGame();
      this.renderKeyboard();
    }
  },
};

gameState.init();
view.render();
