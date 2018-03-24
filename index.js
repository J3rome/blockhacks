const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');
const Vision = require('vision');
const Pug = require('pug');

const dbSeeder = require('./handlers/seeder.js');
const appHandler = require('./handlers/app.js');
const ajaxHandler = require('./handlers/ajax.js');
const models = require('./models/index.js');


models.sequelize.sync().then(function(){
    // Create a server with a host and port
    const server = new Hapi.Server();

    server.connection({
        host: '0.0.0.0',
        port: 8080,
        routes: {
            files: {
                relativeTo: Path.join(__dirname,'static')
            }
        }
    });


    server.ext('onRequest', function(request, reply){
        request.models = models;
        // FIXME : retrieval should be done once per session, not on every request
        request.models.user.findOne({
            where: {
                email: 'john@doe.com'
            }
        }).then(function(user){
            request.currentUser = user;
            reply.continue();
        });
    });

    const provision = async () => {
        await server.register(Inert);
        await server.register(Vision);

        server.views({
            engines: { pug: Pug },
            relativeTo: __dirname,
            path: 'views',
            isCached: false
        });

        //Static route
        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory : {
                    path : '.',
                    redirectToSlash: false,
                    index: true
                }
            }
        });

        // App
        server.route({
            method: 'GET',
            path:'/',
            handler: function (request, reply) {
                reply.view('home', {title: 'Prockathon'});
            }
        });

        server.route({
            method: 'GET',
            path:'/buy',
            handler: function (request, reply) {
                // Default value is USD
                reply.view('buy', {title: 'Prockathon', dairate: 1, comparecurrency: 'US Dollars'});
            }
        });



        server.route({
            method: 'GET',
            path:'/chosen',
            handler: function (request, reply) {
                var chosencurrency = request.params.currency;
                console.log(chosencurrency);
                if (chosencurrency === 'US Dollars') {
                    var dairate = 1;
                    var comparecurrency = 'US Dollars';
                }
                else if (chosencurrency === 'CAD Dollars') {
                    var dairate = 1.28908;
                    var comparecurrency = 'Canadian Dollars';
                }
                else if (chosencurrency === 'EUR Euros') {
                    var dairate = 0.80919;
                    var comparecurrency = 'Euros';
                }
                else if (chosencurrency === 'AUS Dollars') {
                    var dairate = 1.29906;
                    var comparecurrency = 'Australian Dollars';
                }
                else if (chosencurrency === 'CHF Francs') {
                    var dairate = 0.94679;
                    var comparecurrency = 'Swiss Francs';
                }
                reply.view('calculate', {title: 'Prockathon', dairate: dairate, comparecurrency: comparecurrency});
            }
        });

        server.route({
            method: 'GET',
            path:'/stripe',
            handler: function (request, reply) {
                reply.view('stripe', {});
            }
        });

        server.route({
            method: 'GET',
            path:'/balance',
            handler: appHandler.userBalance
        });

        server.route({
            method: 'GET',
            path:'/accountBalance/{accountAddress}',
            handler: appHandler.accountBalance
        });


        //https://api.ethplorer.io/getAddressInfo/0x59D07d9b0EB06612A699F9F00ee76e5c876536ef?apiKey=freekey

        // Ajax endpoints
        server.route({
            method: 'POST',
            path:'/calculateRate',
            handler: function (request, reply) {
                var chosenCurrency = request.payload.fiatCurrency;
                var daiRate;
                var currencyDisplayName;
                if( chosenCurrency === 'CAD'){
                    daiRate = 1.28908;
                    currencyDisplayName = 'Canadian Dollars';
                }else if(chosenCurrency === 'EUR'){
                    daiRate = 0.80919;
                    currencyDisplayName = 'Euros';
                }else if(chosenCurrency === 'AUD'){
                    daiRate = 1.29906;
                    currencyDisplayName = 'Australian Dollars'
                }else if(chosenCurrency === 'CHF'){
                    daiRate = 0.94679;
                    currencyDisplayName = 'Swiss Francs';
                }else{
                    daiRate = 1;
                    currencyDisplayName = 'US Dollars';
                }

                reply({'rate' : daiRate, 'displayName': currencyDisplayName});
            }
        });


        server.route({
            method: 'POST',
            path:'/stripePayment',
            handler: ajaxHandler.stripePayment
        });

        server.route({
            method: 'GET',
            path:'/currencies',
            handler: appHandler.currencies
        });

        // Test routes
        server.route({
            method: 'GET',
            path:'/test/stripe/{amount}',
            handler: appHandler.dummyTransaction
        });



        // Seed routes
        server.route({
            method: 'GET',
            path:'/seed/users',
            handler: function (request, reply) {
                dbSeeder.seedUsers(request, reply);
            }
        });

        server.route({
            method: 'GET',
            path:'/seed/currencies',
            handler: function (request, reply) {
                dbSeeder.seedCurrencies(request, reply);
            }
        });

        server.route({
            method: 'GET',
            path:'/seed/clear',
            handler: function (request, reply) {
                dbSeeder.clearDb(request, reply);
            }
        });


        // Start the server
        await server.start(function(err) {

            if (err) {
                throw err;
            }
            console.log('Server running at:', server.info.uri);
        });
    };

    provision();
});


