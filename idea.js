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
    var qualityArray = ['Swill', 'Plausible', 'Genius', 'Unicorn'];
    var i = qualityArray.indexOf(this.quality);
    console.log(i);

    if(vote === 'up') {
      console.log('hooray!')
      if (i < qualityArray.length-1){
        i++;
        this.quality = qualityArray[i];
        console.log(this.quality, 'this is the new quality')
      }
    } else if(vote === 'down'){
      if (i > 0){
        i--;
        this.quality = qualityArray[i];
      }
    }

  }

}



// npm test idea-test.js