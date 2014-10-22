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
    if (arc['edges'][l])return arc['edges'][l];i
    return null;
  } else {
    return gd.get(l);
  }
}


// function CrossCheck
// Helper function to determine which letters are valid based on the surronding board
// Called with the origin and horizontal offset, returns an array of valid tiles
// board up / down




}//function CrossCheck
                                               



// function Gen
// Primary move generating function. Itterates through the hand from a given anchor spot
// called with the anchor location, positional offset, current word, tiles available
// and the current node in the GADDAG
// operates on the 
//
function Gen(origin, pos, word, hand, arc){
  if ((origin[0] < 0 || origin[0] >= board.length) ||
    (origin[1]+pos < 0 || origin[1]+pos >= board[origin[0]].length)){
    return
  }
  // Store the current board letter
//  bl = board[origin[0],origin[1]+pos]
//  if(bl){ // Check if the current spot has a letter,
//     GoOn(origin,pos,word,hand,arc[bl][edges],arc);
//  } else {
//  // No letter currently in this position, compute the valid plays
//  //based on letters in the hand and the surrounding board 
//  letters = _.intersection(crosscheck(origin,pos),hand);
  var letters = hand;
  letters.forEach(function(l,i,letters){ // letter, index, array
    var a = letters.slice(); // pass by value

    // Check if the tile is a blank tile, we will need to try everything
    if ( l == ' '){
      a.splice(i,1) // remove the _ and continue on
      .forEach(function(le,ind,a){
        var ar = a.slice() // pass by value
        ar.splice(ind,1);
        GoOn(origin,pos,le,word,ar,NextArc(arc,le),arc);
      }); //valid.forEach()
    } else {
      a.splice(i,1); // remove the tile from the hand and try to play it
      GoOn(origin,pos, l,word, a, NextArc(arc,l),arc);
    } // if/else l = ''
  }); //hand.forEach()
}//Gen ()

function GoOn(origin,pos,l,word,hand,NewArc,OldArc){
  // Check which direction we are moving 
  if (pos < 0){
    word = l + word;
    if (NewArc){
      if (NewArc['$'] == 1 && gd.find(word)) console.log(word);
      //Record Play
      //if room
      Gen(origin, pos-1, word,hand,NewArc);
      //end if room
    } // if NewArc
  } else {
    word = word + l;
    if (NewArc){ // and room
      if (NewArc['$'] == 1 && gd.find(word)) console.log(word);
      //Record Play
      Gen(origin,pos+1, word, hand, NewArc);
      NewArc = NextArc(NewArc,'_');
      if (NewArc) Gen(origin,-1,word,hand,NewArc);
    } // if NewArc
  } // if/else pos<=0
}//GoOn()


function main(){
  hand = process.argv.slice(2,process.argv.length);
  Gen(null,0,'',hand,null);
}// end main

load_first();
