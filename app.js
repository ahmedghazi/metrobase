

const express = require('express');
const config = require('./config/config');
const glob = require('glob');
const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || config.db, {
//mongoose.connect("mongodb+srv://test:PmAD91J5CQVM2qi1@cluster0-28lin.gcp.mongodb.net/test?retryWrites=true&w=majority", {
  reconnectTries: 100,
  reconnectInterval: 500,
  autoReconnect: true,
  useNewUrlParser: true,
  dbName: 'metrobase'
});
const db = mongoose.connection;
db.once('open', function ()
{
  console.log('-----------------------mongoose open test');
});
db.on('error', () => {
  console.log('-----------------------mongoose error ');
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
const app = express();

app.use(function(req, res, next){
	req.resetDb = function(){
	  mongoose.connection.db.dropDatabase();
	}
	return next();
})

module.exports = require('./config/express')(app, config);



app.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});

