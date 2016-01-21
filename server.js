var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express();

require('mongoose').Promise = require('q').Promise;

var port = process.env.PORT || 3001;

mongoose.connect('mongodb://172.17.0.2:27017/mean-auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(require('./routes'));

process.on('uncaughtException', function(err) {
    console.log(err);
});

// Start Server
app.listen(port, function () {
    console.log( 'Express server listening on port ' + port);
});

