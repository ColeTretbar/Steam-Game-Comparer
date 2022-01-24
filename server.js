const { request } = require('express');
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const port = 8080;
const app = express();
app.listen(port, () => console.log(`Listening at ${port}`));
app.use(express.static('public', {index: 'index.html'}));


const apiKey = process.env.API_KEY;
const apiSteam = `https://api.steampowered.com`;
const apiPlayerOwned = `/IPlayerService/GetOwnedGames/v0001/?key=`;
const idTag = `&steamid=`;
const appInfoTag = `&include_appinfo=true&include_played_free_games=true&include_free_sub=true&skip_unvetted_apps=false`;
const apiUserFriends = `/ISteamUser/GetFriendList/v0001/?key=`;
const appRelationTag = `&relationship=friend`;
const apiUserSummary = `/ISteamUser/GetPlayerSummaries/v0002/?key=`;


// Requests Steam API for Steam Owned Games of the Steam ID of the original request
app.get('/firstUserGameApi/:steamId', async (request, response) => {
    const steamId = request.params.steamId;
    const firstUserGame_response = await fetch(apiSteam + apiPlayerOwned + apiKey + idTag + steamId + appInfoTag);
    const firstUserGame = await firstUserGame_response.json();
    response.json(firstUserGame);
})

// Requests Steam API for the Friends List of the inputting user 
app.get('/friendListApi/:steamId', async (request, response) => {
    const steamId = request.params.steamId;
    const friendList_response = await fetch(apiSteam + apiUserFriends + apiKey + idTag + steamId + appRelationTag);
    const friendListData = await friendList_response.json();
    response.json(friendListData);
})

// Requests Steam API for the online status of Friends list steam ids obtained from the previous request
app.get('/isOnlineApi/:friendSteamId', async (request, response) => {
    const friendSteamId = request.params.friendSteamId;
    const isOnline_response = await fetch(apiSteam + apiUserSummary + apiKey + idTag + `&steamids=` + friendSteamId);
    const isOnlineData = await isOnline_response.json();
    response.json(isOnlineData);
})

// Requests Steam API for the owned games of the Steam IDs that were shown to be online
app.get('/onlineGamesApi/:onlineNameId[y].friendid', async (request, response) => {
    const onlineStatus = request.params.onlineNameId[y].friendid;
    const onlineGames_response = await fetch(apiSteam + apiPlayerOwned + apiKey + idTag + onlineStatus + appInfoTag);
    const onlineUserGames = await onlineGames_response.json();
    response.json(onlineUserGames);
})