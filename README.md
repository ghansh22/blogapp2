# blogapp
This is a single page blog web application developed using MongoDb, Angular Js 2, Express Js, Node Js

The deployed version of this application can be found here https://protected-brook-27447.herokuapp.com/

# Requirements
NodeJs,
Npm,
MongoDb,
angular cli

# Installation
1. install backend dependencies using following command:</br>
$npm install
2. install angular 2 depenedencies using following command:</br>
$cd client/ </br>
$npm install</br>

When installation is complete, navigate to root directory of the app
and run:</br>
$npm run start</br>
$npm build</br>
and open in browser</br>
http://localhost:8080

This application provides email verfication, to enable this please navigate to dir </br>
/routes/authentication.js </br>
open authentication.js file and find letMail function </br>
replace email and password with your own email and password to send the user verification code.




