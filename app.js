var express = require('express');

var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

// middleware to use for all requests
router.use(express.static(__dirname));

router.get('/result', function(req, res) {
	fs.readFile('history.data', function (err, data) {
	    if (err) {
	    	res.json({success: false});
	    }
	    else {
	    	var results = [];
	    	lines = data.toString().split("\n");
	    	for(num in lines) {
	    		try {
	    			result = JSON.parse(lines[num]);
	    			results.push(result);
	    		}catch(e) {

	    		}
	    	}
	    	res.json(results);
	    }
	});
});

router.post('/result', function(req, res) {
	fs.appendFile('history.data', JSON.stringify(req.body) + "\n", encoding='utf8', function (err) {
	    if (err) {
	    	res.json({success: false});
	    }
	    else {
	    	res.json({success: true});
	    }
	});
});

router.delete('/result', function(req, res) {
	fs.writeFile('history.data', "", encoding='utf8', function (err) {
	    if (err) {
	    	res.json({success: false});
	    }
	    else {
	    	res.json({success: true});
	    }
	});
});


app.use('/', router);
app.listen(process.env.PORT || 3000, function () {
    console.log("Simple calculator listening on port %d", this.address().port);
});

module.exports = app;
