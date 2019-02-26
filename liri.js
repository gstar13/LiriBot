require("dotenv").config();
var keys = require("./keys.js");

//global variables
var operator = process.argv[2];
var searchTopic = process.argv[3];
//function center
//Bands In Town
var concertThis = function bandsInTownResponse() {
    var axios = require("axios");
    var moment = require("moment");
    moment().format();
    console.log("getting info on " + searchTopic);
    axios.get("https://rest.bandsintown.com/artists/" + searchTopic + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var i = 0; i <response.data.length; i++) {
            time = response.data[i].datetime.split("T");
            
            
            console.log("Concert Venue: " + response.data[i].venue.name);
            console.log("City: " + response.data[i].venue.city );
            console.log("Time: " + time);
        }
})
}
//Spotify Function
var spotifyThisSong = function spotifyResponse(searchTopic) {
    console.log("in spotify fxn");
    if (searchTopic === undefined) {
        var searchTopic = "the sign ace of base"
    }
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);
   
    ///spotify api request--when object returned, output the artists, song name, preview link of song, album 
    spotify.search({ type: 'track', query: searchTopic }, function (error, data) {
        
        console.log("hi");
        if (error) { //if error
            console.log('error occurred' + error);
        } else {
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song Title: " + data.tracks.items[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }
    })
}
//omdb function
var movieThis = function omdbResponse() {
    var axios = require("axios");
    //http request
    axios.get("http://www.omdbapi.com/?t=" + searchTopic + "&y=&plot=short&apikey=trilogy").then
        (function (response) {
            if (searchTopic === undefined) {
                var searchTopic = "mr Nobody";
            }
            console.log("Title: " + response.data.Title);
            console.log("Release Year" + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.value);
            console.log("Produced in " + response.data.Country + ".");
            console.log("Language is in " + response.data.Language + ".");
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })
}
function doItResponse() {
var fs = require("fs");
fs.readFile("random.txt", "utf8", function(error, data){
    if (error) {
        console.log("error");
    }

doItResponseResults = data.split(",");
console.log(doItResponseResults);
for (var i = 0; i<doItResponseResults.length; ) {
    var searchTopic = doItResponseResults[i];
spotifyThisSong(searchTopic);

movieThis(doItResponseResults[i]);

concertThis(doItResponseResults[i]);
fs.appendFile("log.txt");
}
})
}
///command center
if (operator == 'concert-this') {
    console.log("Upcoming concert information for " + searchTopic);
    concertThis(searchTopic);
}
else if (operator === 'spotify-this-song') {
    console.log("getting info about: " + searchTopic);
    spotifyThisSong(searchTopic);
}
else if (operator === 'movie-this') {
    movieThis(searchTopic);
}
else if (operator == 'do-what-it-says') {
    doItResponse(searchTopic);
}
