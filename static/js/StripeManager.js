var StripeManager = {
    handler: undefined,
    init : function(){
        StripeManager.handler = StripeCheckout.configure({
            key: 'pk_test_gIxJPSmT3vOueui5JID8wd5p',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                var theAmount = parseInt($('#transactionAmount').val())*100;
                $.post('/stripePayment', {
                    'amount' : theAmount,
                    'tokenId': token.id,
                    'fiatCurrency': 'cad'
                }, function(resp, e){
                    if(resp.status === 200){
                        // TODO : Redirect to /balance
                        window.location.href = '/balance';
                    }else{
                        alert("Transaction failed");
                    }
                });
            }
        });

        $('#stripeButton').on('click', function(e){
            var theAmount = parseInt($('#transactionAmount').val())*100;
            StripeManager.handler.open({
                name: 'Prockathon',
                description: 'Stripe test',
                currency: 'cad',
                amount: theAmount
            });
            e.preventDefault();
        });

// Close Checkout on page navigation:
        window.addEventListener('popstate', function() {
            StripeManager.handler.close();
        });
    }
};

$(document).ready(function(e){
   StripeManager.init();
});