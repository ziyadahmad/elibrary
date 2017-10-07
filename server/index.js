var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var nano = require('nano')('http://localhost:5984');
var db = nano.db.use('elibrary');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname + '/../app')));
app.use('/static', express.static(path.join(__dirname, '/../app/assets')))

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/api/loginuser', function (req, res) {
    db.view('designUsers', 'vw_users', {
        'key': req.query.username,        
        'include_docs': false
      }, function(err, body) {
        if (!err) {
          body.rows.forEach(function(doc) {
            if(doc.value.password ==req.query.password){
                res.send({"STATUS":"SUCCESS","Data": doc.value.username});                
            }
            else
            {
                res.send({"STATUS":"INVALID_PASSWORD","Data": ""});
            }
          });

          if(body.rows.length==0){
            res.send({"STATUS":"NOT_FOUND","Data": ""});
          }
        }
      });
});

app.post('/api/registeruser', function (req, res) {
    var data = req.body;
    data["doc_type"] = "Users";

    db.view('designUsers', 'vw_users', {
    }, function (err, body) {
        if (!err) {
            var usercount = pad(body.rows.length + 1, 5);
            db.insert(data, data.username + usercount, function (err, body) {
                if (!err) {

                }
            });
        }
    });

    res.end("SUCCESS");
});

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

app.listen(8080);
