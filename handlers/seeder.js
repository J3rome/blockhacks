
module.exports = {
    seedUsers: function(request, reply){
        request.models.user.findOrCreate({
            where: {
                firstName: 'John',
                lastName: 'Doe',
                password: 'qwerty123',
                email: 'john@doe.com',
                wallet: 'rjifd53f#dd32'
            }
        }).then(function(event){
            reply({'status': 200, 'message' : 'User seeded'});
        });
    },
    seedCurrencies: function(request, reply){
        request.models.currency.destroy({
            where: {},
            truncate: true
        }).then(function(event){
            request.models.currency.bulkCreate([
                {
                    name: 'ProhackCoins',
                    active: true,
                    rate: 0.4
                },
                {
                    name: 'DAI',
                    active: false,
                    rate: 0.66
                }
            ]).then(function(event){
                reply({'status': 200, 'message' : 'Currencies seeded'});
            });
        });
    },
    clearDb: function(request, reply){
        request.models.currency.destroy({
            where: {},
            truncate: true
        }).then(function(event){
            request.models.user.destroy({
                where: {},
                truncate: true
            }).then(function(event){
                reply({'status': 200, 'message' : 'Database cleared'});
            })
        })
    }
};