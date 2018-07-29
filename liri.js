// require DontEnv
require("dotenv").config();

// require request module
const request = require('request');

// require FS
const fs = require('fs');

// require Twitter API
const twitter = require('twitter');

// require Spotify API
const requireSpotify = require('node-spotify-api');

// require keys JS
const keys = require('./keys.js');

// reference to API Keys
let spotify = new requireSpotify(keys.spotify);
let twitterClient = new twitter(keys.twitter);

// captures second string as argument
let liriArg = process.argv[2];

// switch case that changes for the liri commands
switch (liriArg) {
  case 'my-tweets':
    callTwitter();
    break;

  case 'spotify-this-song':
    callSpotify();
    break;

  case 'movie-this':
    callOmdb();
    break;

  case 'do-what-it-says':
    callTheFile();
    break;

  case 'write-to-file':
    writeToFile();
    break;
}

// function to call Spotify API
function callSpotify(fileParam = 0) {

  let songName = process.argv[3]

  spotify.search({
    type: 'track',
    query: songName || fileParam
  }).then(function (response) {
    // console.log(response.tracks.items)
    // console.log({'Artists: ' : response.tracks.items[1].album.artists[0].name}, {'Preview Url: ': response.tracks.items[1].preview_url}, {'Song Name: ': response.tracks.items[1].name});
    //artistsloop
    for (let i = 0; i < 5; i++) {

      console.log('Result ' + i + ':');
      console.log(
        {
            'Artist Name: ': response.tracks.items[i].artists[0].name
        },
        {
            'Preview URL: ': response.tracks.items[i].preview_url
        },
        {
            'Song Name: ': response.tracks.items[i].name
        },
        {
            'album: ': response.tracks.items[i].album.name
        }
      );
    };
  })
  .catch(function (err) {
      console.log(err);
  });
}

// function to call twitter API
function callTwitter() {
  twitterClient.get('statuses/user_timeline', {
    screen_name: 'bradnolan17'
  }, function (error, tweets, response) {
    if (error) {
      console.log('there was an error getting tweets');
      console.log(error);
    }
    console.log("Here's user bradnolan17's recent tweets:")
    for (let i = 0; i < tweets.length; i++) {
      console.log('Tweet ' + i + ": " + tweets[i].text)
    }
    // console.log(response);
  })
};
// currently not working because twitter hasn't yet allowed me to. i hate social media

//function for omdb API
function callOmdb(fileParam) {
  let movieName = process.argv[3] || fileParam;
  let omdbQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(omdbQueryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200){
      console.log(
        {
          'Movie Name: ': JSON.parse(body).Title
        },
        {
          'Release: ': JSON.parse(body).Year
        },
        {
          'IMDB Rating: ': JSON.parse(body).Ratings[0].Value
        },
        {
          'Rotten Tomatoes: ': JSON.parse(body).Ratings[1].Value
        },
        {
          'Country of Production: ': JSON.parse(body).Country
        },
        {
          'Language: ': JSON.parse(body).Language
        },
        {
          'Plot: ': JSON.parse(body).Plot
        },
        {
          'Featured Actors: ': JSON.parse(body).Actors
        }
      );
    }
  })
}

//calls fs function
function callTheFile() {
  fs.readFile('random.txt', 'utf8', function (error, data) {
    if (error) {
      return console.log(error);
    }
    if (data.includes(',') === true) {
      let contentArray = data.split(",");
      console.log('it says: ' + contentArray[0] + contentArray[1]);
      if (contentArray[0].includes('spotify-this-song') === true) {
        let fileParam = contentArray[1];
        callSpotify(fileParam);
      }
      if (contentArray[0].includes('movie-this') === true) {
        let fileParam = contentArray[1];
        callOmdb(fileParam);
      }
    }
    if (data.includes(',') === false) {
      let contentArray = data;
      console.log('It says: ' + contentArray);

      if (contentArray.includes('my-tweets') === true) {
        callTwitter();
      } else {
        console.log('there was an error.');
      }
    }
  })
}

// functionality for writing to the file
function writeToFile() {
  console.log('please place new file instructions in proper syntax, with a comma between command and param. Please Use SINGLE QUOTES for ENTIRE STRING, and DOUBLE QUOTES inside the single quotes arond the PARAM.');

  let newFileContent = process.argv [3];

  fs.writeFile('random.txt', newFileContent,'utf8', function (error, data) {
    if (error) {
      return console.log(error);
    }
    console.log('File write complete! Now assuming your command is properly formatted, feel free to run do-what-it-says!');
  })
}
