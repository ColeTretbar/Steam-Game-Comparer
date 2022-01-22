// Takes user's steam id and sends to server
async function addSteamId(){
    document.getElementById("steamResults").innerHTML = "";
    document.getElementsByName("PriorityList")[0].innerHTML = "";
    document.getElementsByName("PriorityList")[1].innerHTML = "";
    document.getElementById("onlineFriends").innerHTML = "";
    
    
    let steamId = document.getElementById('SteamIDButton').value,
    combinedArray = [],
    friendSteamId = [],
    onlineNameId = [],
    notPrivateList = [],
    priorityList = [],
    resultAmt;
    
    document.getElementById("SteamIDSubmit").disabled = true;
    
    if(document.getElementById("first-user-display") != null){
        let oldUser = document.getElementById("first-user-display");
        oldUser.remove();
        let anchor = document.getElementById("anchor")
        let loader = document.createElement("div");
        loader.className = "loader";
        loader.setAttribute("id", "loader");
        anchor.insertAdjacentElement("beforeend", loader);
    } else if(document.getElementById("first-user-display") == null){
        anchor = document.getElementById("anchor")
        let loader = document.createElement("div");
        loader.className = "loader";
        loader.setAttribute("id", "loader");
        anchor.insertAdjacentElement("beforeend", loader);
    }

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
    
    var fffl = friendData.friendslist.friends.length;
    
    // Creating an array of only steam ids for the next request
    for(i = 0; i < fffl; i++){
        friendSteamId.push(friendData.friendslist.friends[i].steamid);
    };
    
    const firstUserInfo = `/isOnlineApi/${steamId}`;
    const firstUserResponse = await fetch(firstUserInfo);
    const firstUserData = await firstUserResponse.json();
    
    // Using the friend list steam id list to request who is currently online
    const online_url = `/isOnlineApi/${friendSteamId}`;
    const onlineResponse = await fetch(online_url);
    const onlineData = await onlineResponse.json();
    
    var orpl = onlineData.response.players.length;
    
    var includeOnline = document.getElementById("OnlineSwitch").value;
    
    // This checks for which steam ids are currently online
    for(x = 0; x < orpl; x++){
        if(includeOnline =="YES"){
            onlineNameId.push({friendid: onlineData.response.players[x].steamid, friendname: onlineData.response.players[x].personaname, avatar: onlineData.response.players[x].avatarmedium});
        }else if(includeOnline =="NO" && onlineData.response.players[x].personastate == 1){
            onlineNameId.push({friendid: onlineData.response.players[x].steamid, friendname: onlineData.response.players[x].personaname, avatar: onlineData.response.players[x].avatarmedium});
        }
    }
    
    onlineNameId.sort((y, z) => y.friendname.localeCompare(z.friendname))
    
    var ol = onlineNameId.length;
    
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

    // This adds a index[0] placeholder for one of the last steps of displaying which friends own the games
    notPrivateList.unshift({friendid: firstUserData.response.players[0].steamid, friendname: firstUserData.response.players[0].personaname, avatar: firstUserData.response.players[0].avatarfull});
    
    if(document.getElementById("first-user-display") == null){
        let loader = document.getElementById("loader");
        loader.remove();
        let anchor = document.getElementById("anchor"),
            displayDiv = document.createElement("div"),
            displayImg = document.createElement("img"),
            displayParaOne = document.createElement("p"),
            displayParaTwo = document.createElement("p");
        displayDiv.classList.add("top-square-right");
        displayDiv.setAttribute("id", "first-user-display");
        displayParaOne.appendChild(document.createTextNode("Showing Results for"));
        displayImg.src = firstUserData.response.players[0].avatarfull;
        displayParaTwo.appendChild(document.createTextNode(firstUserData.response.players[0].personaname));
        displayDiv.insertAdjacentElement("beforeend", displayParaOne);
        displayDiv.insertAdjacentElement("beforeend", displayImg);
        displayDiv.insertAdjacentElement("beforeend", displayParaTwo);
        anchor.appendChild(displayDiv);
    };
    
    // This checks all arrays for occurrences of steam appids amongst all of the arrays
    // creates an occurrence for the original and all others for each unique appid
    const result = combinedArray.reduce((res, arr, index) => {
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
    finalArray = combinedArray[0].sort((x, y) => y.occurrences - x.occurrences || x.name.localeCompare(y.name));

    var pl = notPrivateList.length;

    for(ii = 1; ii < pl; ii++){
        let tablesrc = document.getElementById("onlineFriends"),
            profilepic = document.createElement("img"),
            friendCell = document.createElement("div"),
            friendPara = document.createElement("p");
        profilepic.src = notPrivateList[ii].avatar;
        friendCell.classList.add("FriendResultCell");
        friendCell.setAttribute("id", ii);
        friendCell.setAttribute("onclick", true);
        friendPara.setAttribute("value", notPrivateList[ii].friendname);
        profilepic.setAttribute("value", notPrivateList[ii].friendname);
        friendPara.classList.add("included");
        profilepic.classList.add("included");
        friendCellName = document.createTextNode(notPrivateList[ii].friendname);
        friendCell.insertAdjacentElement("afterbegin", friendPara);
        friendPara.insertAdjacentElement("beforebegin", profilepic)
        friendPara.appendChild(friendCellName);
        tablesrc.appendChild(friendCell);
        if((ii + 1) == pl){
            document.getElementsByName("PriorityList")[0].innerHTML = "Click on your friend's names if you choose to filter results.";
            document.getElementsByName("PriorityList")[1].innerHTML = "Click on your friend's names if you choose to filter results.";
            document.getElementById("SteamIDSubmit").disabled = false;
        };
    };
        
    document.addEventListener('click', function(e){
        if(e.target.className=="included"){
            filterSwitch = document.getElementById("FilterSwitch").value;
            if(priorityList.indexOf(e.target.attributes.value.nodeValue) == -1){
                priorityList.push(e.target.attributes.value.nodeValue);
                priorityList.sort(function(a, b){
                    return a.localeCompare(b);
                });
                e.target.parentNode.style.background = "rgba(246, 80, 2, 0.5)";
            } else {
                let prioIndex = priorityList.indexOf(e.target.attributes.value.nodeValue);
                priorityList.splice(prioIndex, 1);
                e.target.parentNode.style.background = "rgba(246, 80, 2, 0.0)";
            }
        } else if(e.target.className=="filter"){
                filterSwitch = document.getElementById("FilterSwitch").value;
        }

        if(e.target.className=="included" || e.target.className=="filter"){
            if(priorityList.length > 0 && filterSwitch == "YES"){
                document.getElementsByName("PriorityList")[0].innerHTML = "You are strictly filtering results for " + priorityList.join(", ") + ".";
                document.getElementsByName("PriorityList")[1].innerHTML = "You are strictly filtering results for " + priorityList.join(", ") + ".";
                if(resultAmt != 0){
                    displayGameList();
                }
            } else if(priorityList.length > 0 && filterSwitch == "NO"){
                document.getElementsByName("PriorityList")[0].innerHTML = "You are prioritizing results for " + priorityList.join(", ") + ".";
                document.getElementsByName("PriorityList")[1].innerHTML = "You are prioritizing results for " + priorityList.join(", ") + ".";
                if(resultAmt != 0){
                    displayGameList();
                }
            } else {
                document.getElementsByName("PriorityList")[0].innerHTML = "Click on your friend's names if you choose to filter results.";
                document.getElementsByName("PriorityList")[1].innerHTML = "Click on your friend's names if you choose to filter results.";
                if(resultAmt != 0){
                    displayGameList();
                }
            }
        }
    });
    
    console.log(priorityList);

    console.log(notPrivateList);

    console.log(combinedArray);

    console.log(finalArray);

    document.getElementById("steamResults").innerHTML = "";
    
    function displayGameList(){
        document.getElementById("steamResults").innerHTML = "";
        let gameNumber = 0;
        filterSwitch = document.getElementById("FilterSwitch").value;
        let gameMatch = false;
        let selectedResultAmt = resultAmt;
        console.log({resultAmt});
        for(p = 0; p < resultAmt ; p++){
            if(finalArray[p].occurrences > 1 && finalArray[p].occurrences != null){
                let friendText = [];
                    
                for(z = 1; z < finalArray[p].where.length; z++){ 
                    friendText.push(notPrivateList[finalArray[p].where[z]].friendname);
                }
                    
                friendText.sort(function(x, y){
                    return x.localeCompare(y)
                })
                    
                function isSubset(array1, array2){
                    return array2.every(function(element){
                    return array1.includes(element);
                    });
                }

                if(priorityList.length > 0 && filterSwitch == "YES"){
                    if(isSubset(friendText, priorityList) == true){
                        gameMatch = true;
                        friendText = []; 
                        friendText = priorityList;
                    } else {
                        gameMatch = false;
                    }
                } else if(priorityList.length > 0 && filterSwitch == "NO") {
                    if(isSubset(friendText, priorityList) == true){
                        gameMatch = true;
                    } else {
                        gameMatch = false;
                    }
                } else {
                    gameMatch = true;
                }
                    
                if(gameMatch ==  true){
                    gameNumber += 1;
                    let logoAppid = finalArray[p].appid,
                        logoUrl = finalArray[p].img_logo_url,
                        img = document.createElement("img"),
                        src = document.getElementById("steamResults"), 
                        resultDiv = document.createElement("div"),
                        resultPara = document.createElement("p"),
                        resultGame = document.createElement("p"),
                        resultName = document.createTextNode("(" + (friendText.length)+ ") " + friendText.join(", ") + "." + "Game Number: " + (gameNumber));
                    img.src = "http://media.steampowered.com/steamcommunity/public/images/apps/" + logoAppid + "/" + logoUrl + ".jpg";
                    resultGame.appendChild(document.createTextNode(finalArray[p].name));
                    resultPara.appendChild(resultName);
                    resultDiv.insertAdjacentElement("beforeend", img);
                    resultDiv.insertAdjacentElement("beforeend", resultGame);
                    resultDiv.insertAdjacentElement("beforeend", resultPara);
                    src.appendChild(resultDiv);
                } else {
                    gameMatch = false;
                    resultAmt = resultAmt + 1;
                }
            } else {
                resultAmt = selectedResultAmt;
                console.log(resultAmt)
                break;
            }
        }
        resultAmt = selectedResultAmt;
        console.log(resultAmt);
        console.log(selectedResultAmt);
    }

    const tenButton = document.getElementsByName("TenButton")[0];
    tenButton.addEventListener("click", function(){
        resultAmt = Number(tenButton.value);
        displayGameList();
        
    })

    const twentyFiveButton = document.getElementsByName("TwentyFiveButton")[0];
    twentyFiveButton.addEventListener("click", function(){
        resultAmt = Number(twentyFiveButton.value);
        displayGameList();
    })

    const fiftyButton = document.getElementsByName("FiftyButton")[0];
    fiftyButton.addEventListener("click", function(){
        resultAmt = Number(fiftyButton.value);
        displayGameList();
    })

    const oneHundredButton = document.getElementsByName("OneHundredButton")[0];
    oneHundredButton.addEventListener("click", function(){
        resultAmt = Number(oneHundredButton.value);
        displayGameList();
    })

    const allButton = document.getElementsByName("AllButton")[0];
    allButton.addEventListener("click", function(){
        resultAmt = Number(finalArray.length);
        displayGameList();
    })
}

function filterToggle(){
    let d = document.getElementById("FilterSwitch");
    if(d.value == "NO"){
        d.value = "YES";
    } else if(d.value == "YES"){
        d.value = "NO";
    }
}

function onlineToggle(){
    let c = document.getElementById("OnlineSwitch");
    if(c.value == "NO"){
        c.value = "YES";
    } else if(c.value == "YES"){
        c.value = "NO";
    }
}