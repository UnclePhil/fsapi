"use strict";
process.EventEmitter = require('events').EventEmitter; 
const logger = require('console-server');
const fs = require('fs')
const restify = require('restify');
const path = require('path')
const DEBUG = true

// application config


const ACTFS = process.env.FSAPI_FS || 'test';
const PORT = process.env.FSAPI_PORT || 8000 ;
const BUILD = process.env.BUILD || "Unknow"

// application infos 
const appinfos={"app":"fsapi","build":BUILD,"port":PORT,"actfs":ACTFS}


/// == Functions std === 


//==== INFOS =============================
function infos(req, res, next) {
  logreq(req);
  res.send(appinfos);
  next();
}
//=== LS =================================
function api_ls(req, res, next) {
  logreq(req);
  const rdir= req.params.dir || ""
  const ndir = path.join(ACTFS, rdir);
  var files={} ;
  //logger.warn("req.params", req.params);
  //logger.warn("rdir", rdir);
  //logger.warn("ndir", ndir);
  try {
    if (fs.existsSync(ndir)) {
      fs.readdir(ndir, function (err, files) {
        //handling error
          res.send({"action":"ls","dir":rdir,"content":files});
      });
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


//=== LD =================================
// TBC
function api_ld(req, res, next) {
  logreq(req);
  const rdir= req.params.dir || ""
  const ndir = path.join(ACTFS, rdir);
  var files={} ;
  try {
    if (fs.existsSync(ndir)) {
      
      fs.readdir(ndir, function (err, files) {
        //handling error
          res.send({"action":"ld","dir":rdir,"content":files});
      });
    }
    else {
      res.status(404)
      res.send({"action":"ld","dir":rdir,"exist":false});
    }
  } catch(e) {
    logger.error("LD An error occurred: "+e)
    res.status(500)
    res.send('Uncontrolled error occurred - ld');
  }  
  next();
}

//readdirSync(source, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)

//=== EXIST ===============================
function api_exist(req, res, next) {
  logreq(req);
  var resp = {}
  try {
    if (fs.existsSync(path.join(ACTFS, req.params.dir))) {
      resp = {"action":"ex","dir":req.params.dir,"exist":true}
      res.send(resp);
    } else {
      resp = {"action":"ex","dir":req.params.dir,"exist":false}
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
  const ndir = path.join(ACTFS, req.params.dir);
  try {
    if (!fs.existsSync(ndir)) {
      fs.mkdirSync(ndir, {
        recursive: true
      });
      res.send({"action":"md","dir":req.params.dir,"exist":true, "created":true})
    }
    else {
      res.status(404)
      res.send({"action":"md","dir":req.params.dir,"exist":true, "created":false})
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
//server.use(restify.plugins.CORS());

server.get('/', infos);
server.get('/ls/', api_ls);
server.get('/ls/:dir', api_ls);
server.get('/ld/', api_ld);
server.get('/ld/:dir', api_ld);
server.get('/ex/:dir', api_exist)
server.post('/md/:dir', api_md);

server.listen(PORT, function() {
  logger.info('%s listening at %s', server.name, server.url);
});

server.on('restifyError', logerror);