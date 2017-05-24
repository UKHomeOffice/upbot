#!/usr/bin/env node

'use strict';

var Botkit = require('botkit');
var fs = require('fs');
var path = require('path');
var util = require('util');
var yaml = require('js-yaml');

// import topic controllers
var utilities = require('./topics/utilities')
var status = require('./topics/status')
var chat = require('./topics/chat')

try {
  var config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
  var intent = config.intent;
  var slack_token = process.env.HODQ_SLACK_API_TOKEN;
  var redis_host = process.env.UPBOT_REDIS_HOST;
  var redis_port = process.env.UPBOT_REDIS_PORT;

  var listenFor = 'direct_message,direct_mention,mention'

  var redisConfig = {
    "host": redis_host,
    "port": redis_port,
    "db": 0,
    "namespace": "upbot",
    "methods": ["services", "permissions"],
  };

  console.log(redisConfig);

  var redisStorage = require('botkit-storage-redis')(redisConfig);
  var controller = Botkit.slackbot({
    debug: true,
    storage: redisStorage
  })

  var bot = controller.spawn({
     token: slack_token
  }).startRTM();
} catch (e) {
  console.log(e);
};


// chat controllers
controller.hears(intent.hello, listenFor, function(bot, message) {
  chat.hello(bot, message, controller);
});

controller.hears(intent.callMe, listenFor, function(bot, message) {
  chat.callMe(bot, message, controller);
});

controller.hears(intent.whoAmI, listenFor, function(bot, message) {
  chat.whoAmI(bot, message, controller);
});


// status controllers
controller.hears(intent.getStatus, listenFor, function(bot, message) {
  status.getStatus(bot, message, controller);
});

controller.hears(intent.list, listenFor, function(bot, message) {
  status.list(bot, message, controller);
});

controller.hears(intent.addService, listenFor, function(bot, message) {
  status.addService(bot, message, controller);
});

controller.hears(intent.setStatus, listenFor, function(bot, message) {
  status.setStatus(bot, message, controller);
});


// utlity controllers
controller.hears(intent.help, listenFor, function(bot, message) {
  utilities.help(bot, message);
});

controller.hears(intent.shutdown, listenFor, function(bot, message) {
  utilities.shutdown(bot, message);
});

controller.hears(intent.uptime, listenFor, function(bot, message) {
     utilities.uptime(bot, message);
});
