class Flashcard {
  constructor(front, back) {
    this.front = front;
    this.back = back
  }
}

const app = new Vue({
  el: "#app",
  data() {
    return {
      homeShow: true,
      playShow: false,
      createShow: false,
      addShow: false,
      deckLength: null,
      cardCount: 0,
      cardFlipped: false,
      newDeck: []
    }
  },
  methods: {
    importDeck(e) {
      var jsonFile = e.target.files[0]
      var reader = new FileReader()
      reader.onload = (e) => {
        let contents = e.target.result
        let deck = JSON.parse(contents)
        this.deckLength = deck.length
        let [...shuffledDeck] = shuffle(deck)
        displayCard(shuffledDeck[0])

        let j = 0;
        $(document).on('keydown', (e) => {
          switch(e.keyCode) {
            case 32:
              this.cardFlipped = !this.cardFlipped
              break
            case 70:
              j = (this.cardCount == 0) ? this.cardCount : this.cardCount - 1
              this.cardFlipped = false
              break
            case 74:
              j = (this.cardCount == shuffledDeck.length - 1) ? this.cardCount : this.cardCount + 1
              this.cardFlipped = false
          }

          if (this.cardCount !== j) {
            let activeCard = shuffledDeck[j];
            displayCard(activeCard)
          }

          this.cardCount = j
        })
      }
      
      reader.readAsText(jsonFile)
      $("#file-select").val("")
      this.homeShow = false
      this.playShow = true
    },

    backFromPlay() {
      this.homeShow = true
      this.playShow = false
      this.cardFlipped = false
      this.cardCount = 0
    },

    makeFlashcard() {
      if (!this.createShow) this.createShow = true;
      let front = $("#new-card-front").val()
      let back = $("#new-card-back").val()
      let card = new Flashcard(front, back)
      this.newDeck.push(card)
      let html = `<div class="flashcard created-card">${front} / ${back}</div>`
      $(".created-cards-container").append(html)
      $(".created-cards-container").scrollLeft(9000)
      $("#new-card-back").val("")
      $("#new-card-front").val("").focus()
    },

    exportDeck() {
      let title = $("#new-deck-title").val(), name = `${title}.json`
      let blob = new Blob([JSON.stringify(this.newDeck)], { type : 'application/json' })
      saveAs(blob, name)
    },

    addToDeck(e) {
      var jsonFile = e.target.files[0]
      var reader = new FileReader()
      reader.onload = (e) => {
        let contents = e.target.result
        let deck = JSON.parse(contents)
      }
      
      reader.readAsText(jsonFile)
      $("#add-deck-select").val("")
    }

  }
})

function displayCard(activeCard) {
  $("#flashcard-front").text(`${activeCard.front}`)
  $("#flashcard-back").text(`${activeCard.back}`)
}

function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}