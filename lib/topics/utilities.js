exports.help = function(bot, message) {
    var msg = 'Hi! I\'m UpBot and I\'m here to serve you.\n' +
              'My core commands are:\n' +
              '- `ls` or `list` to show which services I\'m monitoring\n' +
              '- `status` or `healthcheck` to find out the current status of our services\n' +
              '- `add` or `new` to configure a new service for me to monitor\n' +
              '- `set` or `update` to change the status of a service\n' +
              '- `uptime` to see how long I have been running for\n' +
              '- `shutdown` to terminate me (please don\'t do this, it makes me sad)\n' +
              '\nI\'m constantly learning new tricks, so please check again soon :robot_face:'
    bot.reply(message, msg);
};


exports.shutdown = function(bot, message) {
   bot.startConversation(message, function(err, convo) {
       convo.ask('Are you sure you want me to shutdown?', [
           {
               pattern: bot.utterances.yes,
               callback: function(response, convo) {
                   convo.say('Bye!');
                   convo.next();
                   setTimeout(function() {
                       process.exit();
                   }, 3000);
               }
           },
           {
               pattern: bot.utterances.no,
               default: true,
               callback: function(response, convo) {
                   convo.say('*Phew!*');
                   convo.next();
               }
           }
       ]);
   });
};


exports.uptime = function(bot, message) {
    var uptime = formatUptime(process.uptime());
    bot.reply(message,
        ':robot_face: I am a bot named <@' + bot.identity.name +
         '>. I have been running for ' + uptime + '.');
};


function formatUptime(uptime) {
   var unit = 'second';
   if (uptime > 60) {
       uptime = uptime / 60;
       unit = 'minute';
   };
   if (uptime > 60) {
       uptime = uptime / 60;
       unit = 'hour';
   };
   if (uptime != 1) {
       unit = unit + 's';
   };

   uptime = uptime + ' ' + unit;
   return uptime;
};
