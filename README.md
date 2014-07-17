## Redis KeySpace Event Notifier [![Build Status](https://travis-ci.org/iamchrismiller/redis-notifier.png)](https://travis-ci.org/iamchrismiller/redis-notifier)

  Subscribe To Redis Keyspaced Events (v2.8.x)
  Using Redis' Newly Released Keyspaced Events Feature You can now subscribe to events that the server emits
  Depending on the subscription mode you subscribe with when starting the Redis Server.

 `--notify-keyspace-events <options>`

  - K     Keyspace events, published with __keyspace@<db>__ prefix.
  - E     Keyevent events, published with __keyevent@<db>__ prefix.
  - g     Generic commands (non-type specific) like DEL, EXPIRE, RENAME, ...
  - $     String commands
  - l     List commands
  - s     Set commands
  - h     Hash commands
  - z     Sorted set commands
  - x     Expired events (events generated every time a key expires)
  - e     Evicted events (events generated when a key is evicted for maxmemory)
  - A     Alias for g$lshzxe, so that the "AKE" string means all the events.

## Getting Started

Using NPM + Package.json, simply just run `npm install`

If you are using `node_redis` pre `v0.11.0` checkout the tag `v0.1.2`

## Usage / Configuration

  Start Redis Server : `redis-server CONF --notify-keyspace-events KExe`

  ```javascript
  var redis = require('redis');
  var RedisNotifier = require('redis-notifier');

  var eventNotifier = new RedisNotifier(redis, {
    redis : { host : '127.0.0.1', port : 6379 },
    expired : true,
    evicted : true,
    logLevel : 'DEBUG' //Defaults To INFO
  });

  //Listen for event emission
  eventNotifier.on('message', function(pattern, channelPattern, emittedKey) {
    var channel = this.parseMessageChannel(channelPattern);
    switch(channel.key) {
      case 'expired':
          this._handleExpired(emittedKey);
        break;
      case "evicted":
        this._handleEvicted(emittedKey);
        break;
      default:
        logger.debug("Unrecognized Channel Type:" + channel.type);
    }
  });
  ```

## Contributing
In lieu of a formal style-guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using grunt.

## Release History

- 0.2.0 updated node_redis connection args, added deinit method
- 0.1.2 updated logger interface
- 0.1.1 changed expire attribute to expired
- 0.1.0 Initial release

## License

Licensed under the Apache 2.0 license.

## Author

Chris Miller
