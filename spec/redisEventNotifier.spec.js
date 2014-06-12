/*global process, describe */
'use strict';

//Test Harness Containing Pointer To Lib
var harness = require('./test.harness'),
 RedisEventNotifier = require(harness.lib + 'RedisEventNotifier'),
 redis = require('./mocks/redis'),
 notifierOptions = {logLevel : 'DEBUG'};

//Connection Test Suite
describe('RedisEventNotifier Suite', function () {

  it('Should have a construct and throw an error if redis instance is not supplied', function () {
    expect(function () {
      new RedisEventNotifier(null, notifierOptions);
    }).toThrow(new Error("You must provide a Redis module"));
  });

  it('Should evaulate the channel response correctly for parseMessageChannel', function () {
    var eventNotifier = new RedisEventNotifier(redis, notifierOptions);

    var expiredKeyTest = eventNotifier.parseMessageChannel('__keyevent@0__:expired');
    expect(expiredKeyTest.key).toBe('expired');
    expect(expiredKeyTest.type).toBe('keyevent');

    var evictedKeyTest = eventNotifier.parseMessageChannel('__keyevent@0__:evicted');
    expect(evictedKeyTest.key).toBe('evicted');
    expect(evictedKeyTest.type).toBe('keyevent');
  });

  it('Should emit a "message" event when a key expires', function (done) {
    var eventNotifier = new RedisEventNotifier(redis, notifierOptions);

    process.nextTick(function () {
      //trigger expire message (test helper)
      eventNotifier.subscriber._triggerMessage('__keyevent@0__:expired', '__keyevent@0__:expired', 'test.key');
    });

    eventNotifier.on('message', function (pattern, channel, key) {
      expect(pattern).toBe('__keyevent@0__:expired');
      expect(channel).toBe('__keyevent@0__:expired');
      expect(key).toBe('test.key');
      done();
    });
  });

  it('Should emit a "message" event when a key is evicted', function (done) {
    var eventNotifier = new RedisEventNotifier(redis, notifierOptions);

    process.nextTick(function () {
      //trigger expire message (test helper)
      eventNotifier.subscriber._triggerMessage('__keyevent@0__:evicted', '__keyevent@0__:evicted', 'test.key');
    });

    eventNotifier.on('message', function (pattern, channel, key) {
      expect(pattern).toBe('__keyevent@0__:evicted');
      expect(channel).toBe('__keyevent@0__:evicted');
      expect(key).toBe('test.key');
      done();
    });
  });

});

