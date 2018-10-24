class Idea {
  constructor(title, body, quality, id) {
    this.id = id || "id" + Date.now();
    this.title = title;
    this.body = body;
    this.quality = quality || 'Swill';
  }

  saveToStorage() {
    var ideaStr = JSON.stringify(this);
    localStorage.setItem(this.id, ideaStr);
  }

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  }

  updateSelf(newText, type) {
    if (type === 'title') {
      this.title = newText;
    } else if (type === 'body') {
      this.body = newText;
    }
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