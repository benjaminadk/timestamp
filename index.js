'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');


module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
		
		
    app.route('/:date')
    	.get(function(req,res){
    		let date = req.params.date
    		const format = {
    			month: 'long',
    			day: 'numeric',
    			year: 'numeric'
    		}
    		if(isNaN(date)){
          var naturalDate = new Date(date);
           if (naturalDate == "Invalid Date"){
                naturalDate = null;
                unixDate = null; 
           }else{
    		naturalDate = naturalDate.toLocaleDateString('en-us', format);
		    var unixDate = new Date(date).getTime()/1000;
    }
           }else{
            var unixDate = date;
            var naturalDate = new Date(date *1000);
            naturalDate = naturalDate.toLocaleDateString('en-us', format);
  }
  
  res.json({
  	'unix': unixDate,
  	'natural': naturalDate
  })

    
    		
    	
    	
    	
    		})
    	
};
