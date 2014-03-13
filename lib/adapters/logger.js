/*global module, require, __dirname*/


//npm
var log4js = require('log4js');

//Load log4 Config
log4js.configure(__dirname + '/../../log4js.json');

//Global LogLevel
var logLevel = log4js.levels.DEBUG;

var logger = {

  _instances : [],

  getInstance : function (name) {
    if (!this._instances[name]) {
      this._instances[name] = log4js.getLogger(name);
    }
    this._instances[name].setLevel(logLevel);
    return this._instances[name];
  },

  setLogLevel : function (level) {
    level = level.toUpperCase();
    if (Object.keys(log4js.levels).indexOf(level) !== -1) {
      //Set Global For All New Loggers
      logLevel = level;
      //Set All Active Logger Levels
      for (var instName in this._instances) {
        this._instances[instName].setLevel(logLevel);
      }
    } else {
      throw new Error("Log Level %s not recognized", level);
    }
  }
};

/**
 * Log4js Wrapper
 * @param loggerName
 * @returns {Logger}
 */
module.exports = {

  getInstance : function (loggerName) {
    return logger.getInstance(loggerName);
  },

  setLogLevel : function (level) {
    logger.setLogLevel(level);
  }
};
