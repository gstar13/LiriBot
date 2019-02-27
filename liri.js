require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');

//global variables
var operator = process.argv[2];
// Joining the remaining arguments since an actor or tv show name may contain spaces
var searchTopic = process.argv.slice(3).join(" ");


//function center
//Bands In Town
var concertThis = function bandsInTownResponse() {
    
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
    
    //http request
    axios.get("http://www.omdbapi.com/?t=" + searchTopic + "&y=&plot=short&apikey=trilogy").then
        (function (response) {
            if (searchTopic === undefined) {
                var searchTopic = "mr Nobody";
            }
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.value);
            console.log("Produced in " + response.data.Country + ".");
            console.log("Language spoken is " + response.data.Language + ".");
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })
}
function doItResponse() {

fs.readFile("random.txt", "utf8", function(error, data){
    if (error) {
        console.log("error");
    }

doItResponseResults  = data.split(",");

spotifyThisSong(doItResponseResults[1]);

fs.appendFile("log.txt", doItResponseResults,function(err, data) {
    console.log('appended to file');
});
})
}
//})
//}
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
