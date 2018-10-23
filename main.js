
// add/check classes in HTML
var saveButton = document.querySelector('.js-save-button');
var ideaInputs = document.querySelectorAll(".js-idea-inputs");
var deleteButton;

saveButton.addEventListener('click', createNewIdea);
// deleteButton.addEventListener('click', deleteIdea(event));

ideaInputs[0].addEventListener('input', enableButton(saveButton));

function createNewIdea() {
  var idea = new Idea(ideaInputs[0].value, ideaInputs[1].value);
  idea.saveToStorage();
  createCard(idea);
  clearInputs();
};

function clearInputs() {
  for (var i = 0; i < ideaInputs.length; i++) {
    ideaInputs[i].value = '';
  };
// Use input type button and add disabled in HTML
  saveButton.disabled = true;
}

function createCard(idea) {
  var cardHTML = `<div class="idea-box js-idea-card">
    <h2>${idea.title}</h2>
    <p>${idea.body}</p>
    <div class="idea-box-bottom">
      <img class="arrows" src="icons/downvote.svg">
      <img class="arrows" src="icons/upvote.svg">
      <p class="quality">Quality: <span>${idea.quality}</span></p>
      <img class="delete" src="icons/delete.svg">
    </div>
  </div>`;
  var newCard = document.querySelector('.js-card-section');
  newCard.insertAdjacentHTML('afterbegin', cardHTML);
}

function deleteIdea(event) {
  if (event.target.classList.contains('js-delete-button')) {
    deleteCard(event);
    // find exact idea to delete and delete it in storage.
  }
}

function deleteCard(event) {
  var deleteDiv = document.querySelector('.js-idea-card');
  event.target.closest('.js-idea-card').remove();
}

function enableButton(button) {
  button.disabled = false;
}
