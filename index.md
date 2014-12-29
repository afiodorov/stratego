# GUI

classes:
* Board - represent a board
* Tile - represent each tile on the board
* Piece - represent an individual enemy or friendly piece
* GameManager - holds states and manages all elements of the interface
* Card - represent a battle card
* Hand - holds cards
* PlayingArea - during battle player puts a card here, at the start all pieces are here
* Button - represents a button
* Interface - holds board, hand and all buttons (such as undo or end turn)

## Board
.show() - displays the board

## Tile
.highlight() - highlights the tile as a visual aid
.addPiece(piece)  - adds a piece to the tile
.removePiece(piece) - removes a piece from the tile

## Piece
.desc - describes the piece for visual aid
.name - name of the piece for display from the rules

## GameManager
.setState(state) - sets the state of the game
.accentuate() - makes board and pieces visible if not shown, refreshes otherwise

## Card
.desc - describes a card
.name - name for the card as in the rules

## Hand
.show() - displays the hand
.addCard(card)
.removeCard(card)

## CardArea
.show() - displayes the area
.hide() - hides the area
.addCard(card)
.addPiece(piece)
.empty() - empties the area

## Button
.show()
.hide()

Instances:
    * Submit
    * Cancel

# Interface
just a layer with all the GUI elements, not sure about methods yet

# JSONs

## stage: start

{stage: "start", side: dark | light}

nothing to be communicated really

## stage: movePiece

{stage: "removePiece",
pieces: [{name: "Gandalf", position: [0,0], prevPositon: [0,0]}],
cards: [{name: "6"}, {name: "7"}]
}

## stage: battle

{stage: "battle",
pieces: [{name: "Gandalf", position: [0,0], prevPositon: [0,0]}],
cards: [{name: "6"}, {name: "7"}]
}

(previous position for animations)
