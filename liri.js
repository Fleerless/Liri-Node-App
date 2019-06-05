var axios = require('axios');
var inquirer = require('inquirer');
var keys = require('./keys');
var moment = require('moment')
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify)

inquirer.prompt([
    {
        type: "list",
        name: "searchType",
        message: "What type of search would you like to perform?",
        choices: ["songs", "do-what-it-says", "concerts", "movies"]
    },
    {
        type: "input",
        name: "searchCriteria",
        message: "What would you like to search for?"
    }
]).then(function (answers) {
    var searchType = answers.searchType;
    var searchCriteria = answers.searchCriteria;
    switch (searchType) {
        case "songs":
            searchSpotify(searchCriteria);
            break;
        case "do-what-it-says":
            // Review bank class activity
            break;
        case "concerts":
            bandsInTown(searchCriteria);
            break;
        case "movies":
            // Review movies class activity
            break;
    }
})

//  PRIMARY FUNCTIONS --------------------------------------------------------------------

function searchSpotify(searchCriteria) {
    if (searchCriteria === "") {
        searchCriteria = "The Sign ace of base"
    }
    spotify
        .search({ type: 'track', query: searchCriteria, limit: 1 })
        .then(function (response) {
            var songs = response.tracks.items;
            songs.forEach(function (item) {
                var artist  = item.album.artists[0].name;
                var song    = item.name;
                var preview = item.preview_url;
                var album   = item.album.name;
                var output  = `
Artist:  ${artist}
Song:    ${song}
Preview: ${preview}
Album:   ${album}\n
___________________________________________________
`;
                console.log(output);
            })
        })
        .catch(function (err) {
            console.log(err);
        });
}

function bandsInTown(searchCriteria) {
    axios.get("https://rest.bandsintown.com/artists/" + searchCriteria + "/events?app_id=codingbootcamp")
        .then(function (response) {
            // handle success
            response.data.forEach(function(item){
                var venue        = displayVenue(item);
                var date         = moment(item.datetime).format('LLLL');
                var sale         = displaySaleDate(item);
                var purchaseLink = item.offers[0].url;
                var lineUp       = item.lineup.join(', ');
                var output       = `
LINEUP:                     ${lineUp}

VENUE:                      ${venue}

DATE:                       ${date}
AVAILABLE FOR PURCHASE:     ${sale}

PURCHASE LINK:              ${purchaseLink}

_____________________________________________________________________________________________
`
                console.log(output);
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
};

// SECONDARY FUNCTIONS ------------------------------------------------------------------------------

function displayVenue(item){
    if (item.venue.region === ""){
        return `${item.venue.name}   --- in ---   ${item.venue.city}, ${item.venue.country}`;
    } else {
        return `${item.venue.name}   --- in ---   ${item.venue.city} ${item.venue.region}, ${item.venue.country}`;
    }; 
};

function displaySaleDate(item){
    if (item.on_sale_datetime === ""){
        return 'TBD';
    } else {
        return moment(item.on_sale_datetime).format('LLLL');
    }
}