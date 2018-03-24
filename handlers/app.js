const viewManager = require('../managers/View.js');
const _ = require('underscore');
const fs = require('fs');
var dateFormat = require('dateformat');

dateFormat.i18n = {
    dayNames: [
        'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam',
        'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ],
    monthNames: [
        'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec',
        'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
};

var uglyGlobalUnlockState = false;
var uglyGlobalShipmentState = true;

module.exports = {
    home: function (request, reply){
        viewManager.getView('views/shipmentInfos.html', {'newArrival' : uglyGlobalShipmentState} , function (html) {
            reply(html);
        });
    },
    shipmentInfos: function (request, reply){
        viewManager.getStandaloneView('views/shipmentInfos.html', {'newArrival' : uglyGlobalShipmentState} , function (html) {
            reply(html);
        });
    },
    schedule: function(request, reply){
        var theSchedule = [
            {
                'name' : 'Lundi',
                'startHour' : '7:00',
                'endHour'   : '19:00'
            },
            {
                'name' : 'Mardi',
                'startHour' : '7:00',
                'endHour'   : '17:00'
            },
            {
                'name' : 'Mercredi',
                'startHour' : '7:00',
                'endHour'   : '18:00'
            },
            {
                'name' : 'Jeudi',
                'startHour' : '7:00',
                'endHour'   : '17:00'
            },
            {
                'name' : 'Vendredi',
                'startHour' : '7:00',
                'endHour'   : '17:00'
            },
            {
                'name' : 'Samedi',
                'startHour' : 'Jamais',
                'endHour'   : 'Jamais'
            },
            {
                'name' : 'Dimanche',
                'startHour' : 'Jamais',
                'endHour'   : 'Jamais'
            }

        ];
        viewManager.getStandaloneView('views/schedule.html', {'schedule' : theSchedule} , function (html) {
            reply(html);
        });
    },
    objectStatus: function(request, reply){
        reply({
            'containObject' : uglyGlobalShipmentState
        })
    },
    boxHistory: function(request, reply){
        request.models.Event.findAll().then(function(events){
            if(events.length > 0) {
                var history = [];
                for(var i=0;i < events.length;i++){
                    history.push({
                        'type' : events[i].type,
                        'time' : dateFormat(events[i].createdAt, 'ddd dd mmmm HH:MM')
                    })
                }
                viewManager.getStandaloneView('views/history.html', {'history' : history} , function (html) {
                    reply(html);
                });
            }else{
                reply('<div id="history-empty-message">Aucun événement trouvé</div>');
            }
        });

    },
    doUnlock: function(request, reply){
        // TODO : Change the unlock state
        console.log("Do Unlock");
        uglyGlobalUnlockState = true;
        reply({
            status : 'OK'
        })
    },
    boxOpened: function(request, reply){
        request.models.Event.create({
            'type' : 'open'
        }).then(function(event){
            reply({
                status: 'OK'
            });
        });
    },
    boxClosed: function(request, reply){
        request.models.Event.create({
            'type' : 'close'
        }).then(function(event){
            reply({
                status: 'OK'
            });
        });
    },
    unlockState: function(request, reply){
        console.log(uglyGlobalUnlockState);
        if(uglyGlobalUnlockState) {
            uglyGlobalUnlockState = false;
            reply({
                'unlock': true
            })
        }else{
            reply({
                'unlock': false
            })
        }
    },
    objectPresent: function(request, reply){
        console.log('Object present : '+request.query.present);
        uglyGlobalShipmentState = request.query.present === 'true';

        reply({
            status : 'OK'
        })
    }
};