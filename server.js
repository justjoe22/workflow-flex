var express = require('express');
var app = express();
var fs = require("fs");

var firebase = require("firebase");

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
var multer  = require('multer');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(multer({ dest: 'tmp'}));

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/process_post', urlencodedParser, function (req, res) {
    
    var varUser;
    var varPassword;
    
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
   res.end('<p><b>' + JSON.stringify(response) + '</b></p>');
})

app.post('/file_upload', function (req, res) {

   console.log(req.files.file.name);
   console.log(req.files.file.path);
   console.log(req.files.file.type);

   var file = __dirname + "/" + req.files.file.name;
   fs.readFile( req.files.file.path, function (err, data) {
        fs.writeFile(file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully',
                   filename:req.files.file.name
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
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

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Workflow-Flex listening at https://workflow-flex-justjoe22.c9users.io:" + port + " Host: " + host)

})