const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8228;
var http = require('http').Server(app);
var io = require('socket.io')(http);
const SpotifyUtils = require('./utils/SpotifyUtils')
const SCUtils = require('./utils/SCUtils')
const routes = require('./backend/routes');
const Queue = require('./backend/queue');
const spotify = require('./backend/spotifyRoutes').router;
const spotifyFirstSong = SpotifyUtils.firstSong;
const spotifyEventListener = SpotifyUtils.eventListener;
var localStorage = require('localStorage');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const SpotifyStrategy = require('passport-spotify').Strategy;
if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}

mongoose.connection.on('connected', function () {
    console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function () {
    console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
    process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);
app.use(session({
    secret: 'My secret',
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: "http://localhost:8228/auth/spotify/callback"
},
    function (accessToken, refreshToken, profile, done) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        done(null, profile);
    }
));
passport.serializeUser(function (profile, done) {
    done(null, profile);
})

passport.deserializeUser(function (profile, done) {
    done(null, profile);
})

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html'); // For React/Redux
});
app.get('/auth/spotify', passport.authenticate('spotify', { scope: ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'streaming', 'ugc-image-upload', 'user-follow-modify', 'user-follow-read', 'user-library-read', 'user-library-modify', 'user-read-private', 'user-read-birthdate', 'user-read-email', 'user-top-read', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'user-read-recently-played'] }))

app.get('/auth/spotify/callback', passport.authenticate('spotify'), function (req, res) {

    res.redirect('/');


})

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var SongQueue = new Queue();
var isPlaying = false;

app.use('/', routes);
app.use('/', spotify);

io.on('connection', function (socket) {
    var id;
    socket.emit('SEND_TOKEN', localStorage.getItem('accessToken'))
    // console.log('SENDING THE TOKEN:', localStorage.getItem('accessToken'));
    socket.emit('QUEUE_UPDATED', SongQueue);

    socket.on('CONNECT', function () {
        id = socket.id;
        console.log("Connection received!");
        socket.emit('SUCCESS', 'CONNECTED');
    });
    socket.on('RECEIVE_TOKEN', function () {
        // console.log("CHECK", localStorage.getItem('accessToken'));
        socket.emit('SEND_APP_TOKEN', localStorage.getItem('accessToken'));
    })
    socket.on('ADD_SONG', function (data) {
        console.log("SONG ADDED");
        function callback(result) {
            var newSong = {
                title: result.title,
                artist: result.artist,
                duration: SpotifyUtils.msToMinutes(result.duration),
                durationS: result.duration / 1000,
                id: result.id,
                type: data.type,
                upvotes: {},
                payment: data.payment || 0,
                requestor_id: socket.id,
                thumbnail: result.thumbnail,
                url: result.url,
                time: String(new Date())
            }
            if (!SongQueue.addSong(newSong)) {
                socket.emit('ERROR', 'SONG_ALREADY_IN_QUEUE');
            } else {
                socket.emit('SUCCESS', 'SONG_ADDED');
            }
            SongQueue.sort();
            io.emit('QUEUE_UPDATED', SongQueue);
            if (!isPlaying) {
                isPlaying = true;
                if (newSong.type === 'soundcloud') {
                    console.log('SENDING SOUNDCLOUD PLAY EVENT!')
                    io.emit('SOUNDCLOUD_PLAY_SONG', newSong)
                } else {
                    io.emit('SPOTIFY_PLAY_SONG', newSong);
                    console.log('SENDING SPOTIFY PLAY EVENT!')
                    spotifyEventListener(newSong, spotifySongAddedCallback, spotifySongOverCallback);
                }
            }
        }
        if (data.type === 'spotify') {
            const SPOTIFY_TOKEN = "Bearer " + localStorage.getItem('accessToken');
            SpotifyUtils.getSongInfo(SPOTIFY_TOKEN, data.id, callback)
        } else if (data.type === 'soundcloud') {
            SCUtils.getSongInfo(data.id, callback)
        } else {
            socket.emit('ERROR', 'SONG_TYPE_UNKNOWN');
        }
    })


    socket.on('SONG_OVER', function (data) {
        console.log('SC SONG_OVER RECEIVED:', data.title)
        // SongQueue.removeSong(data.id);
        if (SongQueue.list.length === 0) {
            isPlaying = false;
        }
        SongQueue.sort();
        io.emit('QUEUE_UPDATED', SongQueue);
        if (SongQueue.list.length !== 0) {
            var newSong = SongQueue.list[SongQueue.list.length - 1]

            if (newSong.type === 'soundcloud') {
                io.emit('SOUNDCLOUD_PLAY_SONG', newSong);
            } else {
                io.emit('SPOTIFY_PLAY_SONG', newSong);
                spotifyEventListener(newSong, spotifySongAddedCallback, spotifySongOverCallback);
            }
        }
    });

    function spotifySongOverCallback(data) {
        console.log('SPOTIFY SONG_OVER RECEIVED:', data.title)
        // SongQueue.removeSong(data.id);
        if (SongQueue.list.length === 0) {
            isPlaying = false;
        }
        SongQueue.sort();
        io.emit('QUEUE_UPDATED', SongQueue);
        if (SongQueue.list.length !== 0) {
            console.log('THERE ARE MORE SONGS TO PLAY');
            var newSong = SongQueue.list[SongQueue.list.length - 1]
            if (newSong.type === 'soundcloud') {
                io.emit('SOUNDCLOUD_PLAY_SONG', newSong);
            } else {
                io.emit('SPOTIFY_PLAY_SONG', newSong);
                spotifyEventListener(newSong, spotifySongAddedCallback, spotifySongOverCallback);
            }
        }
    }

    socket.on('SONG_STARTED', function (data) {
        console.log('SC SONG STARTED:', data.title)
        SongQueue.removeSong(data.id);
        SongQueue.sort();
        io.emit('QUEUE_UPDATED', SongQueue);
    });

    function spotifySongAddedCallback(data) {
        console.log('SPOTIFY SONG STARTED:', data.title)
        SongQueue.removeSong(data.id);
        SongQueue.sort();
        io.emit('QUEUE_UPDATED', SongQueue);
    };

    socket.on('REMOVE_SONG', function (data) {
        SongQueue.removeSong(data.id);
        socket.emit('SUCCESS', 'SONG_REMOVED')
        if (songQueue.list.length === 0) {
            isPlaying = false;
        }
        SongQueue.sort();
        io.emit('QUEUE_UPDATED', SongQueue);
        console.log(SongQueue);
    })

    socket.on('UPVOTE_SONG', function (data) {

        if (SongQueue.toggleUpvote(id, data.id)) {
            socket.emit('SUCCESS', 'SONG_UPVOTE_ADDED')
        } else {
            socket.emit('SUCCESS', 'SONG_UPVOTE_REMOVED')
        }
        SongQueue.sort();
        io.emit('QUEUE_UPDATED', SongQueue);
        console.log(SongQueue);
    })

    socket.on('PAY_SONG', function (data) {
        SongQueue.addPayment(data.id, data.amount);
        socket.emit('SUCCESS', 'SONG_PAYMENT_UPDATED');
        SongQueue.sort();
        io.emit('QUEUE_UPDATED', SongQueue);
        console.log(SongQueue);
    })
});

http.listen(PORT, error => {
    error
        ? console.error(error)
        : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
