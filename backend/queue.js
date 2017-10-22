function SongQueue() {
	this.list = [];
}

const UPVOTE_WEIGHT = 0.2;
const PAYMENT_WEIGHT = 1.0;

SongQueue.prototype.addSong = function (songToAdd) {
	if (this.list.filter(song => song.id === songToAdd.id).length === 0) {
		this.list.unshift(songToAdd)
		return true;
	}
	return false;
}

SongQueue.prototype.popSong = function () {
	this.list.pop();
}

SongQueue.prototype.removeSong = function (removeId) {
	this.list = this.list.filter(song => song.id !== removeId)
}

SongQueue.prototype.toggleUpvote = function (clientID, upvoteId) {
	for (var i = 0; i < this.list.length; i++) {
		var song = this.list[i];
		if (song.id === upvoteId) {
			if (song.upvotes[clientID]) {
				delete song.upvotes[clientID];
				return false;
			} else {
				song.upvotes[clientID] = 1;
				return true;
			}
		}
	}
}

SongQueue.prototype.addPayment = function (payId, amount) {
	for (var i = 0; i < this.list.length; i++) {
		var song = this.list[i];
		if (song.id === payId) {
			song.payment += parseFloat(amount);
		}
	}
}

SongQueue.prototype.display = function () {
	return this.list.map(song => {
		return {
			title: song.title,
			upvotes: Object.keys(song.upvotes).length,
			payment: song.payment.ToFixed(2),
			time: song.time
		}
	})
}

SongQueue.prototype.sort = function () {
	this.list.sort(function (a, b) {
		var scoreA = (Object.keys(a.upvotes).length * UPVOTE_WEIGHT) + (a.payment * PAYMENT_WEIGHT);
		var scoreB = (Object.keys(b.upvotes).length * UPVOTE_WEIGHT) + (b.payment * PAYMENT_WEIGHT);
		if (scoreA !== scoreB) {
			return scoreA - scoreB;
		} else {
			return new Date(b.time) - new Date(a.time);
		}
	})
}

module.exports = SongQueue;
