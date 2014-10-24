




// test board functionality
//

var eql = require('deep-eql');
var mod_board = require('./board.js');


var json_board = [['','A','B'],
                  ['','',''],
                  ['','','']];

var board = new mod_board(json_board);
var test_failed = []

function perform_test (output,expected,num) {

  var pass = eql(output,expected);

  if (pass) {
    console.log('Test', num,'passed');
  } else {
    console.log('Test', num, 'failed. Expected', expected, 'Returned',output);
    test_failed.push(num);
  }
}


// Test 1: board.board should return an array equal to json_board
perform_test(board.tiles,json_board,1);
// Test 2: check valid position (0,0,0)
perform_test(board.ValidLoc(0,0,0),true,2);
// Test 3: check valid position (2,2,0
perform_test(board.ValidLoc(2,2,0),true,3);
// Test 4: check valid position (2,2,-2
perform_test(board.ValidLoc(2,2,-2),true,4);
// Test 5: check invalid position (3,2,0)
perform_test(board.ValidLoc(3,2,0),false,5);
// Test 6: check invalid position (2,2,-4
perform_test(board.ValidLoc(2,2,-4),false,6);


// Test 7: GetChar, valid location
perform_test(board.GetChar(2,1,0),'',7);
// Test 8: GetChar, invalid location
perform_test(board.GetChar(4,1,0),'OOB',8);
// Test 9: GetChar, valid location
perform_test(board.GetChar(0,2,-1),'A',9);


// Test 10: getanchor, valid location
perform_test(board.GetAnchor(1),[1],10);
// Test 11: getanchor, valid location
perform_test(board.GetAnchor(0),[0],11);
// Test 12: getanchor invalid row
perform_test(board.GetAnchor(3),'OOB',12);

// Test 13: transponse
perform_test(board.flip(),true,13);

// Test 14: getdown valid word
perform_test(board.GetDown(0,0,0),'AB',14);
// Test 15: getdown valid no word
perform_test(board.GetDown(0,1,0),'',15);
// Test 16: getdown invalid
perform_test(board.GetDown(10,1,0),'',16);

// Test 17: getup valid word
perform_test(board.GetDown(2,0,0),'',17);

board.flip();




if (test_failed.length >0) {
  console.log(test_failed);
}
