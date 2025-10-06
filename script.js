const score = document.querySelector(".score");
const startBtn = document.querySelector(".start");
const gameArea = document.querySelector(".gameArea");
const pauseScreen = document.querySelector("#pauseScreen");
const pauseScore = document.querySelector("#pauseScore");
const challengeWordDisplay = document.querySelector("#challengeWord");
const gameContainer = document.querySelector(".game");
const comboMessage = document.querySelector("#comboMessage");
const challengeTimer = document.querySelector("#challengeTimer");

let player = {
  speed: 5,
  score: 0,
  isGamePaused: false,
  challengeWord: "",
  comboCount: 0,
  isChallengeMode: false,
  challengeTimer: 15,
  wordsFound: 0,
};

const words = {
  "žmogus": "person",
  "moteris": "woman",
  "vyras": "man",
  "vaikas": "child",
  "žmona": "wife",
  "sūnus": "son",
  "duktė": "daughter",
  "sesuo": "sister",
  "brolis": "brother",
  "močiutė": "grandma",
  "senelis": "grandpa",
  "dėdė": "uncle",
  "teta": "aunt",
};

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  Space: false,
};

let lines = [];
let enemies = [];
let car;
let wordElements = [];
let animationId;
let availableWords = [];

startBtn.addEventListener("click", () => start(1));
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

function pressOn(e) {
  e.preventDefault();
  keys[e.key] = true;
  if (e.code === "Space") {
    player.isGamePaused = !player.isGamePaused;
    if (player.isGamePaused) {
      pauseScreen.classList.remove("hide");
      pauseScore.textContent = `Score: ${player.score}`;
    } else {
      pauseScreen.classList.add("hide");
      if (player.start) {
        window.requestAnimationFrame(playGame);
      }
    }
  }
}

function pressOff(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function moveLines() {
  lines.forEach(function (item) {
    if (item.y >= 1500) {
      item.y -= 1500;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function isTranslationCorrect(myCar, enemyCar) {
const wordSpan = enemyCar.querySelector('.word-on-car'); 
let wordOnEnemy;
// 2. Если элемент найден, получаем его текстовое содержимое
if (wordSpan) {
    wordOnEnemy = wordSpan.textContent;
    
    // displayedWord теперь содержит литовское слово (например, "žmogus")
    console.log("Слово на машине:", wordOnEnemy);
}
console.log("words[wordOnEnemy]:", words[wordOnEnemy]);
  
  return player.challengeWord == words[wordOnEnemy]
}

function moveEnemy() {
  enemies.forEach(function (item) {
    if (isCollide(car, item) && isTranslationCorrect(car, item)) {
      moveWords()
      // console.log("HIT");
      // endGame();
    }
    console.log("Car y: " + item.y)
    if (item.y >= 1500) {
      item.y = -600;
      item.style.left = `${Math.floor(Math.random() * 150) + 200}px`;
      item.style.backgroundColor = randomColor();
      // 👈 Получаем новое уникальное слово для машины, которая вернулась
      const wordSpan = item.querySelector('.word-on-car');
      if (wordSpan) {
          wordSpan.textContent = getRandomLithuanianWord();
      }
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}

function getCorrectLithuanianWord() {
    for (const lithuanian in words) {
        if (words[lithuanian] === player.challengeWord) {
            return lithuanian;
        }
    }
    return null;
}

function updateChallengeWord() {
    if (availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const newLithuanianWord = availableWords[randomIndex];
        player.challengeWord = words[newLithuanianWord];
        challengeWordDisplay.textContent = player.challengeWord;
    } else {
        availableWords = Object.keys(words);
        shuffleArray(availableWords);
        updateChallengeWord();
    }
}

function spawnWords() {
    wordElements = [];
    gameArea.querySelectorAll('.word-display').forEach(word => word.remove());
    
    const wordGap = player.isChallengeMode ? 200 : 800;

    availableWords.forEach((word, index) => {
        let wordDisplay = document.createElement("div");
        wordDisplay.classList.add("word-display");
        wordDisplay.textContent = word;

        wordDisplay.y = (index + 1) * wordGap * -1;
        wordDisplay.style.top = `${wordDisplay.y}px`;
        wordDisplay.style.left = `${Math.floor(Math.random() * 150) + 50}px`;
        
        gameArea.appendChild(wordDisplay);
        wordElements.push(wordDisplay);
    });
}

function failChallenge() {
    player.isChallengeMode = false;
    challengeTimer.classList.add('hide');
    player.score = Math.max(0, player.score - 500);
    player.speed = Math.max(5, player.speed - 1);
    player.comboCount = 0;
    score.textContent = `Score: ${player.score}`;
    
    comboMessage.textContent = `TIME'S UP! -500`;
    comboMessage.style.color = 'red';
    comboMessage.classList.remove('hide');
    setTimeout(() => {
        comboMessage.classList.add('hide');
    }, 1500);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function moveWords() {
  const correctLithuanianWord = getCorrectLithuanianWord();

  // for (let i = wordElements.length - 1; i >= 0; i--) {
  //     let item = wordElements[i];

  //     if (item.y > 1500) {
  //         item.remove();
  //         wordElements.splice(i, 1);
  //         continue;
  //     }

//       if (isCollide(car, item)) {
          if (/*item.textContent === correctLithuanianWord*/true) {
              // const wordIndex = availableWords.indexOf(item.textContent);
              // if (wordIndex > -1) {
              //     availableWords.splice(wordIndex, 1);
              // }
              
              if (player.isChallengeMode) {
                  player.score += 1000;
                  player.isChallengeMode = false;
                  challengeTimer.classList.add('hide');
                  comboMessage.textContent = `BONUS! +1000`;
                  comboMessage.style.color = 'lime';
                  comboMessage.classList.remove('hide');
                  setTimeout(() => {
                      comboMessage.classList.add('hide');
                  }, 1500);

//                  gameArea.querySelectorAll('.word-display').forEach(word => word.remove());
                  wordElements = [];
                  player.wordsFound = 0;
                  
                  spawnWords(); // Добавлен вызов spawnWords()
                  updateChallengeWord(); // Добавлен вызов updateChallengeWord()
              } else {
                  player.comboCount++;
                  let bonus = player.comboCount * 100;
                  player.score += 500 + bonus;

                  if (player.comboCount >= 2) {
                      comboMessage.textContent = `COMBO! +${bonus}`;
                      comboMessage.style.color = '#ffc107';
                      comboMessage.classList.remove('hide');
                      setTimeout(() => {
                          comboMessage.classList.add('hide');
                      }, 1500);
                  }
                  player.speed += 3;
                  player.wordsFound = 1;
              }
              
          } else {
              player.comboCount = 0;
              player.score = Math.max(0, player.score - 100);
              player.speed = Math.max(5, player.speed - 0.5);
              
              score.textContent = `Score: ${player.score}`;
              
              comboMessage.textContent = `WRONG! -100`;
              comboMessage.style.color = 'red';
              comboMessage.classList.remove('hide');
              setTimeout(() => {
                  comboMessage.classList.add('hide');
              }, 1500);
          }

//          item.remove();
//          wordElements.splice(i, 1);
//          continue;
//      }
      
//      item.y += player.speed;
//      item.style.top = item.y + "px";
//  }
}

function playGame() {
  if (!player.start || player.isGamePaused) {
    window.cancelAnimationFrame(animationId);
    return;
  }
  
  moveLines();
  moveEnemy();
  // moveWords();
  
  if (player.isChallengeMode) {
      player.challengeTimer -= 1/60;
      challengeTimer.textContent = `Time: ${player.challengeTimer.toFixed(1)}s`;
      if (player.challengeTimer <= 0) {
          failChallenge();
      }
  } else {
      if (player.wordsFound > 0) {
          player.isChallengeMode = true;
          player.challengeTimer = 15;
          challengeTimer.classList.remove('hide');
          
          comboMessage.textContent = `SPEED!`;
          comboMessage.style.color = 'yellow';
          comboMessage.classList.remove('hide');
          setTimeout(() => {
              comboMessage.classList.add('hide');
          }, 1500);
          
          player.wordsFound = 0;
          shuffleArray(availableWords);
          spawnWords();
          updateChallengeWord();
      }
  }

  if (wordElements.length === 0 && !player.isChallengeMode) {
      if (availableWords.length === 0) {
          availableWords = Object.keys(words);
          shuffleArray(availableWords);
      }
      spawnWords();
      updateChallengeWord();
  }

  let road = gameArea.getBoundingClientRect();

  if (player.start) {
    if (keys.ArrowUp && player.y > road.top) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < road.bottom) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 50) {
      player.x += player.speed;
    }

    car.style.left = `${player.x}px`;
    car.style.top = `${player.y}px`;

    player.score++;
    score.textContent = `Score: ${player.score}`;
    
  }

  animationId = window.requestAnimationFrame(playGame);
}

function endGame() {
  player.start = false;
  player.comboCount = 0;
  player.isChallengeMode = false;
  challengeTimer.classList.add('hide');
  window.cancelAnimationFrame(animationId);
  
  gameArea.innerHTML = "";
  gameContainer.classList.remove("game-bg-dark");
  gameContainer.classList.add("game-bg-light");
  
  const highScore = localStorage.getItem("highScore");
  if (highScore) {
      if (player.score > highScore) {
          localStorage.setItem("highScore", player.score);
          score.innerHTML = `New High Score! Score: ${player.score}`;
      } else {
          score.innerHTML = `Game Over<br>Score was ${player.score}<br>High Score: ${highScore}`;
      }
  } else {
      localStorage.setItem("highScore", player.score);
      score.innerHTML = `Game Over<br>Score was ${player.score}<br>New High Score!`;
  }
  startBtn.classList.remove("hide");
}

function start(level) {
  if (animationId) {
    window.cancelAnimationFrame(animationId);
  }

  startBtn.classList.add("hide");
  
  gameArea.innerHTML = "";
  gameContainer.classList.remove("game-bg-light");
  gameContainer.classList.add("game-bg-dark");
  
  lines = [];
  enemies = [];
  
  player.start = true;
  player.speed = 5;
  player.score = 0;
  player.comboCount = 0;
  player.wordsFound = 0;
  player.isChallengeMode = false;
  challengeTimer.classList.add('hide');

  for (let x = 0; x < 10; x++) {
    let div = document.createElement("div");
    div.classList.add("line");
    div.y = x * 150;
    div.style.top = `${div.y}px`;
    gameArea.appendChild(div);
    lines.push(div);
  }

  car = document.createElement("div");
  car.setAttribute("class", "car");
  gameArea.appendChild(car);
  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  const wordsKeys = Object.keys(words);
  const numEnemies = 5//wordsKeys.length;
  const enemyGap = 600;

  for (let x = 0; x < numEnemies; x++) {
    let enemy = document.createElement("div");
    enemy.classList.add("enemy");
    const word = getRandomLithuanianWord(); 
    enemy.innerHTML = `<span class="word-on-car">${wordsKeys[x]}</span>`;
    enemy.y = (x + 1) * enemyGap * -1;
    enemy.style.top = `${enemy.y}px`;
    let left1 = `${Math.floor(Math.random() * 350)}px`
    enemy.style.left = left1;
    enemy.style.backgroundColor = randomColor();
    gameArea.appendChild(enemy);
    enemies.push(enemy);

  }
  
  availableWords = Object.keys(words);
  shuffleArray(availableWords);
  // spawnWords();
  // updateChallengeWord();

  animationId = window.requestAnimationFrame(playGame);
}

function randomColor() {
  let hex = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + ("000000" + hex).slice(-6);
}

function getRandomLithuanianWord() {
    // 1. Проверяем, пуста ли колода доступных слов
    if (availableWords.length === 0) {
        // 2. ЕСЛИ ПУСТА, ТОЛЬКО ТОГДА ПЕРЕМЕШИВАЕМ И ЗАПОЛНЯЕМ ЗАНОВО
        availableWords = Object.keys(words);
        shuffleArray(availableWords); 
        console.log("— Колода слов обновлена и перемешана! —");
    }
    // 3. Берем последнее слово в массиве и удаляем его (pop()).
    const word = availableWords.pop();
    return word;
}