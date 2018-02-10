require("dotenv").config();

var keys = require('./keys');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var searchTerm = process.argv[3];

takeCommand(command, searchTerm)

function takeCommand(command, searchTerm) {
    switch (command) {
        case 'my-tweets':
            bringTweets();
            break;
        case 'spotify-this-song':
            spotifySong(searchTerm);
            break;
        case 'movie-this':
            bringMovie(searchTerm);
            break;
        case 'do-what-it-says':
            doIt();
            break;
        default:
            console.log("Please try again");
    }
}

function bringTweets() {
    var client = new Twitter(keys.twitter);
    client.get('statuses/user_timerline', function(err, tweets, response) {
        if (err) {
            return console.log(err)
        }

        logResults('\nCommand: ' + command + '\n')

        tweets.forEach(function(tweet) {
            console.log("* " + tweet.text)
            logResults("* " + tweet.text + '\n')
        })
    })
}

function spotifySong() {
    var spotify = new Spotify(keys.spotify)
    var query = searchItem ? searchItem : 'The Sign',
        trackNum = searchItem ? 0 : 5
    var secondArg = searchTerm ? searchTerm : ''

    spotify.search({ type: 'track', query: query }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var track = data.tracks.items[trackNum]

        var album = track.album.name;
        var artist = track.artists[0].name;
        var ext_url = track.external_urls.spotify;
        var song = track.name;
        var result = '* ' + artist + '\n* ' + song + '\n* ' + ext_url + '\n* ' + album +
            '\n'

        console.log(result);
        logResults('\nCommand: ' + command + ' ' + secondArg + '\n' + result)
    });
}

function bringMovie() {
    var movie = searchTerm ? searchTerm : "Lord%20of%20the%20Rings"
    var query = 'https://www.omdbapi.com/?apikey=trilogy&t=' + movie;
    request.get(query, function(err, response, body) {
        if (err) {
            return console.log(err);
        } else {
            console.log("* Title: " + JSON.parse(body).Title + "\n* Release Year: " + JSON.parse(body).Released +
                "\n* IMDB Rating: " + JSON.parse(body).imdbRating + "\n* Country: " + JSON.parse(body).Country +
                "\n* Language: " + JSON.parse(body).Language + "\n* Plot: " + JSON.parse(body).Plot +
                "\n* Actors: " + JSON.parse(body).Actors)
        }
    })
}

function doIt() {
    fs.readFile('random.txt', 'utf-8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(',')
        var cmd = dataArr[0]
        var search = dataArr[1]

        takeCommand(command, searchTerm)
    })
}