const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');

//const appHandler = require('./handlers/app.js');

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
        //request.models = models;
        reply.continue();
    });

    const provision = async () => {
        await server.register(Inert);

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
                //appHandler.home(request, reply);
                reply('Hello World');
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


