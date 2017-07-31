// server.js
// where your node app starts

// init project
const express = require('express'),
      mongodb = require('mongodb');
const dburl = '';

const MongoClient = mongodb.MongoClient;
const app = express(),
      router = express.Router();

//regist a tinyurl to database
router.use('/new', (req, res) => {
	MongoClient.connect(dburl, (err, db) => {
	  	if (err) throw err

	  	db.collection('urls').find().toArray((err, docs) => {
	  		const newId = docs[docs.length - 1].url_id + 1;
console.log('url: ' + req.url)
		  	db.collection('urls').insertOne({
				original_url: req.url.slice(1),
				short_url: `https://luffy84217-tinyurl.glitch.me/api/tinyurl/${newId}`,
				url_id: newId
			}).then(doc => {
				console.log(`${req.ip} has registed a new tinyurl:`);
				console.log(doc.ops[0]);
				console.log('\n');
				res.type('json').send(JSON.stringify(doc.ops[0], null, 1));
			});
	  	});
	});
});
//access tinyurl service
router.use('/:id', (req, res) => {
	MongoClient.connect(dburl, (err, db) => {
		if (err) throw err

		db.collection('urls').findOne({
			url_id: +req.params.id
		}).then(doc => {
			if (doc == null) res.type('txt').end("Sorry, you've taken a wrong turn.")
			console.log(`${req.ip} has accessed tinyurl service and redirected to:`);
			console.log(doc.original_url+'\n');
			res.redirect(doc.original_url);
		});
	});
});
//Serve the static files directly by built-in middleware func
app.use('/public', express.static(`${process.cwd()}/public`));
app.use('/api/tinyurl', router);
// Respond not found to all the wrong routes
app.use((req, res) =>{
  res.status(404);
  res.type('txt').send('404 - Page Not Found');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
