/*global process*/

"use strict";

//node
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function RedisClient(options) {
  this.options = options;

  // Call the super EventEmitter constructor.
  EventEmitter.call(this);

  var self = this;
  process.nextTick(function() {
    self.emit('ready');
  });
}

//Inherit EventEmitter Prototype Methods
RedisClient.prototype = Object.create( EventEmitter.prototype );

RedisClient.prototype.psubscribe = function(key) {};
RedisClient.prototype.punsubscribe = function(key) {};

//Test Helper
RedisClient.prototype._triggerMessage = function(pattern, channel, expiredKey) {
  this.emit("pmessage", pattern, channel, expiredKey);
};

module.exports = {

  createClient : function(options) {
    return new RedisClient(options);
  }

};
