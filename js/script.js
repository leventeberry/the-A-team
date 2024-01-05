document.addEventListener('DOMContentLoaded', function () {

var con2coin = $('#con2coin');
var con2dol = $('#con2dol');

    const Url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DOGE,XRP,SOL&tsyms=USD&api_key=';
    const apiKey = '05f6cda97936cba0da1b452f5b676ab29016dc22ab1ab6cb0bea9afabacffe09';
  
    async function getData() {
      try {
            const response = await fetch(Url + apiKey);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return await response.json();
            
        } catch (error) {
            console.log('There was a problem with the fetch operation', error);
        }
    }
    
    getData().then(data => console.log(data));

  getData();

  const coinNames  = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    DOGE: 'Dogecoin',
    XRP: 'XRP',
    SOL: 'Solana'
  };
    function populateDropdowns(coins) {
      const coinDropdown1 = document.getElementById('coin1');
      const coinDropdown2 = document.getElementById('coin2');
  
      
      coins.forEach(coin => {
        if (!coinExists(coinDropdown1, coin)) {
          const option1 = document.createElement('option');
          option1.value = coin;
          option1.text = coinNames[coin];
          coinDropdown1.appendChild(option1);
        }
    
        if (!coinExists(coinDropdown2, coin)) {
          const option2 = document.createElement('option');
          option2.value = coin;
          option2.text = coinNames[coin];
          coinDropdown2.appendChild(option2);
        }
      });
    }
    
    function coinExists(dropdown, coin) {
      return Array.from(dropdown.options).some(option => option.value === coin);
    }
  
    async function fetchCoinInfo(coin) {
      switch (coin) {
        case 'BTC':
        case 'ETH':
        case 'DOGE':
        case 'XRP':
        case 'SOL':
          const data = await getData();
              if (data.RAW[coin] && data.RAW[coin].USD) {
                  const price = data.RAW[coin].USD.PRICE;
                  const marketCap = data.RAW[coin].USD.MKTCAP;
                  const volume24h = data.RAW[coin].USD.VOLUME24HOUR;
                  const low24hour  = data.RAW[coin].USD.LOW24HOUR;
                  return { price, marketCap, volume24h, low24hour };
              }
              return null;
        default:
          return Promise.resolve(null);
      }
    }
  
    function compareCoins() {
      getData().then(data => {
        const coins = Object.keys(data.RAW);
        populateDropdowns(coins);

        const coin1 = document.getElementById('coin1').value;
        const coin2 = document.getElementById('coin2').value;
  
        Promise.all([fetchCoinInfo(coin1), fetchCoinInfo(coin2)])
          .then(([info1, info2]) => {
            const comparisonResult = document.getElementById('results-area');
            comparisonResult.innerHTML = '';
            if(coin1 === coin2){
                comparisonResult.innerHTML = `<p class="error-message">Error: Please select two different coins for comparison</p>`;
                return;
            }
            if (info1) {
            comparisonResult.innerHTML += `<div class="coin-info">
            <p class="coin-name">${coinNames[coin1]}</p>
            <p class="info-item">Price: $${info1.price.toLocaleString()} USD</p>
            <p class="info-item">Market Cap: ${info1.marketCap.toLocaleString()}</p>
            <p class="info-item">Volume 24h: ${info1.volume24h.toLocaleString()}</p>
            <p class="info-item">Low 24h: ${info1.low24hour.toLocaleString()}</p>
          </div>`;
            }
            
            if (info2) {
              comparisonResult.innerHTML += `<div class="coin-info">
              <p class="coin-name">${coinNames[coin2]}</p>
              <p class="info-item">Price: $${info2.price.toLocaleString()} USD</p>
              <p class="info-item">Market Cap: ${info2.marketCap.toLocaleString()}</p>
              <p class="info-item">Volume 24h: ${info2.volume24h.toLocaleString()}</p>
            <p class="info-item">Low 24h: ${info2.low24hour.toLocaleString()}</p>
            </div>`;
            }
          });
      });
    }
  
    document.getElementById('compare-submit').addEventListener('click', compareCoins);
  });
  

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
    $( "#accordion" ).accordion({
        heightStyle: "content"
    });
  } );

  

  

 