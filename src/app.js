"use strict";
process.EventEmitter = require('events').EventEmitter; 
const logger = require('console-server');
const fs = require('fs-extra')
const restify = require('restify');
const path = require('path')
const DEBUG = true

// application config

const ACTFS = process.env.FSAPI_FS || 'test';
const PORT = process.env.FSAPI_PORT || 8000 ;
const MDTOKEN = process.env.FSAPI_MDTOKEN || "ThisIStheDEFaultMDToken" ;
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
  const rdir= req.query.dir || ""
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
  const rdir= req.query.dir || ""
  const ndir = path.join(ACTFS, rdir);
  try {
    if (fs.existsSync(ndir)) {
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
  const rdir= req.query.dir || ""
  const tk = req.query.token || ""
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

server.get('/', infos);
server.get('/ls', api_ls);
server.get('/ex', api_exist)
server.post('/md', api_md);

server.listen(PORT, function() {
  logger.info('%s listening at %s', server.name, server.url);
});

server.on('restifyError', logerror);