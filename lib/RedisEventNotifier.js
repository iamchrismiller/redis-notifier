/*global require, module*/

//node
var EventEmitter = require('events').EventEmitter;
//npm
var extend = require('extend');
//local
var logger = require('./adapters/logger');


/**
 * Redis Event Notifier
 * Subscribe to Redis Keyspace Notifications(v2.8.x)
 * @param redis
 * @param options
 * @constructor
 */
function RedisNotifier(redis, options) {

  this.options = extend(true, {
    redis   : {
      host : 'localhost',
      port : 6379,
      db   : 0
    },
    expired  : true,
    evicted : true,
    logger : {
      level : 'DEBUG'
    },
  }, options || {});

  // logger.setLogLevel(this.options.logger.level);
  logger = logger.getInstance('redis-event-notifier');

  //Require Redis if its not injected
  if (typeof redis === 'undefined') {
    throw new Error("You must provide a Redis module");
  }

  //The Redis Subscriber Instance
  logger.info("Initializing" + JSON.stringify(this.options));

  // Call the super EventEmitter constructor.
  EventEmitter.call(this);

  this.subscriber = redis.createClient(this.options.redis);

  this.subscriber.on('ready', function () {
    logger.info("Redis Subscriber Ready");
    //Subscribe To Expired/Evicted Events
    this._subscribeToEvents.call(this);
  }.bind(this));

  //Bind To Redis Store Message Handler
  this.subscriber.on("pmessage", function (pattern, channel, key) {
    logger.info("Received Message" + JSON.stringify(arguments));
    this.emit('message', pattern, channel, key);
  }.bind(this));
}

//Inherit From The EventEmitter Prototype
RedisNotifier.prototype = Object.create(EventEmitter.prototype);

/**
 * Subscribe to Expired/Evicted Events
 * Emitted From Redis
 * @private
 */
RedisNotifier.prototype._subscribeToEvents = function () {
  logger.info("Subscribing To Events");
  //events generated every time a key expires
  if (this.options.expired) {
    this._subscribeKeyevent('expired');
  }
  //events generated when a key is evicted for max-memory
  if (this.options.evicted) {
    this._subscribeKeyevent('evicted');
  }
};

/**
 * Parse The Type/Key From ChannelKey
 * @param channel
 * @returns {{type: *, key: *}}
 */
RedisNotifier.prototype.parseMessageChannel = function (channel) {
  //__keyevent@0__:expired
  var re = /__([a-z]*)+@([0-9])+__:([a-z]*)/i;
  var parts = channel.match(re);

  return {
    type : parts[1],
    key  : parts[3]
  };
};

/**
 * Subscribe To Specific Redis Keyspace Event
 * @param key
 * @private
 */
RedisNotifier.prototype._subscribeKeyspace = function (key) {
  var subscriptionKey = "__keyspace@" + this.options.redis.db + "__:" + key;
  logger.info("Subscribing To Event " + subscriptionKey);
  this.subscriber.psubscribe(subscriptionKey);
};

/**
 * UnSubscribe To Specific Redis Keyspace Event
 * @param key
 * @private
 */
RedisNotifier.prototype._unsubscribeKeyspace = function (key) {
  var subscriptionKey = "__keyspace@" + this.options.redis.db + "__:" + key;
  logger.info("UnSubscribing From Event " + subscriptionKey);
  this.subscriber.punsubscribe(subscriptionKey);
};

/**
 * Subscribe To KeyEvent (Expired/Evicted)
 * @param key
 * @private
 */
RedisNotifier.prototype._subscribeKeyevent = function (key) {
  var subscriptionKey = "__keyevent@" + this.options.redis.db + "__:" + key;
  logger.info("Subscribing To Event :" + subscriptionKey);
  this.subscriber.psubscribe(subscriptionKey);
};


/**
 * UnSubscribe To KeyEvent (Expired/Evicted)
 * @param key
 * @private
 */
RedisNotifier.prototype._unsubscribeKeyevent = function (key) {
  var subscriptionKey = "__keyevent@" + this.options.redis.db + "__:" + key;
  logger.info("UnSubscribing From Event :" + subscriptionKey);
  this.subscriber.punsubscribe(subscriptionKey);
};


module.exports = RedisNotifier;