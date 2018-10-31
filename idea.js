class Idea {
  constructor(title, body, quality, id) {
    this.id = id || 'id' + Date.now();
    this.title = title;
    this.body = body;
    this.quality = quality || 0;
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

  updateQuality(vote, arrayLength) {
    if((vote === 'up') && (this.quality < arrayLength-1)) {
      this.quality++;
    } else if((vote === 'down') && (this.quality > 0)) {
      this.quality--;
    }
  }
}
