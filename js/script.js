var coinmarketcapAPI = '';

var con2coin = $('#con2coin');
var con2dol = $('#con2dol');

// check converter user input

if (con2coin.value && con2dol.value) {
    // alert the user only one input allowed
    // clear input
} else if (isNaN(con2coin.value) || isNaN(con2dol.value)) {
    // give user error
} else if (con2coin.value) {
    // grab the data from user input and store in a variable
    // run conversion to dollars function
} else if (con2dol.value) {
    // grab the data from user input and store in a variable
    // run conversion to coin function
}

//Accordion Function
$( function() {
    $( "#accordion" ).accordion();
  } );