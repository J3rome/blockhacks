const StripeManager = require('../managers/StripeManager');

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
    }
};