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

    /*global emit*/
    db.insert(
        {
            "views":
            {
                "vw_credentials":
                {
                    "map": function (doc) {
                        if (doc.doc_type == "Users" && doc.is_active) {
                            emit(doc.username, {
                                username: doc.username,
                                password: doc.password
                            });
                        }
                    }
                },
                "vw_users":
                {
                    "map": function (doc) {
                        if (doc.doc_type == "Users" ) {
                            emit(doc.username, {
                                _id: doc._id,
                                username: doc.username,
                                password: doc.password,
                                fname: doc.fname,
                                lname: doc.lname,
                                email: doc.email,
                                phone: doc.phone,
                                is_active:doc.is_active
                            });
                        }
                    }
                }
            }
        }, '_design/designUsers', function (error, response) {
            console.log("yay");
        });
});

app.get('/', function (req, res) {
    res.sendFile('index.html');
});

app.get('/api/UpdateUser', function (req, res) {
    var data = req.query;
    data["doc_type"]= "Users";
    data["is_active"]= true;    

    var response;

    db.get(data._id, function (err, body) {
        if (err) {
            response = JSON.stringify({ STATUS: "FAILED", MESSAGE: "User not found to udpate " });
            res.send(200, response);
        }

        updaterev =body._rev;
        var param = {};        
        data["_rev"] =updaterev;
        db.insert(data,data._id, function(err, body) {
            if (!err)
            {                
                response = JSON.stringify({ STATUS: "SUCCESS", MESSAGE: body._id + " Updated Successfully !! " });
                res.send(200, response);                
            }
            else
            {
                response = JSON.stringify({ STATUS: "FAILED", MESSAGE: "Updated Failed !! " });
                res.send(200, response);                
            }
        });
    });
});

app.get('/api/DeleteUser/:id', function (req, res) {

    var userid = req.params.id;
    var response;

    db.get(userid, function (err, body, header) {
        if (err) {
            response = JSON.stringify({ STATUS: "FAILED", MESSAGE: "User not found to delete " });
            return res.send(200, response);
        }

        updaterev =body._rev;

        var param = {};        
        body["_rev"] =updaterev;
        body["is_active"] = false;
        db.insert(body,body._id, function(err, body) {
            if (!err)
            {                
                response = JSON.stringify({ STATUS: "SUCCESS", MESSAGE: body._id + " Updated Successfully !! " });
                res.send(200, response);                
            }
            else
            {
                response = JSON.stringify({ STATUS: "FAILED", MESSAGE: "Updated Failed !! " });
                res.send(200, response);                
            }
        });

        // db.destroy(body._id, body._rev, function (err, body, header) {
        //     if (err) {
        //         response = JSON.stringify({ STATUS: "FAILED", MESSAGE: "unable to delete " + body._id });
        //         return res.send(200, response);
        //     }
        //     response = { STATUS: "SUCCESS", MESSAGE: "Deleted " + body.id };
        //     return res.send(200, response);
        // });
    });
});

app.get('/api/loginuser', function (req, res) {
    var response;

    db.view('designUsers', 'vw_credentials', {
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

app.get('/api/GetUsers', function (req, res) {
    db.view('designUsers', 'vw_users', function (err, body) {
        var data = [];
        if (!err) {
            body.rows.forEach(function (doc) {
                data.push(doc.value);
            });

            res.end(JSON.stringify(data));
        }
    });
});

app.post('/api/registeruser', function (req, res) {
    var data = req.body;
    data["doc_type"] = "Users";
    data["is_active"] = true;
    data["role"] ="Reader";

    db.view('designUsers', 'vw_users', {
    }, function (err, body) {
        if (!err) {
            var response;

            for (var i = 0, len = body.rows.length; i < len; i++) {

                if (body.rows[i].key === data.username) {
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
