// Takes user's steam id and sends to server
async function addSteamId(){

    let finalArray = new Array();
    let combinedArray = new Array();

    let steamId = document.getElementById('SteamIDButton').value;

    // This is the original user's steam id going to the server to request the steam api
    const server_url = `/firstUserGameApi/${steamId}`;
    const response = await fetch(server_url);
    const json = await response.json();

    console.log(json);

    // Pushing the first list of games from the original user so it is the first index in the array
    combinedArray.push(json.response.games);

    // This creates an array of all the friends that the original user steamid has
    const friend_url = `/friendListApi/${steamId}`;
    const friendResponse = await fetch(friend_url);
    const friendData = await friendResponse.json();

    console.log(friendData);

    let friendSteamId = new Array();

    fffl = friendData.friendslist.friends.length;

    // Creating an array of only steam ids for the next request
    for(i = 0; i < fffl; i++){
        friendSteamId.push(friendData.friendslist.friends[i].steamid);
    }

    // Using the friend list steam id list to request who is currently online
    const online_url = `/isOnlineApi/${friendSteamId}`;
    const onlineResponse = await fetch(online_url);
    const onlineData = await onlineResponse.json();

    console.log(onlineData);

    // let onlineStatus = new Array();
    let onlineNameId = new Array();

    // console.log(onlineData);

    orpl = onlineData.response.players.length;

    // This checks for which steam ids are currently online
    for(x = 0; x < orpl; x++){
        if(onlineData.response.players[x].personastate == 1){
            // onlineStatus.push(onlineData.response.players[x].steamid);
            onlineNameId.push({friendid: onlineData.response.players[x].steamid, friendname: onlineData.response.players[x].personaname, avatar: onlineData.response.players[x].avatarmedium});
        }
    }

    onlineNameId.sort(function(y, z){
       return y.friendname.localeCompare(z.friendname);
    });

    console.log(onlineNameId);

    var notPrivateList = new Array();

    ol = onlineNameId.length;

    // Loop that is getting the game list of each online steam id
    for(y = 0; y < ol; y++){
        const onlineGames_url = `/onlineGamesApi/${onlineNameId[y].friendid}`;
        const onlineGames_response = await fetch(onlineGames_url);
        const friendGamesData = await onlineGames_response.json();

        console.log(friendGamesData);

        // Skips any steam id that is set to private which will not allow for retrieval of owned games
        if(friendGamesData.response.games != null){
            // Adding these new games lists to the original games list to make a single array of all responses
            combinedArray.push(friendGamesData.response.games);
            notPrivateList.push(onlineNameId[y]);
        };
    }

    console.log(notPrivateList);

    // notPrivateList.sort(function (a, b) {
    //     return a.friendname.localeCompare(b.friendname);
    // });

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
    finalArray = combinedArray[0].sort(
        (x, y) => y.occurrences - x.occurrences ||
        x.name.localeCompare(y.name));

    // A loop for displaying all of the results into the console 
    // console.log("You have " + (finalArray[0].occurrences - 1) + " friend(s) online to play these game(s):");
    // count = 2;
    // for(k = 0; k < finalArray.length; k++){
    //     b = k + 1;
    //     if(finalArray[k].where[0] == 0){
    //         if(finalArray[k].occurrences > 1){
    //             if(finalArray[k].occurrences == finalArray[b].occurrences){
    //                 console.log("       " + finalArray[k].name);
    //             } else {
    //                 console.log("       " + finalArray[k].name);
    //                 if((finalArray[b].occurrences - 1) > 0){
    //                 console.log("You have " + (finalArray[b].occurrences - 1) + " friend(s) online to play these game(s):");
    //                 ++count;
    //                 }
    //             }
    //         }    
    //     }
    // }

        // console.log(combinedArray[0]);

    document.getElementById("onlineTableRow").innerHTML = "";

    pl = notPrivateList.length;

    console.log(notPrivateList);

    for(ii = 1; ii < pl; ii++){
        var tablesrc = document.getElementById("onlineTableRow");
        var profilepic = document.createElement("img");
        profilepic.src = notPrivateList[ii].avatar;

        var friendCell = document.createElement("td");
        friendCell.classList.add("included");
        friendCell.setAttribute("id", ii);
        var friendCellName = document.createTextNode(notPrivateList[ii].friendname);
        friendCell.insertAdjacentElement("afterbegin", profilepic);
        friendCell.appendChild(friendCellName);
        tablesrc.appendChild(friendCell);
    }

    let priorityList = new Array();

    document.getElementById("PriorityList").innerHTML = ("Click on your friend's names if you choose to filter results.");

    document.addEventListener('click', function(e){
        if(e.target.className=="included"){
            console.log(e.target.textContent);
            if(priorityList)
            if(priorityList.indexOf(e.target.textContent) == -1){
                priorityList.push(e.target.textContent);
                priorityList.sort(function(a, b){
                   return a.localeCompare(b);
                });
            } else {
                var prioIndex = priorityList.indexOf(e.target.textContent);
                priorityList.splice(prioIndex, 1);
        }
        if(priorityList.length > 0){
            document.getElementById("PriorityList").innerHTML = "You are filtering results for " + priorityList.join(", ") + ".";
        } else {
            document.getElementById("PriorityList").innerHTML = "Click on your friend's name if you choose to filter results.";
        }
        console.log(priorityList);
    }});


    console.log(finalArray);


function displayGameList(){
    document.getElementById("steamResults").innerHTML = "";
    gameNumber = 0;
    for(p = 0; p < resultAmt ; p++){
        if(finalArray[p].occurrences > 1 && finalArray[p].occurrences != null){
            var friendText = new Array();

            for(z = 1; z < finalArray[p].where.length; z++){ 
                friendText.push(notPrivateList[finalArray[p].where[z]].friendname);
            }

            friendText.sort(function(x, y){
                return x.localeCompare(y);
            });
            
            function isSubset(array1, array2){

                return array2.every(function(element){
                    return array1.includes(element);
                });
            }
            // if(priorityList > 0 && onlyFilter == true){

            // }
            if(priorityList.length > 0) {
                console.log(isSubset(friendText, priorityList));
                if(isSubset(friendText, priorityList) == true){
                    gameMatch = true;
                } else {
                    gameMatch = false;
                }
            } else {
                gameMatch = true;
            };

            if(gameMatch ==  true){
                gameNumber += 1;
                var logoAppid = finalArray[p].appid;
                var logoUrl = finalArray[p].img_logo_url;
                var img = document.createElement("img");
                img.src = "http://media.steampowered.com/steamcommunity/public/images/apps/" + logoAppid + "/" + logoUrl + ".jpg";
                var src = document.getElementById("steamResults");
                
                var resultPara = document.createElement("p");
                var resultName = document.createTextNode("(" + (finalArray[p].occurrences - 1)+ ") " + friendText.join(", ") + "." + " Game Number: " + (gameNumber));
                resultPara.insertAdjacentElement("afterbegin", img);
                resultPara.appendChild(resultName);
                src.appendChild(resultPara);
            } else {
                gameMatch = false;
                resultAmt = resultAmt + 1;
                console.log(resultAmt);
            }
        } else {
            break;
        }
    }
}
  
  
tenButton = document.getElementsByName("TenButton")[0];
tenButton.addEventListener("click", function(){
resultAmt = Number(tenButton.value);
displayGameList();
});

twentyFiveButton = document.getElementsByName("TwentyFiveButton")[0];
twentyFiveButton.addEventListener("click", function(){
resultAmt = Number(twentyFiveButton.value);
displayGameList();
});

fiftyButton = document.getElementsByName("FiftyButton")[0];
fiftyButton.addEventListener("click", function(){
resultAmt = Number(fiftyButton.value);
displayGameList();
});

oneHundredButton = document.getElementsByName("OneHundredButton")[0];
oneHundredButton.addEventListener("click", function(){
resultAmt = Number(oneHundredButton.value);
displayGameList();
});

allButton = document.getElementsByName("AllButton")[0];
allButton.addEventListener("click", function(){
resultAmt = Number(finalArray.length);
displayGameList();
});

}