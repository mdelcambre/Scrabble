/*
 * Implements the board class for use in the scrabble solver
 *
 *
 *
 */

var transpose = require('math').transpose;


module.exports = function (json_board) {
  this.board = json_board;




  // Used to get the current tile at a given spot on the board
  this.GetChar = function (r,c,pos) {

    if (this.ValidLoc(r,c,pos) === 'OOB') {
      return this.board[r][c+pos];
    }
    return 'OOB';
  }//GetChar


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
