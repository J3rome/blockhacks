var Client = require('coinbase').Client;
var client = new Client({'apiKey': 'COiXpIGVKZDK0fgf', 'apiSecret': '9f2dOdGE3cRBaRdZIgUWNvES8gPAeefQ'});

console.log("Before Payment");
client.getPaymentMethods({},function(err, pms) {
    console.log('Payment methods');
    console.log(pms);
});

client.getAccounts({}, function(err, accounts) {
  accounts.forEach(function(acct) {
    console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);

      acct.getBuys({}, function(err, buys){
        console.log("Listing buys");
        console.log(buys);
      });

      var buyingOptions = {
          "amount": "0.001",
          "currency": "ETH",
          "quote": true
      };
      acct.buy(buyingOptions, function(err, tx){
          console.log(err);
          console.log(tx);
      });
  });
});

client.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, obj) {
  console.log('1 BTC = ' + obj.data.amount + ' USD');
});

