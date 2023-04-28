
const rows = ['a', 'b', 'c'];
const cols = ['1', '2', '3'];

const answer = {
  a1: 'r',
  a2: 'e',
  a3: 'f',
  b1: 'o',
  b2: 'a',
  b3: 'r',
  c1: 'd',
  c2: 'r',
  c3: 'y',
  words: ['ref', 'oar', 'dry', 'rod', 'ear', 'fry']
}

let playArea = {
  a1: 'r',
  a2: 'e',
  a3: 'f',
  b1: 'o',
  b2: 'a',
  b3: 'r',
  c1: 'd',
  c2: 'r',
  c3: 'y',
  words: []
}


//Player moves (keyboard):


const playerHistory = [];


function saveToHistory(e) {

  //check if last move was an undo. if false save last move to playerHistory 
  e.undo === true ? null : playerHistory.push(e.key);

}


function moveSelector(e) {

  // logic to move selector according to rows and cols index position.
  // up/left = -1, down/right = +1
  // if index = -1 then + length of array
  // if index = length of array then set to 0.

  let selector = document.querySelector('[data-selector="true"]');

  function changeSelector(newSelectorPosition) {
    let newSelector = document.querySelector(`.${newSelectorPosition}`);

    selector.classList.remove('selector');
    selector.setAttribute('data-selector', 'false');

    newSelector.classList.add('selector');
    newSelector.setAttribute('data-selector', 'true');
  }


  function findNewSelector(e) {

    let oldTilePosition = selector.classList[0];

    let indexPosition = null;
    let trueIndexPosition = null;

    switch (e.key) {
      case 'w':

        //Get index position of row/col value from rows/cols array. -1 if up/left, +1 if down/right
        indexPosition = rows.indexOf(oldTilePosition[0]) - 1;

        //test value of new index position to see if -1 or = to length of rows/cols.
        trueIndexPosition = (indexPosition === -1) ? rows.length - 1 : indexPosition;

        //return grid position class name (ex: 'c2') for new selector
        return rows[trueIndexPosition] + oldTilePosition[1];

      case 'a':
        
        indexPosition = cols.indexOf(oldTilePosition[1]) - 1;
        trueIndexPosition = (indexPosition === -1) ? cols.length - 1 : indexPosition;
        return oldTilePosition[0] + cols[trueIndexPosition];

      case 's':

        indexPosition = rows.indexOf(oldTilePosition[0]) + 1;
        trueIndexPosition = (indexPosition === rows.length) ? 0 : indexPosition;
        return rows[trueIndexPosition] + oldTilePosition[1];

      case 'd':

        indexPosition = cols.indexOf(oldTilePosition[1]) + 1;
        trueIndexPosition = (indexPosition === cols.length) ? 0 : indexPosition;
        return oldTilePosition[0] + cols[trueIndexPosition];

      default:
        break;
    }

  }


  let newSelectorPosition = findNewSelector(e);

  changeSelector(newSelectorPosition);

  saveToHistory(e);

}


function moveTiles(e, startTime) {
    
  //logic for shifting tile contents:
  //find where the selector is.
  //if left or right, get row value
  //if up or down, get col value
  //retrieve all elements in same row or col
  //compile their innerHTML into an array
  //shift their indexes +1 (right/down) or -1 (left/up)
  //reassign innerHTML

  let selector = document.querySelector('[data-selector="true"]');

  function slideTiles(e) {

    let elementContent = [];
    let elements = null;

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      let row = selector.getAttribute('data-row');
      elements = document.querySelectorAll(`[data-row="${row}"]`);
    } else {
      let col = selector.getAttribute('data-col');
      elements = document.querySelectorAll(`[data-col="${col}"]`);
    }

    elements.forEach(el => elementContent.push(el.innerHTML));

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      elementContent.push(elementContent[0]);
      elementContent.shift();
    } else {
      elementContent.unshift(elementContent[elementContent.length - 1]);
      elementContent.pop();
    }
    
    for(let i = 0; i < elements.length; i++) {
      elements[i].innerHTML = elementContent[i];
    }

  }

  slideTiles(e);

  colorTiles();

  saveToHistory(e);

  win(startTime);

  //calling animation last due to time delay that it adds.
  slideAnimation(e);

}


function keyboardHandler(e, startTime = null) {

  switch (e.key) {
    case 'w':
    case 'a':
    case 's':
    case 'd':
      moveSelector(e);
      break;
    case 'ArrowUp':
    case 'ArrowRight':
    case 'ArrowLeft':
    case 'ArrowDown':
      moveTiles(e, startTime);
      break;
    case 'z':
      if (e.ctrlKey) {
        undo();
      }
      break;
    default:
      break;
  }
  
}


//Animation:


function slideAnimation(e) {

  let selector = document.querySelector('[data-selector="true"]');

  let tiles = [];
  
  function createTempTile(tiles, slideClass) {

    let tileToClone = null;

    switch (slideClass) {
      case 'slide-up':
      case 'slide-left':
        tileToClone = tiles[tiles.length - 1];
        break;
      case 'slide-down':
      case 'slide-right':
        tileToClone = tiles[0];
        break;
      default:
        break;
    }

    let tempTile = tileToClone.cloneNode();
    tempTile.classList.remove('tile');
    tempTile.innerHTML = tileToClone.innerHTML;

    tempTile.classList.add('tempTile');

    let row = tempTile.getAttribute('data-row');
    let col = tempTile.getAttribute('data-col');

    let playAreaDiv = document.querySelector('.play-area');

    playAreaDiv.insertAdjacentElement('beforebegin', tempTile);

    //apply position based on col / row and direction sliding
    switch (slideClass) {
      case 'slide-right':
        if (row === 'a') {
          tempTile.style.top = '0px';
        } else if (row === 'b') {
          tempTile.style.top = '139px';
        } else {
          tempTile.style.top = '277px';
        }
        tempTile.style.left = '416px';
        break;
      case 'slide-left':
        if (row === 'a') {
          tempTile.style.top = '0px';
        } else if (row === 'b') {
          tempTile.style.top = '139px';
        } else {
          tempTile.style.top = '277px';
        }
        tempTile.style.left = '-139px';
        break;
      case 'slide-down':
        if (col === '1') {
          tempTile.style.left = '0px';
        } else if (col === '2') {
          tempTile.style.left = '139px';
        } else {
          tempTile.style.left = '277px';
        }
        tempTile.style.top = '416px';
        break;
      case 'slide-up':
        if (col === '1') {
          tempTile.style.left = '0px';
        } else if (col === '2') {
          tempTile.style.left = '139px';
        } else {
          tempTile.style.left = '277px';
        }
        tempTile.style.top = '-139px';
        break;
      default:
        break;
    }

    return tempTile;

  }


  function animate(tiles, slideClass) {

    //will add the tile to the tiles array
    let tempTile = createTempTile(tiles, slideClass);

    //add animation to temp tile
    tempTile.classList.add(`disappear-${slideClass}`);

    tempTile.addEventListener('animationend', () => {
      tempTile.classList.remove(`disappear-${slideClass}`);
      tempTile.remove();
    });

    //Add animation to main tiles
    tiles.forEach((tile, index, tiles) => {

      tile.classList.add(slideClass);

      switch (slideClass) {
        case 'slide-up':
        case 'slide-left':
          if (index === tiles.length - 1) {
            tile.classList.add(`reappear-${slideClass}`);
          }
          break;
        case 'slide-down':
        case 'slide-right':
          if (index === 0) {
            tile.classList.add(`reappear-${slideClass}`);
          }
          break;
        default:
          break;
      }

      tile.addEventListener('animationend', () => {
        tile.classList.remove(slideClass);
        tile.classList.remove(`reappear-${slideClass}`);
      }, { once: true });

    });
  }

  //find which tiles needs to slide
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    let col = selector.getAttribute('data-col');
    tiles = document.querySelectorAll(`[data-col="${col}"]`);
  } else {
    let row = selector.getAttribute('data-row');
    tiles = document.querySelectorAll(`[data-row="${row}"]`);
  }

  //What direction do they need to slide
  switch (e.key) {
    case 'ArrowUp':
      animate(tiles, 'slide-up');
      break;
    case 'ArrowDown':
      animate(tiles, 'slide-down');
      break;
    case 'ArrowLeft':
      animate(tiles, 'slide-left');
      break;
    case 'ArrowRight':
      animate(tiles, 'slide-right');
      break;
    default:
      break;
  }
  
}


//Board Logic:


function createPlayerWords() {

  let rowA = playArea.a1 + playArea.a2 + playArea.a3;
  let rowB = playArea.b1 + playArea.b2 + playArea.b3;
  let rowC = playArea.c1 + playArea.c2 + playArea.c3;
  let col1 = playArea.a1 + playArea.b1 + playArea.c1;
  let col2 = playArea.a2 + playArea.b2 + playArea.c2;
  let col3 = playArea.a3 + playArea.b3 + playArea.c3;
  playArea.words = [rowA, rowB, rowC, col1, col2, col3];

}


function updatePlayArea() {

  let tiles = document.querySelectorAll('.tile');

  //loop over properties in PlayArea, assigning innerHTML value to corresponding tile
  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    let position = tile.classList[0];
    playArea[position] = tile.innerHTML.toLowerCase();
  }

  createPlayerWords();

}


function validateTiles() {

  let matches = [];

  //update the playArea object
  updatePlayArea();

  //check player.words vs answer.words
  for (let i = 0; i < playArea.words.length; i++) {
    let word = playArea.words[i];
    if (answer.words.includes(word)) {
      matches.push(word);
    }
  }

  return matches;

}


function validateColors() {

  let colors = {
    correct: [],
    close: []
  }

  let matches = validateTiles();

  //loop over matching words
  for (let i = 0; i < matches.length; i++) {

    //use index position of matching words in playArea.words array to determine tiles to color. Array order: [rowA, rowB, rowC, col1, col2, col3]
    let wordPosition = playArea.words.indexOf(matches[i]);
    let correctWordPostition = answer.words.indexOf(matches[i]);

    let tiles = [];

    //set tiles based off index in playArea.words array.
    switch (wordPosition) {
      case 0:
        tiles = ['a1', 'a2', 'a3'];
        break;
      case 1:
        tiles = ['b1', 'b2', 'b3'];
        break;
      case 2:
        tiles = ['c1', 'c2', 'c3'];
        break;
      case 3:
        tiles = ['a1', 'b1', 'c1'];
        break;
      case 4:
        tiles = ['a2', 'b2', 'c2'];
        break;
      case 5:
        tiles = ['a3', 'b3', 'c3'];
        break;
      default:
        break;
    }

    wordPosition === correctWordPostition ? colors.correct = colors.correct.concat(tiles) : colors.close = colors.close.concat(tiles);

  }

  return colors;

}


function colorTiles() {

  let colors = validateColors();
  let correctTiles = document.querySelectorAll('.correct');
  let closeTiles = document.querySelectorAll('.close');
  
  //remove .close and .correct classes
  for (let i = 0; i < closeTiles.length; i++) {
    closeTiles[i].classList.remove('close');
  }

  for (let i = 0; i < correctTiles.length; i++) {
    correctTiles[i].classList.remove('correct');
  }

  //apply .close class
  for (let i = 0; i < colors.close.length; i++) {
    let el = document.querySelector(`.${colors.close[i]}`);
    el.classList.add('close');
  }

  //apply .correct class
  for (let i = 0; i < colors.correct.length; i++) {
    let el = document.querySelector(`.${colors.correct[i]}`);
    el.classList.add('correct');
  }

}


function getTime(startTime) {

  //to add starting '0's to single digit numbers (8 => 08)
  Number.prototype.numOfDigits = function(n = 2) {
    //n is the number of digits to display, no argument defaults to 2
    let number = new Array(n).join('0') + this;
    return number.slice(n * -1);
  }

  let elapse = new Date() - startTime;
  let timeInSecs = elapse / 1000;
  let numOfMins = Math.floor(timeInSecs / 60);
  let numOfSecs = Math.round(timeInSecs % 60);

  return `${numOfMins.numOfDigits()}:${numOfSecs.numOfDigits()}`;

}


function clearStorage(date) {

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key !== date && key !== 'firstVisit') {
      localStorage.removeItem(key);
    }
  }

}


function saveTime(startTime, time) {

  let date = startTime.toDateString().toLowerCase().split(' ').join('');
  clearStorage(date);
  localStorage.setItem(date, time);

}


function win(startTime) {

  //does every element on the grid have a .correct class?
  if (document.querySelectorAll('.correct').length === Object.keys(playArea).length - 1) {

    let time = getTime(startTime);

    document.removeEventListener('keydown', (e) => {
      keyboardHandler(e, startTime);
    });

    document.querySelector('.win-result').innerHTML = `You solved the puzzle in ${time}!`

    displayMessage('.win');

    saveTime(startTime, time);
  }

  exitPopup('.win');

}


//Board Setup:


function fetchCharacters() {

  //get property names of answer object. Remove 'words' property.
  let properties = Object.keys(answer);

  //remove the last answer object property, 'words'.
  properties.pop();

  //get value for each propety, store in characters array
  let characters = [];
  for (let i = 0; i < properties.length; i++) {
    characters.push(answer[properties[i]].toUpperCase());
  }

  return characters

}


function randomizeCharacters(characters) {

  for (let i = characters.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * i);

    let holder = characters[i];
    characters[i] = characters[randomIndex];
    characters[randomIndex] = holder;
  }

  return characters;

}


function populateTiles(characters) {

  let tiles = document.querySelectorAll('.tile');

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].innerHTML = characters[i];
  }
  
}


function setupKeyboardEvents(startTime) {

  document.addEventListener('keydown', (e) => {
    keyboardHandler(e, startTime);
  });

}


function createBoard() {

  const startTime = new Date();

  let characters = fetchCharacters();
  let shuffledCharacters = randomizeCharacters(characters);

  populateTiles(shuffledCharacters);

  colorTiles();

  setupKeyboardEvents(startTime);

}


//Page Setup:


function displayMessage(popup) {

  document.querySelector(popup).classList.add('visible');

}


function exitPopup(popup) {

  //click x
  document.querySelector(`${popup} .exit`).addEventListener('click', function() {
    document.querySelector(popup).classList.remove('visible');
  }, {once : true});

  //press esc
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') {
      document.querySelector(popup).classList.remove('visible');
    }
  }, {once : true});

}


function modeToggle() {

  let body = document.querySelector('body');
  body.classList.toggle('dark');
  body.classList.toggle('light');

}


function undo() {

  let lastMove = playerHistory.pop();

  let undo = {
    key: null,
    undo: true
  }

  //reverse last move, up is down, left is right. store in undo.key.
  switch (lastMove) {
    case 'w':
      undo.key = 's';
      break;
    case 'a':
      undo.key = 'd';
      break;
    case 's':
      undo.key = 'w';
      break;
    case 'd':
      undo.key = 'a';
      break;
    case 'ArrowUp':
      undo.key = 'ArrowDown';
      break;
    case 'ArrowLeft':
      undo.key = 'ArrowRight';
      break;
    case 'ArrowDown':
      undo.key = 'ArrowUp';
      break;
    case 'ArrowRight':
      undo.key = 'ArrowLeft';
      break;
    default:
      break;
  }

  keyboardHandler(undo);

}

function leaderboardToggle() {

  displayMessage('.leaderboard');

  exitPopup('.leaderboard');

}

function howToPlayToggle() {

  displayMessage('.info');

  exitPopup('.info');

}


function createPage() {

  //fetch menu icons
  let ldToggle = document.querySelector('[data-menu-opt="light-dark-toggle"]');
  let undoEl = document.querySelector('[data-menu-opt="undo-move"]');
  let leaderboard = document.querySelector('[data-menu-opt="leaderboard"]');
  let howToPlay = document.querySelector('[data-menu-opt="how-to-play"]');

  //attach click events
  ldToggle.addEventListener('click', modeToggle);
  undoEl.addEventListener('click', undo);
  leaderboard.addEventListener('click', leaderboardToggle);
  howToPlay.addEventListener('click', howToPlayToggle);

  //If user's first visit, display howToPlay automatically
  if (!localStorage.firstVisit) {
    howToPlayToggle();
    localStorage.firstVisit = "1"; //will return false on next visit
  }

}


function run() {

  createPage();
  createBoard();

}


run();



//TODO: enable click and drag for sliding tiles.

//TODO: enable history saving and undo for click and drag feature

//TODO: animation for click and drag

//TODO: can have two popup windows open at the same time

//TODO: can move the tiles with keyboard inputs when popup is open.




//TODO: how to save anwser boards, and save random setup so all users get same starting baord?

//TODO: share score.

//TODO: Setup leaderboard / graph. percent of player x time to solve. as 10 bars. With users personal time (if one) marked too.

//TODO: program that generates boards.
