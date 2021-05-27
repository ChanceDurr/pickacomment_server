var express = require('express');
var router = express.Router();
const axios = require("axios");

require("dotenv").config({path:"./.env"})


/* GET users listing. */
router.post('/', async (req, res, next) => {
	if (req.body.url === ""){
		conversation_id = "1395086420516249601"
	} else {
		urlArray = req.body.url.split("/")
		conversation_id = urlArray[urlArray.length - 1]
	}

	try {
		const replyIDs = await getTweets(conversation_id)
		if (req.body.numberOfComments > replyIDs.length) {
			console.log("here")
			res.status(500).send({ error: "Not enough tweets"})
		} else {
			console.log(req.body.numberOfComments)
			winners = chooseRandom(replyIDs, req.body.numberOfComments)
			res.json(winners)
		}
		
	} catch (e) {
		next(e)
	}

})

async function getTweets(conversation_id, next_token = "") {
	var replies = new Array()
	has_next = false

	const options = {
		headers: {"Authorization": `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`}
	}

	try {
		resData = await axios.get(`https://api.twitter.com/2/tweets/search/recent?max_results=10&user.fields=username${next_token}&query=conversation_id:${conversation_id}`, options)
		.then(response => response)
		.catch(error => console.log(error))

		for (var i = 0; i < resData.data.data.length; i++) {
			var _id = resData.data.data[i].id
			var _text = resData.data.data[i].text
			var _username = resData.data.includes.users[i].username
			var _profile_image_url = res.data.includes.users[i].profile_image_url
			replies.push({
				id: _id,
				text: _text,
				username: _username,
				profile_image_url: _profile_image_url
			})
		}

		if ("next_token" in resData.data.meta){
			has_next = true
		}

		if (has_next) {
			replies = replies.concat(await getTweets(conversation_id, "&next_token="+resData.data.meta.next_token))
		}

		console.log(replies)
		return replies;
	} catch (e) {
		console.log(e)
		next(e)
	}
}

function chooseRandom(ids, number) {
	let winners = new Array()

	for (var i = 0; i < number; i++) {
		index = Math.floor(Math.random() * ids.length)
		winners.push(ids[index])
		ids.splice(index, 1)
	}

	return winners
}

module.exports = router;