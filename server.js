//setting up a local authentication

var express = require('express');   //mpm install each
var session = require('express-session');
var bodyParser = require('body-parser')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;  //using a local storage for encryption
var mongoose = require('mongoose');

var User = require('./api/models/User');  //since referencing User.findOne (line 20), we need to require the folder for User.
var TodoController = require('./api/controllers/TodoController')
var UserController = require('./api/controllers/UserController') //allows the app to use the controllers in this file

mongoose.connect('mongodb://localhost/todos');

passport.use(new LocalStrategy({
	usernameField: 'email',     //defining that we are using username as email. Otherwsise 
	passwordField: 'password'
}, function(username, password, done) {
	User.findOne({ email: username }).exec().then(function(user) {  //exec() executes the query  //this line runs a query to test the password and username in the database
		if (!user) {   //if no user, return done
			return done(null, false);
		}
		user.comparePassword(password).then(function(isMatch) {
			if (!isMatch) {      //if user info does not match, return error
				return done(null, false);
			}
			return done(null, user);
		});
	});
}));

passport.serializeUser(function(user, done) {
	//input user model (mongoose)
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	//user object (json)
	done(null, obj);
});


var app = express();
app.use(express.static(__dirname+'/public'));   // this is middleware that only allows the user to access the public folder. Add to a saved profile. 
app.use(bodyParser.json());
app.use(session({
	secret: 'abc123iliketodos12345679'
}));
app.use(passport.initialize());
app.use(passport.session());


app.post('/api/auth', passport.authenticate('local'), function(req, res) {  //authenticating a user    //if using OAuth, you would use GET method.
	//if auth was successful, this will happen
	return res.status(200).end();
});

app.post('/api/register', function(req, res) {
	//create a user
	var newUser = new User(req.body);
	newUser.save(function(err, user) {
		if (err) {
			return res.status(500).end();  //if err, return "500" or there is options to provide a message(view docs for local auth)
		}
		return res.json(user);
	});
});

var isAuthed = function(req, res, next) {    //middleware you can run to make sure a user is logged in
	if (!req.isAuthenticated()) {
		return res.status(403).end();
	}
	return next();
};

app.get('/api/todos', isAuthed, TodoController.list);     //fetches a list of todos for user  //isAuthed checks to make sure they are logged in
app.post('/api/todos', isAuthed, TodoController.create);	//creates a new todo

app.put('/api/todos/:id', isAuthed, TodoController.update);		//save and updates the todo item

app.get('/api/profile', isAuthed, UserController.profile);		//return users profile


app.listen(8080);