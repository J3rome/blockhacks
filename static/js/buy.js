var BuyManager = {
    stripeHandler: undefined,
    init: function(){
        var $currencySelector = $('#currencySelector');
        var $btn = $("#btnSubmit");

        // FIXME : On change we should change the calculated amount if the input is not empty
        $currencySelector.on('change', function(e,val){
            var chosenCurrency = $(this).val();
            $.post('/calculateRate', {'fiatCurrency' : chosenCurrency}, function(resp){
                $('#exchangeRate>.rate').text(resp.rate + " ");
                $('#exchangeRate>.displayName').text(resp.displayName);
            });
        });

        $('#inputCurrencyAmount').on('change keyup paste', function(e,val){
           var $input = $(this);

           if($input.val() === ''){

               if(!$btn.hasClass('hidden')){
                   $btn.addClass('hidden');
               }
           }else{
               var amountOfDaiInFiat = parseFloat($input.val()) * parseFloat($('#exchangeRate>.rate').text());

               $btn.text('Buy for '+amountOfDaiInFiat.toFixed(2) + ' ' + $('#exchangeRate>.displayName').text());
               $btn.removeClass('hidden');
           }
        });

        BuyManager.stripeHandler = StripeCheckout.configure({
            key: 'pk_test_gIxJPSmT3vOueui5JID8wd5p',
            image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
            locale: 'auto',
            token: function(token) {
                // You can access the token ID with `token.id`.
                // Get the token ID to your server-side code for use.
                var $input = $('#inputCurrencyAmount');
                var theAmount = parseFloat($input.val()) * parseFloat($('#exchangeRate>.rate').text()) * 100;
                // TODO : Change currency in stripe transfer
                $.post('/stripePayment', {
                    'amount' : parseInt(theAmount),
                    'tokenId': token.id,
                    'fiatCurrency': $currencySelector.val().toLowerCase()
                }, function(resp, e){
                    if(resp.status === 200){
                        // TODO : Redirect to /balance
                        window.location.href = '/success';
                    }else{
                        alert("Transaction failed");
                    }
                });
            }
        });

        $btn.on('click', function(e){
            var $input = $('#inputCurrencyAmount');
            var theAmount = parseFloat($input.val()) * parseFloat($('#exchangeRate>.rate').text()) * 100;
            BuyManager.stripeHandler.open({
                name: 'Prockathon',
                description: 'Buying DAI coins !',
                currency: $currencySelector.val().toLowerCase(),
                amount: parseInt(theAmount)
            });
            e.preventDefault();
        });

        window.addEventListener('popstate', function() {
            BuyManager.stripeHandler.close();
        });



    },
    calculateRate: function(daiAmount){

    }
};

$(document).ready(function(){
   BuyManager.init();
});