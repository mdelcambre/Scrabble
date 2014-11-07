/*
 * Implements the scrabble algorithm proposed by Seven Gordon
 * GADDAG package available through npm
 *
 * This will eventially by the 'solver' module.
 *
 *
 */


// Import the requiled libraries
var gaddag = require('gaddag'); // Data structure to speed up searches
var _ = require('underscore'); // Used for the intersection of two arrays

// Initiallize the gaddag class
var gd = new gaddag;
var dict_file = "words.txt";




// Function load_first
// used simply to call the loading of the library.
// called after the functions have been defined.
function load_first(){
  gd.load(dict_file,main);
}


// function NextArc
// helper function to handle moving through the GADDAG structure
//
function NextArc(arc, l){
  if(arc){
    if (arc['edges'][l])return arc['edges'][l];
    return false;
  } else {
    return gd.get(l);
  }
}


// function CrossCheck
// Helper function to determine which letters are valid based on the surronding board
// Called with the origin and horizontal offset, returns an array of valid tiles
// board up / down
function CrossCheck(r,c,pos){
  var arc = null;
  var up = board.GetUp(r,c,pos);
  var down = board.GetDown(r,c,pos);
  if (!up && !down){
    return '';
  }

  if (up XOR down){
    word = (up+down).split('');

    for (i=0; i<word.length; i++){
      arc = NextArc(arc, word[i]);
      if (!arc) return false;
    }
    if (up) {
      // ITERATE THROUGH EGES;
      return ; // letters
    }
    arc = NextArc(arc,'_');
    if (down && arc) {
      // ITTERATE THROUGH EDGES
      return; // letters
    }
    return '';
  }
  
}//function CrossCheck
                                               



// function Gen
// Primary move generating function. Itterates through the hand from a given anchor spot
// called with the anchor location, positional offset, current word, tiles available
// and the current node in the GADDAG
// operates on the 
//
function Gen(r,c, pos, word, value, mult, hand, arc){
  // Get the current board location. If it is Out of Bounds, we're done.
  // if it has a letter, call GoOn with that letter.
  // Otherwise generate new move based on the hand.
  var bl = board.GetChar(r,c,pos)
  if (bl === 'OOB'){
    return false;
  } else if (bl !== '') {
    GoOn(r, c, pos, bl, word, value, mult, hand, NextArc(arc,bl), 'on board');
  }

  // Next, to generate our move based on tiles in our hand, we need to generate
  // all valid letters to place on a given board location based on the letters
  // above or below the tile. before or after will be handled by Gen/GoOn
  // function, as we inteliginetly pick our anchor locations.
  var x_letters = CrossCheck(r,c,pos);
  // If we have restrictions from the crosscheck, generate the list of possible
  // letters we can play based on the board and hand.
  // Crosscheck will hand back a null if there are no restrictions. In that case
  // the valid letters will be whatever is in the hand.
  //
  if (x_letters){
    var letters = _.intersection(x_letters,hand);
  } else {
    var letters = hand;
  }

  // Itterate over each of the letters we can play
  letters.forEach( function IttLetters (l,i,letters) {
    // slice into new array to pass by value instead of reference.
    var a = letters.slice();

    // Check if the tile is a blank tile, we will need to try everything
    if ( l == ' '){
      a.splice(i,1); // remove the _ and continue on
      // Itterate over the options for a blank instead of the hand.
      x_letters.forEach(function IttBlank (le) {
        GoOn(r, c, pos, le, word, a, NextArc(arc,le), 'blank');
      }); //valid.forEach()
    } else {
      a.splice(i,1); // remove the tile from the hand and try to play it
      GoOn(r,c,pos, l,word, a, NextArc(arc,l),arc,'played');
    } // if/else l = ''
  }); //hand.forEach()
}//Gen ()

function GoOn(r, c, pos, l, word, value, mult, hand, NewArc, type){
  // Check if play was valid. If not do nothing.
  if (!NewArc) {
    return false;
  }

  // Check which direction we are moving
  // build the word in the correct direction
  if (pos >= 0 ) {
    word = word + l;
  } else {
    word = l + word;
  }

  // If we played a letter we get to count the vaule of the letter and cross
  // If we played a blank we only get the cross
  // if the letter is on the board we get the value of the letter only.
  if (type === 'played') {
    value += board.GetValue(r, c, pos, l);
    mult += board.WordMult(r, c, pos);
  } else if (type === 'blank') {
    value += board.GetValue(r, c, pos, ' ');
    mult += board.WordMult(r, c, pos);
  } else {
    value += board.ltr_value[l.toUpperCase()];
  }

  // Check if the node in the GADDAG is and end of word node.
  // If so send the word to board object to check if we need to record it.
  if (NewArc['$'] === 1 && gd.find(word)) {
    board.RecordPay(r,c,pos,word,mult,value);
  }
  // Once again check which way we are moving
  if (pos >= 0) {
    // Moving Right, first call gen moving one more to the right
    // Then check if GADDAG has a node starting back at the archor and going
    // back the other way. If so call Gen back at that position.
    Gen(origin, pos+1, word,hand,NewArc);
    NewArc = NextArc(NewArc,'_');
    if (NewArc) Gen(r, c, -1, word, value, mult, hand, NewArc);
  } else {
    // Moving Left, just keeep chugging along.
    Gen(r, c, pos-1, word, value, mult, hand, NewArc);
  }
}// GoOn end


function main(){
  hand = process.argv.slice(2,process.argv.length);
  Gen(null,0,'',hand,null);
}// end main

load_first();
