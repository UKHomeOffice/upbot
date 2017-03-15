var moment = require('moment')


exports.getStatus = function(bot, message, controller) {
    bot.startConversation(message, function(err, convo) {
        if (!err) {
            convo.say('Let me check for you...');
            controller.storage.services.all(function(err, all_services_data) {
              console.log(all_services_data);
              processStatusResults(all_services_data, convo);
            });
       };
    });
};


exports.list = function(bot, message, controller) {
    bot.startConversation(message, function(err, convo) {
        if (!err) {
            convo.say('I am currently monitoring the following services:');
            controller.storage.services.all(function(err, all_services_data) {
              processListResults(all_services_data, convo);
            });
       };
    });
};


exports.addService = function(bot, message, controller) {
    bot.startConversation(message, function(err, convo) {
        if (!err) {
            convo.ask('What should I call the new service?', function(response, convo) {
              convo.ask('The new service will be called `' + response.text + '`. Please confirm? [yes/no]', [
                  {
                      pattern: 'yes',
                      callback: function(response, convo) {
                          // since no further messages are queued after this,
                          // the conversation will end naturally with status == 'completed'
                          convo.next();
                      }
                  },
                  {
                      pattern: 'no',
                      callback: function(response, convo) {
                          // stop the conversation. this will cause it to end with status == 'stopped'
                          convo.stop();
                      }
                  },
                  {
                      default: true,
                      callback: function(response, convo) {
                          convo.repeat();
                          convo.next();
                      }
                  }
              ]);
              convo.next();
          }, {'key': 'serviceName'}); // store the results in a field called nickname
          convo.on('end', function(convo) {
              if (convo.status == 'completed') {
                  bot.reply(message, 'OK! I will update my list of services...');
                  var data = {
                    id: convo.extractResponse('serviceName'),
                    status: 'false',
                    lastupdate: moment.utc().format('YYYY-MM-DD[T]HH:mm:ss'),
                    message: 'New service'
                  };
                  controller.storage.services.save(data, function(err) {
                    bot.reply(message, 'I have added a new service called `' + data.id + '` to our list of services. :punch:');
                  });
              } else {
                  // this happens if the conversation ended prematurely for some reason
                  bot.reply(message, 'OK, nevermind!');
              };
          });
       };
    });
};


exports.setStatus = function(bot, message, controller) {
    bot.startConversation(message, function(err, convo) {
        if (!err) {
            convo.ask('Which service\'s status should I update?', function(response, convo) {
              convo.ask('What should I set the status to? [up/down]', [
                  {
                      pattern: 'up',
                      callback: function(response, convo) {
                          // since no further messages are queued after this,
                          // the conversation will end naturally with status == 'completed'
                          convo.next();
                      }
                  },
                  {
                      pattern: 'down',
                      callback: function(response, convo) {
                          // stop the conversation. this will cause it to end with status == 'stopped'
                          convo.stop();
                      }
                  },
                  {
                      default: true,
                      callback: function(response, convo) {
                          convo.repeat();
                          convo.next();
                      }
                  }
              ]);
              convo.next();
          }, {'key': 'serviceName'}); // store the results in a field called nickname
          convo.on('end', function(convo) {
            bot.reply(message, 'OK! I\'ll update the status...');
            if (convo.status == 'completed') {
              var data = {
                id: convo.extractResponse('serviceName'),
                status: 'true',
                lastupdate: moment.utc().format('YYYY-MM-DD[T]HH:mm:ss'),
                message: 'Status changed'
              };
              controller.storage.services.save(data, function(err) {
               bot.reply(message, 'Done! :ok_hand:');
              });
            } else {
              // this happens if the conversation ended prematurely for some reason
              var data = {
                id: convo.extractResponse('serviceName'),
                status: 'false',
                lastupdate: moment.utc().format('YYYY-MM-DD[T]HH:mm:ss'),
                message: 'New service'
              };
              controller.storage.services.save(data, function(err) {
                bot.reply(message, 'Shame! :thumbsdown:');
              });
            };
          });
       };
    });
};


function processStatusResults(services, convo) {
  var msg = '';
  for (var i=0; i<services.length; i++) {
    if(services[i].status === 'false') {
      msg = msg + ':red_circle: ' + services[i].id + ' is down, and has been since ' + services[i].lastupdate + '\n';
    };
  };
  if(msg === '') {
    msg = ':white_check_mark: Everything looks good, all services are up! :thumbsup:';
  }
  convo.say(msg)
};


function processListResults(services, convo) {
  var msg = '';
  for (var i=0; i<services.length; i++) {
    msg = msg + '- ' + services[i].id + '\n';
  };
  if(msg === '') {
    msg = 'I\'m not currently monitoring any services :thinking_face:';
  }
  convo.say(msg)
};
