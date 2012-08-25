/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
    path = require('path'),
    simplesmtp = require('simplesmtp'),
    MailParser = require('mailparser').MailParser;
var app = express();
app.configure(function () {
    app.set('smtp port', process.env.SMTP_PORT || 4040);
    app.set('port', process.env.PORT || 4000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function () {
    app.use(express.errorHandler());
});
var smtp = simplesmtp.createServer({
    debug: true
}),
    db = [];

function processEmail(email) {
    var headers = [],
        i;
    for (i in email.headers) {
        if (email.headers.hasOwnProperty(i)) {
            headers.push({
                name: i,
                value: email.headers[i]
            });
        }
    }
    email.headers = headers;
}
app.all('*', function (req, res, next) {
    res.charset = 'utf-8';
    next();
});
app.get('/', function (req, res) {
    res.format({
        json: function () {
            res.json(db);
        },
        html: function () {
            res.render('index', {
                smtpPort: app.get('smtp port')
            });
        }
    });
});
smtp.listen(app.get('smtp port'), function (err) {
    smtp.on("startData", function (envelope) {
        envelope.buffer = "";
        envelope.date = new Date();
    });
    smtp.on("data", function (envelope, chunk) {
        envelope.buffer += chunk;
    });
    smtp.on("dataReady", function (envelope, callback) {
        var mailParser = new MailParser();
        mailParser.on('end', function (email) {
            processEmail(email);
            email.date = envelope.date;
            db.push(email);
        });
        mailParser.write(envelope.buffer);
        mailParser.end();
        callback(null);
    });
    http.createServer(app).listen(app.get('port'), function () {
        console.log("Nosey web server listening on port " + app.get('port'));
    });
});
