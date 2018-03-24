var Client = require('coinbase').Client;
var client = new Client({'apiKey': 'COiXpIGVKZDK0fgf', 'apiSecret': '9f2dOdGE3cRBaRdZIgUWNvES8gPAeefQ'});

client.getAccounts({}, function(err, accounts) {
  accounts.forEach(function(acct) {
    console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
  });
});

client.getBuyPrice({'currencyPair': 'BTC-USD'}, function(err, obj) {
  console.log('total amount: ' + obj.data.amount);
});

var args = {
  "amount": "0.001",
  "currency": "ETH",
  "description": "Sample transaction for you"
};
account.requestMoney(args, function(err, txn) {
  console.log('my txn id is: ' + txn.id);
});