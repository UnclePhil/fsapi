var config = {};

// default config
config.port    = 8000;
config.actfs   = "/mnt"
config.fsmode = '0777'

// security implementation
config.mdtoken = "TheDefaultTokenMD";
config.rmtoken = "TheDefaultTokenRM";

module.exports = config;