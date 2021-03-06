/*
 * Implements the board class for use in the scrabble solver
 *
 *
 *
 */

var transpose = require('mathjs').transpose;
var b_value = [[1, 1, 1, '3', 1, 1, 3, 1, 3, 1, 1, '3', 1, 1, 1],
             [1, 1, 2, 1, 1, '2', 1, 1, 1, '2', 1, 1, 2, 1, 1],
             [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
             ['3', 1, 1, 3, 1, 1, 1, '2', 1, 1, 1, 3, 1, 1, '3'],
             [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
             [1, '2', 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, '2', 1],
             [3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3],
             [1, 1, 1, '2', 1, 1, 1, 1, 1, 1, 1,'2', 1, 1, 1],
             [3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3],
             [1, '2', 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, '2', 1],
             [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
             ['3', 1, 1, 3, 1, 1, 1, '2', 1, 1, 1, 3, 1, 1, '3'],
             [1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1],
             [1, 1, 2, 1, 1, '2', 1, 1, 1, '2', 1, 1, 2, 1, 1],
             [1, 1, 1, '3', 1, 1, 3, 1, 3, 1, 1, '3', 1, 1, 1]];
var t_value = {' ':0,
                A:1,
                B:4,
                C:4,
                D:2,
                E:1,
                F:4,
                G:3,
                H:3,
                I:1,
                J:10,
                K:5,
                L:2,
                M:4,
                N:2,
                O:1,
                P:4,
                Q:10,
                R:1,
                S:1,
                T:1,
                U:2,
                V:5,
                W:4,
                X:8,
                Y:3,
                Z:10};

module.exports = function (json_board) {
  this.tiles = json_board;
  this.flipped = false;
  this.ltr_value = t_value;

  // This function returns the cross value of placing a letter at a given location
  this.GetValue = function (r,c,pos,letter) {
    // Check if the location is valid
    if (!this.ValidLoc(r,c,pos)) {
      return 'OOB';
    }

    // Should be upper case for key. Might as well check.
    letter = letter.toUpperCase();

    // generate an array of letter above and below
    var cross = this.GetUp(r,c,pos)).split('')
                .concat(this.GetDown(r,c,pos).split(''));
                .push(letter)
    // calculate the value of the cross characters using the lookup dict defined above
    var value = cross.reduce(function(prev,cur){
      return prev + t_value[cur];
    }

    // get the multiplier from the letter placement
    var space = b_value[r][c+pos];

    // Check if word multiplier or just letter multiplier
    // We store word multipliers as ints 
    if (typeof space === 'string'){
      value = value*parseInt(space);
    }
    return value+;
  } // XValue
  this.WordMult = function (r,c,pos){
    // Check if the location is valid
    if (!this.ValidLoc(r,c,pos)) {
      return 'OOB';
    }

    var space = b_value[r][c+pos]; 
    if (typeof space === 'string'){
      return parseInt(space)-1;
    }
    return 0;
  }

  // The alogrithm is written to only solves horizontal, instead of having it
  // handle vertical, we simple transpose the board and run again.
  this.flip = function () {
      this.flipped = !this.flipped;
      this.tiles = transpose(this.tiles);
      return this.flipped;
  }


  // Used to get the current tile at a given spot on the board
  // Also checks if the pos is out of bounds
  this.GetChar = function (r,c,pos) {
    if (this.ValidLoc(r,c,pos)) {
      return this.tiles[r][c+pos];
    }
    return 'OOB';
  }//GetChar


  // returns the complete word up from the given position
  this.GetUp = function (r,c,pos) {
    var word = '';
    var up = this.GetChar(r-1, c, pos);
    var noTile = (up === 'OOB' || up === '');
    if (noTile) {
      return '';
    }
    return this.GetUp(r-1, c, pos) + up;
  }


  // returns the complete word down from the given position
  this.GetDown = function (r,c,pos){
    var down = this.GetChar(r+1, c, pos);
    var noTile = (down === 'OOB' || down === '');
    if (noTile) {
      return '';
    }
    return down + this.GetDown(r+1, c, pos);
  }

  // This furnction returns a list anchor locations for a given row.
  // Anchor locations are defined by a free space in the current squar and
  // one to the right. Then need at least one tile up, left, or down.
  this.GetAnchor = function (r) {
    if (!this.ValidLoc(r,0,0)){
      return 'OOB';
    }
    var anchors = [];
    // itterate through the row, to check if it is an anchor location
    for (c=0; c < this.tiles[r].length; c++) {

      // Get each tile space in a + shape.
      var spot = this.GetChar(r,c,0);
      var up = this.GetChar(r-1,c,0);
      var down = this.GetChar(r+1,c,0);
      var back = this.GetChar(r,c-1,0);
      var oneFwd = this.GetChar(r,c+1,0);

      // Can't be an anchor location if it isn't blank
      // however, the algorithm below will miss one anchor type when the
      // last tile in a row has been placed.
      if (spot !== '' && oneFwd !== 'OOB') {
        continue; // Not an anchor location
      } else if ( spot != '' && oneFwd === 'OOB') {
        // We know the last row spot has been placed, so go backwards till we
        // find the first blank. That is an anchor spot as well.
        for (gb = this.tiles[r].length-1; gb >= 0; gb--){
          if (this.GetChar(r,gb,0) === ''){
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
        c++;
      }
    }//for loop going through row forward
    return anchors;
  }//GetAnchor

  // Checks if the passed in anchor and position is valid
  this.ValidLoc = function (r, c, pos) {
    var invalid = (r < 0 || r >= this.tiles.length) ||
                  (c+pos < 0 || c+pos >= this.tiles[r].length);
    return !invalid;
  }//ValidLoc

}
