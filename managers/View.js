const cons = require('consolidate');

module.exports = {
    getView: function(viewPath,viewParams, callback){
        cons.underscore(viewPath, viewParams, function(err,mainContentHtml){
            if (err){
                throw err;
            }
            cons.underscore('views/header.html', {}, function(err,headerHtml){
                if (err){
                    throw err;
                }
                cons.underscore('views/footer.html', {}, function(err,footerHtml) {
                    if (err) {
                        throw err;
                    }
                    cons.underscore('views/main.html', {
                        header: headerHtml,
                        mainContent: mainContentHtml,
                        footer: footerHtml
                    }, function (err, fullView) {
                        if (err) {
                            throw err;
                        }
                        callback(fullView);
                    });
                });
            });
        });
    },
    getStandaloneView: function(viewPath, viewParams, callback){
        cons.underscore(viewPath, viewParams, function(err,viewHtml) {
            if (err) {
                throw err;
            }

            callback(viewHtml);
        });
    }
};