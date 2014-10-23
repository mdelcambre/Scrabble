/*
 * Implements the board class for use in the scrabble solver
 *
 *
 *
 */

var transpose = require('math.js').transpose;


module.exports = function (json_board) {
  this.tiles = json_board;
  this.flipped = false;


  // The alogrithm is written to only solves horizontal, instead of having it
  // handle vertical, we simple transpose the board and run again.
  this.flip = function () {
      flipped = !flipped;
      tiles = transpose(letters);
      return flipped;
  }


  // Used to get the current tile at a given spot on the board
  // Also checks if the pos is out of bounds
  this.GetChar = function (r,c,pos) {
    if (ValidLoc(r,c,pos) === 'IB') {
      return board[r][c+pos];
    }
    return 'OOB';
  }//GetChar


  this.GetUp = funciton (r,c,pos) {
    //returns the word above
  }

  this.GetDown = function (r,c,pos){
    //returs the word below
  }


  this.GetAnchor = function (r) {
    if (ValidLoc(r,0,0) === 'OOB'){
      return 'OOB';
    }
    var anchors = [];
    // itterate through the row, to check if it is an anchor location
    for (c=0; c < board[r].length; c++) {

      // Get each tile space in a + shape.
      var spot = GetChar(r,c,0);
      var up = GetChar(r-1,c,0);
      var down = GetChar(r+1,c,0);
      var back = GetChar(r,c-1,0);
      var oneFwd = GetChar(r,c+1,0);

      // Can't be an anchor location if it isn't blank
      // however, the algorithm below will miss one anchor type when the
      // last tile in a row has been placed.
      if (spot !== '' && oneFwd !== 'OOB') {
        continue; // Not an anchor location
      } else if ( spot != '' && oneFwd === 'OOB') {
        // We know the last row spot has been placed, so go backwards till we
        // find the first blank. That is an anchor spot as well.
        for (gb = board[r].length-1; gb >= 0; gb--){
          if (GetChar(r,gb,0) === ''){
            anchors.push(gb);
            break;
          }
        } // gb forloop
        continue; //We have already solved this spot.
      } // else if

      // Check if there is a tile in the up, back, or down locations.
      var charAdj = (!(up === 'OOB' || up === '') ||
                     !(down === 'OOB' || down === '') ||
                     !(back === 'OOB' || back === ''));
      // Check that there is not a letter forward
      var noFwd = (oneFwd === 'OOB' || oneFwd === '')
      if (charAdj && noFwd){
        anchors.push(c);
      }
    }//for loop going through row forward
    return anchors;
  }//GetAnchor

  // Checks if the passed in anchor and position is valid
  this.ValidLoc = function (r, c, pos) {
    var invalid = (r < 0 || r >= board.length) ||
                  (c+pos < 0 || c+pos >= board[r].length);
    if (invalid) {
      return 'OOB';
    } else {
      return 'IB';
    }

  }//ValidLoc

}
