const StripeManager = require('../managers/StripeManager');
const Request = require('request');

module.exports = {
    currencies: function(request, reply){
        request.models.currency.findAll().then(function(currencies){
           if(currencies.length > 0){
                reply.view('currencies', {
                    currencyList : currencies
                });
           }else{
               reply({'status' : '500', 'message': 'No currency informations in database'});
           }
        });
    },
    dummyTransaction: function(request, reply){
        StripeManager.dummyTransaction(request.params.amount,function(resp){
           if(resp.status === 200){
               reply(resp);
           }else{
               reply({'status':500, 'message': resp});
           }
        });
    },
    accountBalance: function(request, reply){
        var accountAddress = request.params.accountAddress;

        Request('https://api.ethplorer.io/getAddressInfo/'+accountAddress+'?apiKey=freekey', {json:true}, function(err, res, body){
            if(body.error){
                reply({'status' : 400, 'message': 'Couldn\'t retrieve account balance'})
            }else{
                var trimmedBalances = {};
                body.tokens.forEach(function(token){
                    trimmedBalances[token.tokenInfo.name] = token.balance
                });
                reply({'status' : 200, 'data' : trimmedBalances})
            }
        });
    },
    userBalance: function(request, reply){
        var walletAdress = request.currentUser.wallet;
        Request('https://api.ethplorer.io/getAddressInfo/'+walletAdress+'?apiKey=freekey', {json:true}, function(err, res, body){
            if(body.error){
                reply({'status' : 400, 'message': 'Couldn\'t retrieve account balance'})
            }else{
                var trimmedBalances = [];
                body.tokens.forEach(function(token){
                    trimmedBalances.push({name: token.tokenInfo.name, balance: new Intl.NumberFormat().format(token.balance)});
                });
                reply.view('balance', {
                    tokens: trimmedBalances
                });
            }
        });
    }
};