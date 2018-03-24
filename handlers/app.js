module.exports = {
    currencies: function(request, reply){
        request.models.currency.findAll().then(function(currencies){
           if(currencies.length > 0){
                reply.view('currencies', {
                    currencyList : ['test441','test2','test3']
                });
           }else{
               reply({'status' : '500', 'message': 'No currency informations in database'});
           }
        });
    }
};