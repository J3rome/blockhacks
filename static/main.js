var SafeDrop = {
    historyTimer : undefined,
    objectStatusTimer : undefined,
    objectStatusScanInterval: 500,
    openingWaitTime: 1000,
    hasObject: true,
    dragDealer: undefined,
    init: function(){
        $('#header-logo-container > img').on('click', function(){
            SafeDrop.stopPollHistory();
            SafeDrop.stopPollObjectStatus();
            $.get('/shipmentInfos', function(data){
                $('#mainContent').html(data);
                SafeDrop.initHome(true);
            });
        });

        $('html').one('click', function(){
            document.body.webkitRequestFullscreen();
        });


    },
    initHome: function(startPolling){
        SafeDrop.hasObject = !($('.shipment-infos-text').hasClass('empty'));

        if(SafeDrop.hasObject){
            SafeDrop.dragDealer = new Dragdealer('unlock-slider', {
                                    steps: 2,
                                    callback: function(x, y) {
                                        // Only 0 and 1 are the possible values because of "steps: 2"
                                        if (x) {
                                            this.disable();
                                            $('#unlock-slider').fadeOut(400, function(e){
                                                SafeDrop.doUnlock();
                                            });
                                        }
                                        // TODO : Fadeout, sleep, show message "SafeDrop dévérouillé"
                                    }
                                });
        }

        $('.footer-left-button >span').text('Historique');
        $('.footer-right-button >span').text('Horaire');
        $('.footer-left-button').off('click');
        $('.footer-right-button').off('click');

        if(startPolling){
            SafeDrop.pollObjectStatus()
        }

        $('.footer-left-button').one('click', function(e){
            SafeDrop.stopPollObjectStatus();
            $.get('/history', function(resp){
                if(resp){
                    $('#mainContent').html(resp);
                    SafeDrop.initHistory(true);
                }
            })
        });

        $('.footer-right-button').one('click', function(e){
            SafeDrop.stopPollObjectStatus();
            $.get('/schedule', function(resp){
                if(resp){
                    $('#mainContent').html(resp);
                    SafeDrop.initSchedule();
                }
            })
        });


    },
    initHistory: function(startPolling){
        $('.footer-left-button').off('click');
        $('.footer-right-button').off('click');

        $('.footer-left-button >span').text('Accueil');
        $('.footer-right-button >span').text('Horaire');

        if(startPolling) {
            SafeDrop.pollHistory();
        }

        $('.footer-left-button').one('click', function(e){
            SafeDrop.stopPollHistory();
            $.get('/shipmentInfos', function(data){

                $('#mainContent').html(data);
                SafeDrop.initHome(true);
            });
        });

        $('.footer-right-button').one('click', function(e){
            SafeDrop.stopPollHistory();
            $.get('/schedule', function(resp){
                if(resp){
                    $('#mainContent').html(resp);
                    SafeDrop.initSchedule();
                }
            })
        });
    },
    initSchedule: function(){
        $('.footer-left-button').off('click');
        $('.footer-right-button').off('click');

        $('.footer-left-button >span').text('Historique');
        $('.footer-right-button >span').text('Accueil');

        $('.footer-right-button').one('click', function(e){
            $.get('/shipmentInfos', function(data){
                $('#mainContent').html(data);
                SafeDrop.initHome(true);
            });
        });

        $('.footer-left-button').one('click', function(e){
            $.get('/history', function(resp){
                if(resp){
                    $('#mainContent').html(resp);
                    SafeDrop.initHistory(true);
                }
            });
        });
    },
    doUnlock: function(){
        $('.unlock-slider-status').removeClass('hide');
        $.get('/doUnlock', function(resp){
            if(resp){
                setTimeout(function(){
                    $('.unlock-slider-status').text("Boite ouverte");
                },SafeDrop.openingWaitTime);
            }
        });
    },
    initSlider: function(){
        SafeDrop.dragDealer = new Dragdealer('unlock-slider');
    },
    pollObjectStatus : function(){
        SafeDrop.objectStatusTimer = setInterval(function(){
            $.get('/objectStatus', function(resp){
                if(resp && resp.containObject != SafeDrop.hasObject){
                    SafeDrop.hasObject = resp.containObject;
                    $.get('/shipmentInfos', function(data){
                        $('#mainContent').html(data);
                        SafeDrop.initHome(false);
                    });
                }
            });
        }, SafeDrop.objectStatusScanInterval)
    },
    stopPollObjectStatus: function(){
        if(SafeDrop.objectStatusTimer) {
            clearInterval(SafeDrop.objectStatusTimer);
            SafeDrop.objectStatusTimer = undefined;
        }
    },
    pollHistory : function(){
        SafeDrop.historyTimer = setInterval(function(){
            $.get('/history', function(resp){
                var $mainContent = $('#mainContent');
                if(resp.indexOf('Aucun') === -1 && resp != $mainContent.html()){
                    console.log("Replacing history");
                    $mainContent.html(resp);
                    SafeDrop.initHistory(false);
                }
            });
        }, SafeDrop.objectStatusScanInterval)
    },
    stopPollHistory: function(){
        if(SafeDrop.historyTimer) {
            clearInterval(SafeDrop.historyTimer);
            SafeDrop.historyTimer = undefined;
        }
    }
};

$(document).ready(function(){
    SafeDrop.init();
    SafeDrop.initHome(true);
});