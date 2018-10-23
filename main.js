
var saveButton = document.querySelector('.js-save-button');
var ideaInputs = document.querySelectorAll(".js-idea-inputs");
var cardSection = document.querySelector('.js-card-section');

var ideaArray = [];

window.addEventListener('load', createCardsOnReload);

saveButton.addEventListener('click', createNewIdea);
cardSection.addEventListener('click', function(event){
  if (event.target.classList.contains('js-delete-button')) {
    deleteCard(event);
  }
});

ideaInputs[0].addEventListener('input', enableSaveButton);
// Add error message if no body?

function createNewIdea() {
  var idea = new Idea(ideaInputs[0].value, ideaInputs[1].value);
  ideaArray.push(idea);
  console.log(ideaArray);
  idea.saveToStorage();
  createCard(idea);
  clearInputs();
};

function clearInputs() {
  for (var i = 0; i < ideaInputs.length; i++) {
    ideaInputs[i].value = '';
  };
// Use input type button and add disabled in HTML
  disableSaveButton();
}

function createCardsOnReload(){
  for(var key in localStorage) {
    if(localStorage.hasOwnProperty(key)) {
      var card = localStorage.getItem(key);
      var parsedCard = JSON.parse(card);
      createCard(parsedCard);
    }
  }
}

function createCard(idea) {
  var cardHTML = `<div class="idea-box js-idea-card" data-id=${idea.id}>
    <h2>${idea.title}</h2>
    <p>${idea.body}</p>
    <div class="idea-box-bottom">
      <img class="arrows" src="icons/downvote.svg">
      <img class="arrows" src="icons/upvote.svg">
      <p class="quality">Quality: <span>${idea.quality}</span></p>
      <img class="delete js-delete-button" src="icons/delete.svg">
    </div>
  </div>`;
  cardSection.insertAdjacentHTML('afterbegin', cardHTML);
}

function findIndexNumber(objId) {
  for (var i = 0; i < ideaArray.length; i++) {
    if (ideaArray[i].id === objId) {
      return i
    }
  }
}

function deleteCard(event) {
  
  var cardId = event.target.parentElement.parentElement.dataset.id;
  
  var index = findIndexNumber(cardId);
  ideaArray[index].deleteFromStorage();
  ideaArray.splice(index, 1);

  event.target.closest('.js-idea-card').remove();
  // localStorage.removeItem(cardId);

}

function disableSaveButton() {
  saveButton.disabled = true;
}

function enableSaveButton() {
  saveButton.disabled = false;
}

