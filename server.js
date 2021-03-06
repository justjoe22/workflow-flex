/*global controldef*/
/* global $ */
/* global res */

var express = require('express');
var app = express();

var jsdom = require('jsdom');
var $ = null;

var firebase = require("firebase");
var controls = require("./controls");


// Initialize Firebase
var config = {
apiKey: "AIzaSyDi-aGkMS311c8s4aHBYMgqc6e1BlJHFlo",
authDomain: "workflow-flex.firebaseapp.com",
databaseURL: "https://workflow-flex.firebaseio.com",
storageBucket: "workflow-flex.appspot.com",
};

/*global firebase*/
firebase.initializeApp(config);

var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// app.use(express.static('public'));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(multer({ dest: 'tmp'}));

// app.get('/index.html', function (req, res) {
//   res.sendFile( __dirname + "/" + "index.html" );
// })

app.post('/login', urlencodedParser, function (req, res) {
    
   // Prepare output in JSON format
   /*global response*/
   response = {
       user_name:req.body.User_Name,
       password:req.body.password
   };
   
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(response.user_name, response.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        console.log(errorCode);
        console.log(errorMessage);
      }
      // [END_EXCLUDE]
    });
    // [END authwithemail]

    res.redirect('/');
})

app.post('/logout', urlencodedParser, function (req, res) {
    
   // Prepare output in JSON format

    firebase.auth().signOut();
     
    res.redirect('/');
   
})

app.get('/', function (req, res) {
  
      firebase.auth().onAuthStateChanged(function(user) {
        var vHtml = '';
          
            if (user) {
                console.log('Success: ' + user.uid);
                
                  vHtml += '<!doctype html>';
                  vHtml += '<html><head><meta charset="UTF-8"><title>Workflow-FLEX</title></head><body>'
                  vHtml += '<br /><p>You are logged in as <b>' + response.user_name + '</b>...</p><br />';
                  vHtml += '<div id="myform"></div>';
                  vHtml += '</body></html>';
                
                   res.send(vHtml);
                  
                  var controlref = firebase.database().ref('control-set/starter');
                  var controlid = "";
                  var controlname = "";
                  var controltype = "";
                  var formname = "";
                  var formid = "";
                  var inputtype = "";
                  
                  controlref.on("value", function(snapshot) {
                      controlid = snapshot.val().controlId;
                      controlname = snapshot.val().controlName;
                      controltype = snapshot.val().controlType;
                      formname = snapshot.val().formName;
                      formid =  snapshot.val().formId;
                      inputtype = snapshot.val().inputType;
                      
                      var cntrlHtml = '<br /><p><b>' + formname + '</b></p><br />';
                      cntrlHtml += controls.controldef(controltype,inputtype,controlname,controlid,'','');
                      cntrlHtml += '<br>';
                      cntrlHtml += '<form action="/logout" name="' + formid + '" method="POST">';
                      cntrlHtml += '<input type="submit" value="Log Out">';
                      cntrlHtml += '</form>';
                      
                      $('#myform').appendTo(cntrlHtml);
                      //$('#myform').html(cntrlHtml);
                      
                    }, function(errorObject) {
                      console.log("The read failed: " + errorObject.code);
                    });
                    
            }
            else {
                console.log('Login Failed.');
                
                  vHtml += '<form action="/login" method="POST">';
                  vHtml += 'User: <input type="email" name="User_Name"><br>';
                  vHtml += 'Password: <input type="password" name="password">';
                  vHtml += '<input type="submit" value="Submit">';
                  vHtml += '</form>';
                  
                  res.send(vHtml);
                  
        }
    });
  
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port
  var url = "https://workflow-flex-justjoe22.c9users.io:" + port;

    jsdom.env(
     url,
     function (err, window) {
       $ = require('jquery')(window);
       
       console.log(err);
     }
    );
    
  console.log("Workflow-Flex listening at https://workflow-flex-justjoe22.c9users.io:" + port + " Host: " + host)

})