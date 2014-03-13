/*global module*/

'use strict';

//Create Test Harness and necessary Bootstrapping

var harness = {

  lib : __dirname + '/../lib/',

  //Automatically Set Warn LogLevel
  setLogLevel : function(level) {
    var logger = require(harness.lib + "adapters/logger");
    logger.setLogLevel(level);
  }
};

//LogLevel Hack For Tests
var logLevelSet = false;
if(!logLevelSet) {
  harness.setLogLevel('INFO');
  logLevelSet = true;
}

module.exports = harness;