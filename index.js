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
                reply.view('index', {
                    title: 'testTitle'
                });
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


