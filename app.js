var express    = require('express');        // call express
var app        = express();                 // define our app using express
var crypto 	   = require('crypto');

var port = process.env.PORT || 8080;        // set our port

var router = express.Router();              // get an instance of the express Router

router.get('/signature', function(req, res) {
	try {
		if(req && req.query) {
			if(req.query['apikey'] && req.query['secret']) {
				var apikey = "" +  req.query['apikey'];
				var secret = "" + req.query['secret'];
				var time = Math.floor(new Date() / 1000);
				var txt = apikey + secret + time;
				
				var xsignature = crypto.createHash('sha256').update(txt.replace(' ', '')).digest('hex');
				res.json({ 'Info': 'Signature for APIs Request Header', 'X-Signature': xsignature });  
			} else {
				res.status(400);
				res.json({ 'Info': 'Signature for APIs Request Header', 'ERROR': 'Api-key and Secret are mandatory' });
			}
		} else {
			res.status(400);
			res.json({ 'Info': 'Signature for APIs Request Header', 'ERROR': 'Request params are mandatory' });  
		}
	} catch (e)	 {
		res.status(500);
		console.log("Error", e);
		res.json({'Info': 'Signature for APIs Request Header', 'ERROR': 'Crypto error'})
	}
});

app.use('/generator', router);
app.listen(port);
console.log('App listen on port ' + port);