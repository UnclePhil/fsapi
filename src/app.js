"use strict";
process.EventEmitter = require('events').EventEmitter; 
const logger = require('console-server');
const fs = require('fs-extra')
const rimraf = require('rimraf')
const restify = require('restify');
const path = require('path')
const DEBUG = true

// application config
// Load config/config.js
const cfg = require('./config/config.js')

// apply  
const ACTFS = cfg.actfs;
const PORT = cfg.port
const MDTOKEN = cfg.mdtoken ;
const RMTOKEN = cfg.rmtoken ;

const BUILD = process.env.BUILD || "Unknow"

// application infos 
const appinfos={"app":"fsapi","build":BUILD,"Author":"Unclephil","port":PORT,"actfs":ACTFS}


/// == Functions std === 


//==== INFOS =============================
function infos(req, res, next) {
  logreq(req);
  res.send(appinfos);
  next();
}
//=== LS =================================
// return only Directories
function api_ls(req, res, next) {
  logreq(req);
  const rdir= req.getPath() || ""
  const ndir = path.join(ACTFS, rdir);
  var files={} ;
  try {
    if (fs.existsSync(ndir)) {
      files=fs.readdirSync(ndir, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
      res.send({"action":"ls","dir":rdir,"exist":true,"content":files});
    }
    else {
      res.status(404)
      res.send({"action":"ls","dir":rdir,"exist":false});
    }
  } catch(e) {
    logger.error("MD An error occurred: "+e)
    res.status(500)
    res.send('Uncontrolled error occurred - ls');
  }  
  next();
}

//=== EXIST ===============================
function api_exist(req, res, next) {
  logreq(req);
  var resp = {}
  const rdir= req.getPath() || ""
  const ndir = path.join(ACTFS, rdir);
  try {
    if (fs.existsSync(ndir) ) {
      resp = {"action":"ex","dir":rdir,"exist":true}
      res.send(resp);
    } else {
      resp = {"action":"ex","dir":rdir,"exist":false}
      res.status(404)
      res.send(resp);
    }
    
  } catch(e) {
    logger.error("EXIST An error occurred: "+ e)
    res.status(500)
    res.send('Uncontrolled error occurred - exist');
  }

  next();
}

//=== MKDIR ===============================
function api_md(req, res, next) {
  logreq(req);
  const rdir= req.getPath() || ""
  const tk = req.headers.token || ""
  const ndir = path.join(ACTFS, rdir);
    try {
      if(tk == MDTOKEN){
        if (!fs.existsSync(ndir)) {
        fs.mkdirSync(ndir, {
          recursive: true
        });
        res.send({"action":"md","dir":rdir,"exist":true, "created":true})
        }
        else {
          res.status(404)
          res.send({"action":"md","dir":rdir,"exist":true, "created":false})
        }
      } else {
        logger.warn("HACKING with token: "+tk) 
        res.status(403)
        res.send({"action":"md","dir":rdir,"exist":"unknow", "msg":"Not Authorized"})
      }
  } catch(e) {
    logger.error("MD An error occurred: "+e)
    res.status(500)
    res.send('Uncontrolled error occurred - md');
  }  
  next();
}

//=== RM ===============================
function api_rm(req, res, next) {
  logreq(req);
  const rdir= req.getPath() || ""
  const tk = req.headers.token || ""
  const rmdir = path.join(ACTFS, rdir);
    try {
      if(tk == RMTOKEN){
        //check if requested dir exist
        if (fs.existsSync(rmdir))  {
          // avoid remove of ACTFS main dir 
          if (rmdir != ACTFS) {
            rimraf.sync(rmdir)
            res.send({"action":"rm","dir":rdir,"exist":true, "removed":true})
          } else {
            res.status(403)
            res.send({"action":"rm","dir":rdir,"exist":true, "removed":false})
          }
        } else {
          res.status(404)
          res.send({"action":"rm","dir":rdir,"exist":true,"removed":false})
        }
      } else {
        logger.warn("HACKING with token: "+tk) 
        res.status(403)
        res.send({"action":"rm","dir":rdir,"exist":"unknow", "msg":"Not Authorized"})
      }
  } catch(e) {
    logger.error("RM An error occurred: "+e)
    res.status(500)
    res.send('Uncontrolled error occurred - rm');
  }  
  next();
}

// == function error mgt ==
function logerror(req, res, err, callback) {
  logger.error(err.name,err.message)
  callback();
}

function logreq(req) {
  logger.info(req.connection.remoteAddress,req.method,req.headers.host,req.url,req.userAgent())
}

/// == ROUTES =================================================================================
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(restify.plugins.pre.sanitizePath());

server.head('/', infos);
server.get('/*', api_ls);
// server.head('/*', api_exist)
server.post('/*', api_md);
server.del('/*', api_rm);

server.listen(PORT, function() {
  logger.info('fsapi listening :', server.url,'build :', BUILD,'Fs', cfg.actfs ,'tokens', cfg.mdtoken.substr(-5), cfg.rmtoken.substr(-5));
});

server.on('restifyError', logerror);