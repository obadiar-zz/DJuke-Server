const axios = require('axios');
const io = require('socket.io-client');
const ip = require('ip');

var localServer = '10.2.106.85';
const PORT = '8228';
var connectionAddress = 'http://' + localServer + ':' + PORT;
if (localServer) {
	var socket = io(connectionAddress);
	socket.emit('CONNECT', {
		ip: ip.address()
	})

	socket.emit(process.argv[2], {
		id: process.argv[3],
		ip: ip.address(),
		amount: process.argv[4] || 0,
		type: "spotify"
	})

	socket.on("QUEUE_UPDATED", function (data) {
		console.log('====================================');
		console.log(data);
		console.log('====================================');
	})

	socket.on("ERROR", function (data) {
		switch (data) {
			case "SONG_ALREADY_IN_QUEUE":
				console.log("Sorry song is already in the queue");
				break;
			default:
				console.log(data);
		}
	})

	socket.on("SUCCESS", function (data) {
		switch (data) {
			case "CONNECTED":
				console.log("Connected to DJuke.io server!")
				break;
			case "SONG_ADDED":
				console.log("Song added.");
				break;
			case "SONG_REMOVED":
				console.log("Song removed.");
				break;
			case "SONG_UPVOTE_ADDED":
				console.log("Upvote submitted.");
				break;
			case "SONG_UPVOTE_REMOVED":
				console.log("Upvote removed.");
				break;
			case "SONG_PAYMENT_UPDATED":
				console.log("Payment recorded.");
				break;
			default:
				console.log(data);
		}
	})
}

// } else{
  // axios.get("https://rocky-brook-68243.herokuapp.com/discover")
  //     .then(response => {
  //         localServer = response.data;
  //         var connectionAddress = 'http://' + localServer + ':' + PORT;
  //         var socket = io(connectionAddress);
  //         socket.emit('IP_CONNECTED', {
  //             ip: ip.address()
  //         })
	//
  //         socket.emit('ADD_SONG', {
  //             song_id: 1,
  //             ip: ip.address()
  //         })
  //     })
  //     .catch(error => console.log('A problem has occured..'));
}
