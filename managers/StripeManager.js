const stripe = require('stripe')('sk_test_2O1RccDMOCDF6YzkwPUPCjcj');

module.exports = {
    dummyTransaction: function(amount, callback){
        stripe.customers.create({
            email: 'Bob@test.com'
        }).then(function(customer){
            return stripe.customers.createSource(customer.id, {
                source: 'tok_visa'
            });
        }).then(function(source) {
            return stripe.charges.create({
                amount: amount,
                currency: 'cad',
                customer: source.customer
            });
        }).then(function(charge) {
            // New charge created on a new customer
            callback({'status': 200, 'message': 'Stripe transaction successfull'});
        }).catch(function(err) {
            // Deal with an error
            console.log("Got error from stripe");
            console.log(err);
            callback(err);
        });
    },
    doTransaction: function(amount, tokenId, fiatCurrency, callback){
        stripe.charges.create({
            amount: amount,
            source: tokenId,
            currency: fiatCurrency,
            description: 'Bought some DAI coin'
        }).then(function(charge){
            callback({'status': 200, 'message': 'Stripe transaction successfull'});
        }).catch(function(err){
            console.log("Got an stripe error");
            console.log(err);
            callback(err);
        })
    }
};