'use strict';

var path = require('path')
  , winston = require('winston')
  , extend = require('node.extend')
  , expressWinston = require('express-winston')
  , init
;

function ExpressLogger(options){
  var self = this
    , logsDir
  ;
  options = self.options = extend(true, {}, self.options, options);
  self.logsDir = logsDir = path.join(options.dataDir, options.logsDir);
  init.apply(self, [options]);
  return self;
}

extend(ExpressLogger.prototype, {
  constructor: ExpressLogger
, options: {
    dataDir: __dirname
  , logsDir: 'logs'
  , generalLog: 'general.log'
  , accessLog: 'access.log'
  , errorLog: 'error.log'
  }
});

init = function(){
  var self = this
    , options = self.options
    , logsDir = self.logsDir
    , logger
  ;
  logger = new (winston.Logger)({
    exitOnError: false
  , transports: [
      new winston.transports.Console({
        colorize: true
      , level: 'debug'
      , handleExceptions: true
      })
    , new winston.transports.File({
        filename: path.join(logsDir, options.generalLog)
      , colorize: true
      , maxsize: 1024
      , handleExceptions: true
      })
    ]
  });
  self.requestLogger = expressWinston.logger({
    transports: [
      new winston.transports.File({
        filename: path.join(logsDir, options.accessLog)
      , maxsize: 1024
      , timestamp: true
      })
    ]
  });
  self.errorLogger = expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        colorize: true
      })
    , new winston.transports.File({
        filename: path.join(logsDir, options.errorLog)
      , maxsize: 1024
      , timestamp: true
      })
    ]
  });
  self.debug = logger.debug;
  self.info = logger.info;
  self.warn = logger.warn;
  self.error = logger.error;
};

module.exports = function(options){
  return new ExpressLogger(options);
};
