class Idea {
  constructor(title, body) {
    this.id = "id" + Date.now();
    this.title = title;
    this.body = body;
    this.quality = //quality// || 'Swill';
  }

  saveToStorage() {
    var ideaStr = JSON.stringify(this);
    localStorage.setItem(this.id, ideaStr);
  }

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  }

  updateSelf() {

  }

  updateQuality(vote) {
    if(vote === 'up') {
      if(this.quality === 'Plausible') {
        this.quality = 'Genius';
      } else if (this.quality === 'Swill') {
        this.quality = 'Plausible';
      }
    } else {
      if(this.quality === 'Genius') {
        this.quality = 'Plausible';
      } else if (this.quality === 'Plausible') {
        this.quality = 'Swill';
      }
    }
  }

}



// npm test idea-test.js