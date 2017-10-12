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

nano.db.get('elibrary', function (err, body) {
    if (err && err.message === "no_db_file") {
        nano.db.create('elibrary', function (err, body) {
            if (!err) {
                console.log('database elibrary created!');
            }
        });
    } else {
        console.log('database already exists!');
    }
});

/*global emit*/
 db.insert(
  { "views": 
    { "vw_users": 
      { "map": function(doc) { 
          emit(doc._id,[doc.username, doc.password] ); 
        } 
      } 
    }
  }, '_design/designUsers', function (error, response) {
    console.log("yay");
  });

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/api/loginuser', function (req, res) {
    var response;

    db.view('designUsers', 'vw_users', {
        'key': req.query.username,
        'include_docs': false
    }, function (err, body) {
        if (!err) {
            body.rows.forEach(function (doc) {
                if (doc.value.password == req.query.password) {
                    response = { "STATUS": "SUCCESS", "Data": doc.value.username }                    
                }
                else {
                    response = { "STATUS": "INVALID_PASSWORD", "Data": "" };
                }
            });

            if (body.rows.length == 0) {
                response = { "STATUS": "NOT_FOUND", "Data": "" };
            }
        }
        
        res.end(JSON.stringify(response));
    });
});

app.post('/api/registeruser', function (req, res) {
    var data = req.body;
    data["doc_type"] = "Users";
    data["is_active"] = true;
    db.view('designUsers', 'vw_users', {
    }, function (err, body) {
        if (!err) {
            var response;

            for (var i = 0, len = body.rows.length; i < len; i++) {                
                
                if(body.rows[i].key===data.username){
                    response = ({ "STATUS": "EXISTS", "Data": "" });
                    res.end(JSON.stringify(response));
                    return;
                }
            }
            
            var userID = data.username + "-" + pad(body.rows.length + 1, 5);

                db.insert(data, userID, function (err, body) {
                    if (!err && body.ok) {
                        response = ({ "STATUS": "SUCCESS", "Data": body.id });
                    } else {
                        response = ({ "STATUS": "FAILED", "Data": "" });
                    }

                    res.end(JSON.stringify(response));
                });
        }
    });
});

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

app.listen(8080);
