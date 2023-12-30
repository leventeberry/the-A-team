// var APIKey = '7bdb779c-f436-4e72-859f-e1dc48ade0d9';
// var ApiKey = 'CB-ACCESS-KEY=OaDA814IfqvRqUYg'
// const Url = 'https://api-public.sandbox.exchange.coinbase.com?'



var con2coin = $('#con2coin');
var con2dol = $('#con2dol');






const Url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DOGE,XRP,SOL&tsyms=USD&api_key='
const apiKey = '05f6cda97936cba0da1b452f5b676ab29016dc22ab1ab6cb0bea9afabacffe09'
function getData() {
    fetch(Url + apiKey)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
 
    })
    .catch(error => {
        console.log('There was a problem with the fetch operation', error);
    });
}

getData();





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

  

  

 