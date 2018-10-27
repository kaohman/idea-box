
var saveButton = document.querySelector('.js-save-button');
var ideaInputs = document.querySelectorAll('.js-idea-inputs');
var cardSection = document.querySelector('.js-card-section');
var ideaArray = [];

window.addEventListener('load', createCardsOnReload);
saveButton.addEventListener('click', createNewIdea);
cardSection.addEventListener('click', function(event){
  if (event.target.classList.contains('js-delete-button')) {
    deleteCard(event);
  }
});

// Add submit button disabled based on character count
ideaInputs[0].addEventListener('input', function(event) {
  enableButton(saveButton);
});

function clearInputs() {
  // REFACTOR FOR LOOP
  for (var i = 0; i < ideaInputs.length; i++) {
    ideaInputs[i].value = '';
  };
  disableButton(saveButton);
}

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
}

function createCardsOnReload(){
  for(var key in localStorage) {
    if(localStorage.hasOwnProperty(key)) {
      var card = localStorage.getItem(key);
      var parsedCard = JSON.parse(card);

      var idea = new Idea(parsedCard.title, parsedCard.body, parsedCard.quality, parsedCard.id);
      ideaArray.push(idea);

      createCard(parsedCard);
    }
  }
}

function createNewIdea() {
  var idea = new Idea(ideaInputs[0].value, ideaInputs[1].value);
  ideaArray.push(idea);
  idea.saveToStorage();
  createCard(idea);
  clearInputs();
}

function deleteCard(event) {
  var cardId = event.target.parentElement.parentElement.dataset.id;
  
  var index = findIndexNumber(cardId);
  ideaArray[index].deleteFromStorage();
  ideaArray.splice(index, 1);

  event.target.closest('.js-idea-card').remove();
}

function disableButton(button) {
  button.disabled = true;
}

function enableButton(button) {
  button.disabled = false;
}

function findIndexNumber(objId) {
  // REFACTOR FOR LOOP
  for (var i = 0; i < ideaArray.length; i++) {
    if (ideaArray[i].id === objId) {
      return i
    }
  }
}

/* card edit function */
cardSection.addEventListener('dblclick', updateCard);

function updateCard(event) {
  if (event.target.classList.contains('js-text')) {
    editText();
    document.body.addEventListener('keypress', saveTextOnEnter);
    event.target.addEventListener('blur', saveTextOnClick);
  }
}

function editText() {
    event.target.contentEditable = true;
}

function saveTextOnEnter(event) {
  if (event.code === 'Enter') {
    updateIdea();    
    setUneditable(); 
    document.body.removeEventListener('keypress', saveTextOnEnter);
    event.target.removeEventListener('blur', saveTextOnClick);
  }
}; 

function saveTextOnClick(event) {
  updateIdea();    
  setUneditable(); 
  document.body.removeEventListener('keypress', saveTextOnEnter);
  event.target.removeEventListener('blur', saveTextOnClick);
};

function setUneditable() {
  event.target.contentEditable = false;
}

function updateIdea() {
  var cardId = event.target.parentElement.parentElement.dataset.id;
  var index = findIndexNumber(cardId);
  if (event.target.classList.contains('js-title-text')) {
    var newTitle = event.target.innerText;
    ideaArray[index].updateSelf(newTitle, 'title');
  } else if (event.target.classList.contains('js-body-text')) {
    var newBody = event.target.innerText; 
    ideaArray[index].updateSelf(newBody, 'body');
  };

  ideaArray[index].saveToStorage();
}


/* live search function */
var search = document.querySelector('.search-input');

search.addEventListener('keyup', function() {
var searchinput = this.value;
var seachTextDiv = document.querySelectorAll('.js-search');
  for (i=0; i < seachTextDiv.length; i++) {
  if (seachTextDiv[i].innerText.indexOf(searchinput) != -1) { 
    seachTextDiv[i].parentElement.style.display = 'block';
  }else if (seachTextDiv[i].innerText.indexOf(searchinput) <= -1) {
    seachTextDiv[i].parentElement.style.display = 'none';
  }
}
});


// filter by quality
var swillButton = document.querySelector('.js-swill');
var plausibleButton = document.querySelector('.js-plausible');
var geniusButton = document.querySelector('.js-genius');
var unicornButton = document.querySelector('.js-unicorn');
var resetButton = document.querySelector('.js-reset');

swillButton.addEventListener('click', function(){
  filterByQuality('Swill');
});
plausibleButton.addEventListener('click', function(){
  filterByQuality('Plausible');
});
geniusButton.addEventListener('click', function(){
  filterByQuality('Genius');
});
unicornButton.addEventListener('click', function(){
  filterByQuality('Unicorn');
});
resetButton.addEventListener('click', resetFilters);

function filterByQuality(quality) {
  var qualityType = document.querySelectorAll('.js-quality');
  // REFACTOR FOR LOOP
  for (i=0; i < qualityType.length; i++) {
  if (qualityType[i].innerText.indexOf(quality) != -1) { 
    qualityType[i].parentElement.parentElement.parentElement.style.display = 'block';
  }else if (qualityType[i].innerText.indexOf(quality) <= -1) {
    qualityType[i].parentElement.parentElement.parentElement.style.display = 'none';
  }
}
}

function resetFilters() {
  var cards = document.querySelectorAll('.js-idea-card');
  for(var i = 0; i < cards.length; i++) {
    cards[i].style.display = 'block';
  }
}


// quality up/down votes//
cardSection.addEventListener('click', function(){
  var votebutton;
  if (event.target.classList.contains('js-up-vote')) {
    votebutton = 'up';
    vote(event, votebutton);
  } else if (event.target.classList.contains('js-down-vote')) {
    votebutton = 'down'
    vote(event, votebutton);
  }
});

function vote(event, votebutton) {
  var cardId = event.target.parentElement.parentElement.dataset.id;
  var index = findIndexNumber(cardId);
  if (votebutton === 'up') {
    ideaArray[index].updateQuality('up');
    event.target.nextElementSibling.firstElementChild.innerText = ideaArray[index].quality;
  } else if (votebutton === 'down') {
    ideaArray[index].updateQuality('down');
    event.target.nextElementSibling.nextElementSibling.firstElementChild.innerText = ideaArray[index].quality;
  }

  ideaArray[index].saveToStorage();
  ideaArray.splice(index, 1, ideaArray[index]);
}


