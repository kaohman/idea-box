var cardSection = document.querySelector('.js-card-section');
var ideaArray = [];
var ideaInputs = document.querySelectorAll('.js-idea-inputs');
var numberCount = document.querySelectorAll(".character-count");
var numCounter = 10;
var saveButton = document.querySelector('.js-save-button');

window.addEventListener('load', createCardsOnReload);
saveButton.addEventListener('click', createNewIdea);

cardSection.addEventListener('dblclick', updateCard);
cardSection.addEventListener('click', function(event) {
  if (event.target.classList.contains('js-delete-button')) {
    deleteCard(event);
  } else if (event.target.classList.contains('js-up-vote')) {
    vote(event, 'up');
  } else if (event.target.classList.contains('js-down-vote')) {
    vote(event, 'down');
  }
});

ideaInputs.forEach((idea, i) => {
  idea.addEventListener('input', function(event) {
    if((ideaInputs[0].value.length > 0) && (ideaInputs[1].value.length > 0)) {
      enableButton(saveButton);
    } else {
      disableButton(saveButton);
    };
  });

  idea.addEventListener('keyup', function(event) {
    countCharacters(this, i);
  });
});


// Dylan working on these event listeners

document.querySelector('.filter-by-quality').addEventListener('click', event => {
  if (event.target.classList.contains('js-filter-by-quality-buttons')) {
    filterByQuality(event.target.innerText)
  };
});

document.querySelector(".js-reset").addEventListener('click', resetFilters);

document.querySelector(".search-input").addEventListener("keyup", liveSearch);

function liveSearch() {
  var searchinput = this.value;
  var searchTextDiv = document.querySelectorAll('.js-search');
  searchTextDiv.forEach(input => {
    if (input.innerText.indexOf(searchinput) != -1) { 
      input.parentElement.style.display = 'block';
    } else if (input.innerText.indexOf(searchinput) <= -1) {
      input.parentElement.style.display = 'none';
    }
  })   
};

document.querySelector('.js-show-more-button').addEventListener('click', calculateNumberShownUp);
document.querySelector('.js-show-less-button').addEventListener('click', calculateNumberShownDown);
document.querySelector('.js-show-all-button').addEventListener('click', calculateNumberShownAll);

function calculateNumberShownAll() {
  numCounter = ideaArray.length;
  updateShownArray();
  disableButton(document.querySelector('.js-show-all-button'));
  disableButton(document.querySelector('.js-show-more-button'));
  enableButton(document.querySelector('.js-show-less-button'));
};

function calculateNumberShownDown() {
  numCounter = 10;
  updateShownArray();
  disableButton(document.querySelector('.js-show-less-button'));
  enableButton(document.querySelector('.js-show-all-button'));
  enableButton(document.querySelector('.js-show-more-button'));
};

function calculateNumberShownUp() {
  numCounter += 10;
  updateShownArray();
  if (numCounter > ideaArray.length) {
    disableButton(document.querySelector('.js-show-all-button'));
    disableButton(document.querySelector('.js-show-more-button'));
  }
  enableButton(document.querySelector('.js-show-less-button'));
}; 

function clearInputs() {
  ideaInputs.forEach(function(idea) {
    idea.value = '';
  });
  disableButton(saveButton);
};

function countCharacters(input, index) {
  var maxLength = 120;
  if (input.value.length > maxLength) {
    input.value = input.value.substring(0, maxLength);
    alert('Text is too long!');
  }
  numberCount[index].innerText = input.value.length;
};

function createCard(idea) {
  var cardHTML = `<div class='idea-box js-idea-card' data-id=${idea.id}>
    <div class='js-search'>
      <h2 class='js-text js-title-text' contenteditable='false'>${idea.title}</h2>
      <p class='js-text js-body-text' contenteditable='false'>${idea.body}</p>
    </div>
    <div class='idea-box-bottom'>
      <img class='arrows js-down-vote' src='icons/downvote.svg'>
      <img class='arrows js-up-vote' src='icons/upvote.svg'>
      <p class='quality'>Quality: <span class='js-quality'>${idea.quality}</span></p>
      <img class='delete js-delete-button' src='icons/delete.svg'>
    </div>
  </div>`;
  cardSection.insertAdjacentHTML('afterbegin', cardHTML);
};

function createCardsOnReload() {
  for(var key in localStorage) {
    if(localStorage.hasOwnProperty(key)) {
      var parsedCard = JSON.parse(localStorage.getItem(key));
      var idea = new Idea(parsedCard.title, parsedCard.body, parsedCard.quality, parsedCard.id);
      ideaArray.push(idea);
      createCard(parsedCard);
    }
  }
  ideaArray.reverse();
  updateShownArray();
  setShowButtons();
};

function createNewIdea() {
  var idea = new Idea(ideaInputs[0].value, ideaInputs[1].value);
  ideaArray.push(idea);
  idea.saveToStorage();
  createCard(idea);
  clearInputs();
  setShowButtons();
};

function deleteCard(event) {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  ideaArray[index].deleteFromStorage();
  ideaArray.splice(index, 1);
  event.target.closest('.js-idea-card').remove();
  setShowButtons(); 
};


function disableButton(button) {
  button.disabled = true;
};

function editText() {
  event.target.contentEditable = true;
};

function enableButton(button) {
  button.disabled = false;
};

function filterByQuality(quality) {
  var qualityType = document.querySelectorAll('.js-quality');
  // REFACTOR FOR LOOP
  for (i=0; i < qualityType.length; i++) {
    if (qualityType[i].innerText.indexOf(quality) != -1) { 
      qualityType[i].parentElement.parentElement.parentElement.style.display = 'block';
    } else if (qualityType[i].innerText.indexOf(quality) <= -1) {
      qualityType[i].parentElement.parentElement.parentElement.style.display = 'none';
    }
  }
  disableShowButtons();
};

function findIndexNumber(objId) {
  for (var i = 0; i < ideaArray.length; i++) {
    if (ideaArray[i].id === objId) {
      return i
    }
  }
};

function resetFilters() {
  var cards = document.querySelectorAll('.js-idea-card');

  var cardsArray = Array.from(cards);
  var cardsToShowOnReset = cardsArray.filter((card, i) => {
    return i < 10;
  }); 
  cardsToShowOnReset.forEach(card => {
    card.style.display = 'block';
  });
  setShowButtons();
};

function saveTextOnClick(event) {
  updateIdea();    
  setUneditable(); 
  document.body.removeEventListener('keypress', saveTextOnEnter);
  event.target.removeEventListener('blur', saveTextOnClick);
};

function saveTextOnEnter(event) {
  if (event.code === 'Enter') {
    updateIdea();    
    setUneditable(); 
    document.body.removeEventListener('keypress', saveTextOnEnter);
    event.target.removeEventListener('blur', saveTextOnClick);
  }
}; 

function setShowButtons() {
  if (ideaArray.length > 10) {
    enableButton(document.querySelector('.js-show-more-button'));
    enableButton(document.querySelector('.js-show-all-button'));
  } else {
    disableShowButtons();
  }
};

function disableShowButtons() {
  var buttons = document.querySelectorAll('.show-buttons');
  buttons.forEach(button => {
    disableButton(button);
  });
};

function setUneditable() {
  event.target.contentEditable = false;
};

function updateCard(event) {
  if (event.target.classList.contains('js-text')) {
    editText();
    document.body.addEventListener('keypress', saveTextOnEnter);
    event.target.addEventListener('blur', saveTextOnClick);
  }
};

function updateIdea() {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  if (event.target.classList.contains('js-title-text')) {
    ideaArray[index].updateSelf(event.target.innerText, 'title');
  } else {
    ideaArray[index].updateSelf(event.target.innerText, 'body');
  };

  ideaArray[index].saveToStorage();
};

function updateShownArray() {
  var cardsArray = Array.from(document.querySelectorAll('.js-idea-card'));
  cardsArray.forEach(function(card, index) {
    if(index < numCounter) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

function vote(event, votebutton) {
  var index = findIndexNumber(event.target.parentElement.parentElement.dataset.id);
  if (votebutton === 'up') {
    ideaArray[index].updateQuality('up');
    event.target.nextElementSibling.firstElementChild.innerText = ideaArray[index].quality;
  } else if (votebutton === 'down') {
    ideaArray[index].updateQuality('down');
    event.target.nextElementSibling.nextElementSibling.firstElementChild.innerText = ideaArray[index].quality;
  }

  ideaArray[index].saveToStorage();
  ideaArray.splice(index, 1, ideaArray[index]);
};















