
//Variables
const Url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,DOGE,XRP,SOL&tsyms=USD&api_key=';
const apiKey = '05f6cda97936cba0da1b452f5b676ab29016dc22ab1ab6cb0bea9afabacffe09';
const coinNames  = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  DOGE: 'Dogecoin',
  XRP: 'XRP',
  SOL: 'Solana'
};

const searchHistory = [];

//Accordion Function
$( function() {
  $( "#accordion" ).accordion({
      heightStyle: "content",
      collapsible:true
  });
} );

// set the search history in local storage
function setSearchHistory(searchHistory) {
  try {
      const historyJson = JSON.stringify(searchHistory);
      localStorage.setItem('searchHistory', historyJson);
  } catch (error) {
      console.error('Failed to save search history:', error);
  }
}

// get the search history from local storage
function getSearchHistory() {
  try {
      const historyJson = localStorage.getItem('searchHistory');
      return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
      console.error('Failed to retrieve search history:', error);
      return [];
  }
}

//History Funtions
function showHistory() {
  var resultsArea = $('#results-area');
  resultsArea.empty();

  // Create history container
  var historyContainer = $('<div></div>').attr({id: "history-results-container"});
  resultsArea.append(historyContainer);

  var historyTitle = $('<div></div>').attr({id: "history-title"}).append('<h3>Your History:</h3>');
  historyContainer.append(historyTitle);

  var historyHeaders = $('<div></div>').attr({id: "history-headers"});
  historyContainer.append(historyHeaders);

  historyHeaders.append($('<span></span>').attr({id: "order-head"}).text('Order'));
  historyHeaders.append($('<span></span>').attr({id: "action-head"}).text('Action'));

  var historyList = $('<ol></ol>').attr({id: "history-list"});
  historyContainer.append(historyList);

  var history = getSearchHistory();

  if (history.length === 0) {
    historyList.append('<li>No history found</li>');
  } else {
    for (var i = 0; i < history.length; i++) {
      var listItem = $('<li></li>');
      var formattedTimestamp = dayjs(history[i].timestamp).format('MM/DD/YYYY @ hh:mm A [EST]'); // Format timestamp

      if (history[i].type === "Price") {
          listItem.text(`Price: ${history[i].coin} (${history[i].price}) (${formattedTimestamp})`);
      } else if (history[i].type === "Comparison") {
          listItem.text(`Compared: ${history[i].coin1} to ${history[i].coin2} (${formattedTimestamp})`);
      } else if (history[i].type === "Converted") {
          listItem.text(`Converted: ${history[i].input} to ${history[i].output} (${formattedTimestamp})`);
      }

      historyList.append(listItem);
    }
  }
}
 

function hideHistory() {
  var historyContainer = $('#results-area');
  historyContainer.empty();
}

function clearHistory() {
  hideHistory();
  searchHistory.length = 0;
  localStorage.clear('searchHistory');
}

//query selector 
var coinBtn = document.querySelector("#coin-selection");

// Event listner when submit is clicked
coinBtn.addEventListener("click", getCryptoPrices);


// function cryptoprices will retrieve coin value from api.
function getCryptoPrices() {
  var Cryptocoin = document.getElementById("cryptoSelection").value;
  var Urlcoin = `https://min-api.cryptocompare.com/data/price?fsym=${Cryptocoin}&tsyms=USD`;

  fetch(Urlcoin)
    .then(response => response.json())
    .then(data => {
      const price = data.USD;
      //create search object
      const userPriceSearch = {
        type : "Price",
        price: price,
        coin: Cryptocoin,
        timestamp: dayjs().format('MM/DD/YYYY @ h:mm A')
      }
      // display users selected coin with coin name and price
      document.getElementById("results-area").innerHTML=`Crypto Prices`;
      document.getElementById("results-area").innerHTML =`${Cryptocoin} Current Price: $${price} `;
      //add search to the history
      searchHistory.push(userPriceSearch);
      //add search to localstorage
      setSearchHistory(searchHistory);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById("results-area").innerHTML = 'Error fetching data';
    });
}


//Get main data from API
async function getData() {
      try {
            const response = await fetch(Url + apiKey);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            return response.json();
            
        } catch (error) {
            console.log('There was a problem with the fetch operation', error);
        }
  }

//Populates Dropdown Menu
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

//Checks if each coin exists
function coinExists(dropdown, coin) {
      return Array.from(dropdown.options).some(option => option.value === coin);
    }
  
//Fetch Coin Info (Pulls API Data)
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

// Compare Coins Function
function compareCoins() {
  getData().then(data => {
    const coins = Object.keys(data.RAW);
    populateDropdowns(coins);
    const coin1 = document.getElementById('coin1').value;
    const coin2 = document.getElementById('coin2').value;
    Promise.all([fetchCoinInfo(coin1), fetchCoinInfo(coin2)])
      .then(([info1, info2]) => {
        const userCompare = {
          coin1 : coin1,
          coin1_price : info1.price,
          coin2 : coin2,
          coin2_price : info2.price,
          type : "Comparison",
          timestamp: dayjs().format('MM/DD/YYYY @ hh:mm A')
        };
        //add search to the history
        searchHistory.push(userCompare);
        //add search to localstorage
        setSearchHistory(searchHistory);
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
 
//Compare Coins Event Listner (Initialization)
document.getElementById('compare-submit').addEventListener('click', compareCoins);
