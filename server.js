//  OpenShift sample Node application
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//express for image in formidable
var formidable = require('express-formidable');
//middlewares
var session_middleware = require('./middlewares/session');
//jquery
var jquery = require('jquery');
//db - models
var mongoose = require('mongoose');
var Register = require('./models/users').Register;
//engine views
var hbs = require('express-handlebars')
//session
var cookieSession = require('cookie-session');
//var RedisStore = require('connect-redis')(session);
//var realtime = require('./realtime');
//routes
var index = require('./routes/index');
var users = require('./routes/users');
var router_app = require('./routes/router_app');
//servidor http / Socket Server comunication
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var app = express();

/*mongoose*/
var mongoose   = require('mongoose');

var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME,
    port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    url = process.env.OPENSHIFT_MONGODB_DB_URL +
    process.env.OPENSHIFT_APP_NAME;
}

// Connect to mongodb
var connect = function () {
    mongoose.connect(url);
};
connect();

var db = mongoose.connection;

db.on('error', function(error){
    console.log("Error loading the db - "+ error);
});

db.on('disconnected', connect);

Object.assign=require('object-assign')

// Engine of Handlebars
app.engine('hbs', hbs({
  extname:'hbs',
  defaultLayout: 'main',
  layoutsDir:__dirname + '/views/layouts'}
));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//methodOverride middlewares
app.use(methodOverride("_method"));
//session
app.use(cookieSession({
  name: "session",
  keys: ["llave-1", "llave-2"]
}));
//formidable
app.use( formidable.parse({ keepExtensions: true }));
//routes
app.use('/', index);
app.use('/users', users);
app.use('/app', session_middleware);
app.use('/app', router_app);


//app.engine('html', require('ejs').renderFile);
//redis
/*var sessionMiddleware = session({
  store: new RedisStore({}),
  secret: "Hola ladron",
  saveUninitialized: false,
  resave: false
});*/
//realtime(server, sessionMiddleware);

/*var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

  /*  var url = '127.0.0.1:27017/' + process.env.OPENSHIFT_APP_NAME;

    // if OPENSHIFT env variables are present, use the available connection info:
    if (process.env.OPENSHIFT_MONGODB_DB_URL) {
        url = process.env.OPENSHIFT_MONGODB_DB_URL +
        process.env.OPENSHIFT_APP_NAME;
    }*/


/*if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
 if (mongoURL == null) return;

  var mongodb = require('mongoose');
  if (mongodb == null) return;
  // Connect to mongodb
/*  var connect = function () {
      mongoose.connect(url);
  };
  connect();

  var db = mongoose.connection;

  db.on('error', function(error){
      console.log("Error loading the db - "+ error);
  });

  db.on('disconnected', connect);*/
/*mongoose.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};
*/
//pagecount
app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});
// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});
/*initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});*/

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
