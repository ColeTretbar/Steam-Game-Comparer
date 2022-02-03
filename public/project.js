steamProject = function(){
    let finalArray = [],
    combinedArray = [],
    friendSteamId = [],
    onlineNameId = [],
    notPrivateList = [],
    priorityList = [],
    resultAmt = 0,
    // The beginning of the ignored games list/filtering feature, mainly proof of concept
    ignoreList = [737010, 770720, 205790, 700580, 623990, 858460, 367540, 427460, 545100, 234740, 931180, 774941, 362300, 439700, 232150, 1083500, 397080, 229660],
    result,
    json = [],
    friendText = [],
    resultsCompleted = false;

    // Resets all global scope variables within steamProject when Submit is hit again
    function resetData(){
        finalArray = [];
        combinedArray = [];
        friendSteamId = [];
        onlineNameId = [];
        notPrivateList = [];
        priorityList = [];
        resultAmt = 0;
        result;
        json = [];
        friendText = [];
        resultsCompleted = false;
    }
<<<<<<< HEAD

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
            onlineNameId.push({friendid: onlineData.response.players[x].steamid, friendname: onlineData.response.players[x].personaname, avatar: onlineData.response.players[x].avatarmedium});
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

    //  A loop for displaying all of the results into the console 
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

    for(ii = 1; ii < notPrivateList.length ; ii++){
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

    console.log(finalArray);

    // document.addEventListener('click', function(e){
    //     if(e.target.className=="included"){
    //         alert(e.target.);
    //     }
    // })

function displayGameList(){
    document.getElementById("steamResults").innerHTML = "";
    for(p = 0; p < resultAmt ; p++){
        if(finalArray[p].occurrences > 1){
            var logoAppid = finalArray[p].appid;
            var logoUrl = finalArray[p].img_logo_url;
            var img = document.createElement("img");
            img.src = "http://media.steampowered.com/steamcommunity/public/images/apps/" + logoAppid + "/" + logoUrl + ".jpg";
            var src = document.getElementById("steamResults");
=======
    
    // Takes user's steam id and sends to server
    async function addSteamId(){
        document.getElementById("steamResults").innerHTML = "";
        document.getElementsByName("PriorityList")[0].innerHTML = "";
        document.getElementsByName("PriorityList")[1].innerHTML = "";
        document.getElementById("onlineFriends").innerHTML = "";
>>>>>>> f2f4e00ff5f93741e60ce674c742b05ed9186785
        
        document.getElementById("SteamIDSubmit").disabled = true;
        document.getElementsByName("TenButton")[0].disabled = true;
        document.getElementsByName("TwentyFiveButton")[0].disabled = true;
        document.getElementsByName("FiftyButton")[0].disabled = true;
        document.getElementsByName("OneHundredButton")[0].disabled = true;
        document.getElementsByName("AllButton")[0].disabled = true;
        document.getElementById("FilterSwitch").disabled = true;
        document.getElementById("OnlineSwitch").disabled = true;

        if(document.getElementById("first-user-display") != null){
            let oldUser = document.getElementById("first-user-display");
            oldUser.remove();
            let anchor = document.getElementById("anchor")
            let loader = document.createElement("div");
            loader.className = "loader";
            loader.setAttribute("id", "loader");
            anchor.insertAdjacentElement("beforeend", loader);
            resetData();
        } else if(document.getElementById("first-user-display") == null){
            anchor = document.getElementById("anchor")
            let loader = document.createElement("div");
            loader.className = "loader";
            loader.setAttribute("id", "loader");
            anchor.insertAdjacentElement("beforeend", loader);
            resetData();
        }

        let steamId = document.getElementById("SteamIDButton").value;

        // This is the original user's steam id going to the server to request the steam api
        try{
            const server_url = `/firstUserGameApi/${steamId}`;
            const response = await fetch(server_url);
            json = await response.json();
        }catch(err){
            errorResetResult();
            return;
        }

        try{
            if(json.response.games == undefined ) throw "No Game Data";
        } catch(err){
            errorResetResult();
            return;
        }

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

        let orpl = onlineData.response.players.length;
        
        let includeOnline = document.getElementById("OnlineSwitch").value;
        
        // This checks for which steam ids are currently online
        for(x = 0; x < orpl; x++){
            if(includeOnline =="YES"){
                onlineNameId.push({friendid: onlineData.response.players[x].steamid, friendname: onlineData.response.players[x].personaname, avatar: onlineData.response.players[x].avatarmedium});
            }else if(includeOnline =="NO" && onlineData.response.players[x].personastate == 1){
                onlineNameId.push({friendid: onlineData.response.players[x].steamid, friendname: onlineData.response.players[x].personaname, avatar: onlineData.response.players[x].avatarmedium});
            }
        }
        
        onlineNameId.sort((y, z) => y.friendname.localeCompare(z.friendname))
        
        let ol = onlineNameId.length;
        
        // Loop that is getting the game list of each online steam id
        for(y = 0; y < ol; y++){
            const onlineGames_url = `/onlineGamesApi/${onlineNameId[y].friendid}`;
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
        }

        // This checks all arrays for occurrences of steam appids amongst all of the arrays
        // creates an occurrence for the original and all others for each unique appid
        result = combinedArray.reduce((res, arr, index) => {
            arr.forEach(({appid}) => {
                res[appid] =  res[appid] || {occurrences: 0};
                res[appid]['where'] = res[appid]['where'] || [];
                if(!res[appid]['where'].includes(index)){
                    res[appid]['where'].push(index);
                    res[appid].occurrences += 1;
                }
            });
            return res;
        },{})
        
        combinedArray.forEach(arr => arr.forEach(obj => Object.assign(obj, result[obj.appid])));
        
        // Sorts the occurrences from greatest to least
        finalArray = combinedArray[0].sort((x, y) => y.occurrences - x.occurrences || x.name.localeCompare(y.name));

        let pl = notPrivateList.length;

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
                document.getElementsByName("TenButton")[0].disabled = false;
                document.getElementsByName("TwentyFiveButton")[0].disabled = false;
                document.getElementsByName("FiftyButton")[0].disabled = false;
                document.getElementsByName("OneHundredButton")[0].disabled = false;
                document.getElementsByName("AllButton")[0].disabled = false;
                document.getElementById("FilterSwitch").disabled = false;
                document.getElementById("OnlineSwitch").disabled = false;
                document.getElementById("SteamIDSubmit").disabled = false;
                resultsCompleted = true;
            }
        }
    }

    const includedFilter = document.getElementById("page-content");
    includedFilter.addEventListener("click", function(e){
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
            } else if(priorityList.length < 1 && resultsCompleted == true){
                document.getElementsByName("PriorityList")[0].innerHTML = "Click on your friend's names if you choose to filter results.";
                document.getElementsByName("PriorityList")[1].innerHTML = "Click on your friend's names if you choose to filter results.";
                if(resultAmt != 0){
                    displayGameList();
                }
            }
        }
    })
        
    function displayGameList(){
        friendText = [];
        document.getElementById("steamResults").innerHTML = "";
        let gameNumber = 0;
        filterSwitch = document.getElementById("FilterSwitch").value;
        let gameMatch = false;
        let selectedResultAmt = resultAmt;
        for(p = 0; p < resultAmt ; p++){
            if(finalArray[p].occurrences > 1 && finalArray[p].occurrences != null){
                friendText = [];

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
                    let logoAppid = finalArray[p].appid,
                    logoUrl = finalArray[p].img_logo_url,
                    img = document.createElement("img"),
                    src = document.getElementById("steamResults"), 
                    resultDiv = document.createElement("div"),
                    resultPara = document.createElement("p"),
                    resultGame = document.createElement("p");

                    if(ignoreList.indexOf(logoAppid) > -1){
                        resultAmt += 1;
                        continue;
                    }

                    gameNumber += 1;
                    resultPara.innerHTML = "(" + (friendText.length)+ ") " + friendText.join(", ") + "." + "<br/>" + "<br/>" + "Game Number: " + (gameNumber);
                    img.src = "http://media.steampowered.com/steamcommunity/public/images/apps/" + logoAppid + "/" + logoUrl + ".jpg";
                    resultGame.appendChild(document.createTextNode(finalArray[p].name));
                    resultDiv.insertAdjacentElement("beforeend", img);
                    resultDiv.insertAdjacentElement("beforeend", resultGame);
                    resultDiv.insertAdjacentElement("beforeend", resultPara);
                    src.appendChild(resultDiv);
                } else {
                    gameMatch = false;
                    resultAmt += 1;
                }
            } else {
                resultAmt = selectedResultAmt;
                break;
            }
        }
        resultAmt = selectedResultAmt;
        friendText = [];
    }

    let enterSubmit = document.getElementById("SteamIDButton");
    enterSubmit.addEventListener("keyup", function(event){
        let clickEnter = event.key;
        if(clickEnter === "Enter"){
            if(json.length == 0 ||  document.getElementById("SteamIDButton").value != notPrivateList[0].friendid){
                document.getElementById("SteamIDSubmit").click();
            }
        }
    })

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

    function errorResetResult(){
        document.getElementsByName("TenButton")[0].disabled = false;
        document.getElementsByName("TwentyFiveButton")[0].disabled = false;
        document.getElementsByName("FiftyButton")[0].disabled = false;
        document.getElementsByName("OneHundredButton")[0].disabled = false;
        document.getElementsByName("AllButton")[0].disabled = false;
        document.getElementById("FilterSwitch").disabled = false;
        document.getElementById("OnlineSwitch").disabled = false;
        document.getElementById("SteamIDSubmit").disabled = false;
        if(document.getElementById("loader") != null){
            let loaderReset = document.getElementById("loader");
            loaderReset.remove();
        }
        document.getElementById("SteamIDButton").value = "Private or Incorrect ID";
    }
    return{
        addSteamId:addSteamId,
        onlineToggle:onlineToggle,
        filterToggle:filterToggle
    }
}();