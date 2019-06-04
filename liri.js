var axios = require('axios');
var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');
var keys = require('./keys');
var spotify = new Spotify(keys.spotify)

inquirer.prompt([
    {
        type: "list",
        name: "searchType",
        message: "What type of search would you like to perform?",
        choices: ["songs", "bands", "concerts", "movies"]
    },
    {
        type: "input",
        name: "searchCriteria",
        message: "What would you like to search for?"
    }
]).then(function(answers){
    var searchType = answers.searchType;
    var searchCriteria = answers.searchCriteria;
    switch (searchType) {
        case "songs":
            searchSpotify(searchCriteria);
        case "bands":
            bandsInTown(searchCriteria)
    }
})

// FUNCTIONS --------------------------------------------------------------------

function searchSpotify(searchCriteria){
    if (searchCriteria === ""){
        searchCriteria = "The Sign ace of base"
    }
spotify
    .search({ type: 'track', query: searchCriteria, limit: 1 })
    .then(function (response) {
        var songs = response.tracks.items;
        songs.forEach(function(item){
            var artist  = item.album.artists[0].name;
            var song    = item.name;
            var preview = item.preview_url;
            var album   = item.album.name;
            var output = `
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

function bandsInTown (searchCriteria){

}