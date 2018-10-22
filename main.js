
// add/check classes in HTML
var saveButton = document.querySelector('.js-save-button');
var deleteDiv = document.querySelector('.js-delete-div');

var ideaInputs = document.querySelectorAll(".js-idea-inputs");

saveButton.addEventListener('click', createNewIdea);
deleteButton.addEventListener('click', deleteIdea(event));

function createNewIdea() {
  var idea = new Idea(document.querySelector('.js-title'), document.querySelector('.js-body'));
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
  var cardHTML = `
  <div>
    <h2>${idea.title}</h2>
    <p>${idea.body}</p>
    <div>
      <img src="icons/downvote.svg">
      <img src="icons/upvote.svg">
      <p>Quality: <span>${idea.quality}</span></p>
      <img src="icons/delete.svg">
    </div>
  </div>`;
  var newCard = document.querySelector('.js-card-section');
  newCard.insertAdjacentHTML = ('afterbegin', cardHTML);
}

function deleteIdea(event) {
  if (event.target.classList.contains('js-delete-button')) {
    deleteCard(event);
    // find exact idea to delete and delete it in storage.
  }
}

function deleteCard(event) {
  event.target.closest('.js-idea-card').remove();
}
