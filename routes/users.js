var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
	// res.send('respond with a resource');
	res.json([{
		id: 1,
		username: "chancedurr"
	}, {
		id: 2,
		username: "chancedare"
	}])
});

router.get('/get_comments', function (req, res, next) {
	res.json([
		{id: 3, username: "test2"},
		{id: 4, username: "test4"}
	])
});

module.exports = router;
