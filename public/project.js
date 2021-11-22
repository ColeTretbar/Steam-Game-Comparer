const finalArray = new Array();
const combinedArray = new Array();

// Takes user's steam id and sends to server
async function addSteamId(){
    let steamId = document.getElementById('SteamIDButton').value;

    // This is the original user's steam id going to the server to request the steam api
    const server_url = `/firstUserGameApi/${steamId}`;
    const response = await fetch(server_url);
    const json = await response.json();

    // Pushing the first list of games from the original user so it is the first index in the array
    combinedArray.push(json.response.games);

    // This creates an array of all the friends that the original user steamid has
    const friend_url = `/friendListApi/${steamId}`;
    const friendResponse = await fetch(friend_url);
    const friendData = await friendResponse.json();

    let friendSteamId = new Array();

    // Creating an array of only steam ids for the next request
    for(i = 0; i < friendData.friendslist.friends.length; i++){
        friendSteamId.push(friendData.friendslist.friends[i].steamid);
    }

    // Using the friend list steam id list to request who is currently online
    const online_url = `/isOnlineApi/${friendSteamId}`;
    const onlineResponse = await fetch(online_url);
    const onlineData = await onlineResponse.json();

    let onlineStatus = new Array();
    let onlineNameId = new Array();

    // This checks for which steam ids are currently online
    for(x = 0; x < onlineData.response.players.length; x++){
        if(onlineData.response.players[x].personastate == 1){
            onlineStatus.push(onlineData.response.players[x].steamid);
            onlineNameId.push({friendid: onlineData.response.players[x].steamid, friendname: onlineData.response.players[x].personaname});
        }
    }

    var notPrivateList = new Array();

    // Loop that is getting the game list of each online steam id
    for(y = 0; y < onlineStatus.length; y++){
        const onlineGames_url = `/onlineGamesApi/${onlineStatus[y]}`;
        const onlineGames_response = await fetch(onlineGames_url);
        const friendGamesData = await onlineGames_response.json();

        // Skips any steam id that is set to private which will not allow for retrieval of owned games
        if(friendGamesData.response.games != null){
            // Adding these new games lists to the original games list to make a single array of all responses
            combinedArray.push(friendGamesData.response.games);
            notPrivateList.push(onlineNameId[y]);


        };
    }

    // This adds a index[0] placeholder for one of the last steps of displaying which friends own the games
    notPrivateList.unshift({friendid: '12345678945612547', friendname: "The Original User"})

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

    // Sorts the occurrences from greatest to least
    let finalArray = combinedArray[0].sort(
        (x, y) => y.occurrences - x.occurrences ||
        x.name.localeCompare(y.name));

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





    //function displayResults(){
    //     for(p = 0; p < 25; p++){
    //         var logoAppid = finalArray[p].appid;
    //         var logoUrl = finalArray[p].img_logo_url;
    //         var img = document.createElement("img");
    //         img.src = "http://media.steampowered.com/steamcommunity/public/images/apps/" + logoAppid + "/" + logoUrl + ".jpg";
    //         var src = document.getElementById("steamResults");
    //         var friendText = "";
    //         for(z = 1; z < finalArray[p].where.length; z++){ 
    //             friendText = friendText + notPrivateList[finalArray[p].where[z]].friendname + ", ";
    //         }
    //         var resultPara = document.createElement("p");
    //         var resultName = document.createTextNode(friendText);
    //         resultPara.insertAdjacentElement("afterbegin", img);
    //         resultPara.appendChild(resultName);
    //         src.appendChild(resultPara);
    // }
//}
}