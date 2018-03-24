const StripeManager = require('../managers/StripeManager');

module.exports = {
    stripePayment: function(request, reply){
        StripeManager.doTransaction(request.payload.amount,
                                    request.payload.tokenId,
                                    request.payload.fiatCurrency,
                                    function(resp){
                                        reply(resp);
                                    });
    }
};