/*global controldef*/

var express = require('express');
var app = express();

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

firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Success: ' + user.uid);
            
        }
        else {
            console.log('Login Failed.');
        }
});

var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(multer({ dest: 'tmp'}));

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/login_post', urlencodedParser, function (req, res) {
    
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
   
   //console.log(response);
   var vHtml = '<br /><p>You are logged in as <b>' + response.user_name + '</b>...</p><br />';
   vHtml += '<br /><p><b>My Form</b></p><br />';
   vHtml += controls.controldef('input','text','Sample','myID','');
   
   res.end(vHtml);
   
})

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})


// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");
   res.send('Page Listing');
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Workflow-Flex listening at https://workflow-flex-justjoe22.c9users.io:" + port + " Host: " + host)

})