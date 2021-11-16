const finalArray = new Array();
const combinedArray = new Array();

// Takes user's steam id and sends to server
async function addSteamId(){
    let steamId = document.getElementById('SteamIDButton').value;

    // This is the original user's steam id going to the server to request the steam api
    const server_url = `/firstUserGameApi/${steamId}`;
    const response = await fetch(server_url);
    const json = await response.json();

    //console.log(json);
    //console.log(json.response.games);
    //console.table(json.response.games);

    // Pushing the first list of games from the original user so it is the first index in the array
    combinedArray.push(json.response.games);

    // This creates an array of all the friends that the original user steamid has
    const friend_url = `/friendListApi/${steamId}`;
    const friendResponse = await fetch(friend_url);
    const friendData = await friendResponse.json();

    //console.log(friendData);

    let friendSteamId = new Array();

    // Creating an array of only steam ids for the next request
    for(i = 0; i < friendData.friendslist.friends.length; i++){
        friendSteamId.push(friendData.friendslist.friends[i].steamid);
    }

    //console.log(friendSteamId);

    // Using the friend list steam id list to request who is currently online
    const online_url = `/isOnlineApi/${friendSteamId}`;
    const onlineResponse = await fetch(online_url);
    const onlineData = await onlineResponse.json();

    // console.log(onlineData.response);
    //console.log(onlineData.response.players[0].personastate);

    let onlineStatus = new Array();
    // This checks for which steam ids are currently online
    for(x = 0; x < onlineData.response.players.length; x++){
        if(onlineData.response.players[x].personastate == 1){
            onlineStatus.push(onlineData.response.players[x].steamid);
        }
    }

    // console.log(onlineStatus);

    // Loop that is getting the game list of each online steam id
    for(y = 0; y < onlineStatus.length; y++){
        const onlineGames_url = `/onlineGamesApi/${onlineStatus[y]}`;
        const onlineGames_response = await fetch(onlineGames_url);
        const friendGamesData = await onlineGames_response.json();
        //console.log(friendGamesData);
        let notPrivate = new Array();
        // Skips any steam id that is set to private which will not allow for retrieval of owned games
        if(friendGamesData.response.games != null){
            // console.log(friendGamesData.response);
            // console.table(friendGamesData.response.games);
            // Adding these new games lists to the original games list to make a single array of all responses
            combinedArray.push(friendGamesData.response.games);
        };
    }

    //console.log(combinedArray);

    // This checks all arrays for occurrences of steam appids amongst all of the arrays
    // creates an occurrence for the original and all others for each unique appid
    var result = combinedArray.reduce((res, arr, index) => {
        arr.forEach(({appid}) => {
            res[appid] =  res[appid] || {occurrences: 0};
            res[appid]['where'] = res[appid]['where'] || [];
            if(!res[appid]['where'].includes(index)){
                res[appid]['where'].push(index);
                res[appid].occurrences += 1;
            }
        });
        return res;
    },{});
      
    combinedArray.forEach(arr => arr.forEach(obj => Object.assign(obj, result[obj.appid])));

    // console.log(combinedArray);

    // Sorts the occurrences from greatest to least

    let finalArray = combinedArray[0].sort(
        (x, y) => y.occurrences - x.occurrences ||
        x.name.localeCompare(y.name));
    
    // console.log(finalArray);
    // console.table(finalArray.where);

    //console.table(combinedArray[0]);
    //console.log(combinedArray[0].length);
    //console.log(combinedArray[0][0].occurrences);


    // A loop for displaying all of the results into the console 
    console.log("You have " + (finalArray[0].occurrences - 1) + " friend(s) online to play these game(s):");
    count = 2;
    for(k = 0; k < finalArray.length; k++){
        b = k + 1;
        if(finalArray[k].where[0] == 0){
            if(finalArray[k].occurrences > 1){
                if(finalArray[k].occurrences == finalArray[b].occurrences){
                    console.log("       " + finalArray[k].name);
                } else {
                    console.log("       " + finalArray[k].name);
                    if((finalArray[b].occurrences - 1) > 0){
                    console.log("You have " + (finalArray[b].occurrences - 1) + " friend(s) online to play these game(s):");
                    ++count;
                    }
                }
        
            }    
        }
    } 
}