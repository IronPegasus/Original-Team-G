app.controller('HomeCtrl', ['$scope', '$location', '$interval', 'DataService', function ($scope, $location, $interval, DataService) {
	$scope.rows = ["A"];
    $scope.columns = ["1"];
	var onLoad = checkData();
    var charPos = ["Y34", "", "", "U39", "@37", "&40", "Z36", "", "", "%36", "T29", "R39", "R33", "+40", "T27", "S39", "W39", "V39", "#42", "", "V34", "", "X39", "Y33", "$42", "=39", "Q33", "W32", "@36", "Y38"];
    var enemyPos = ["M16", "&17", "K45", "M21", "~18", "S29", "A1", "S27", "W20", "A13", "", "A2", "K41", "J42", "T21", "H35", "N26", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "A12", "", "A14", "A15", "A16", "A17", "A18", "A19", "A20", "A21", "A22", "A23", "", "A25", "A26", "A27", "A28", "A29", "A30", "A31"];
    $scope.kaden = "IMG/kitsune.gif";
    var rowTimer = $interval(calcNumRows, 250, 20); //attempt to get rows 20 times at 250 ms intervals (total run: 5 sec)
    var colTimer = $interval(calcNumColumns, 250, 20);
    
    //Reroutes the user if they haven't logged into the app
    //Loads data from the DataService if they have
    function checkData(){
    	if(DataService.getCharacters() == null)
    		$location.path('/');
    	else{
    		$scope.charaData = DataService.getCharacters();
    		$scope.enemyData = DataService.getEnemies();
    	}
    };
    
    /* Using the height of the map image, calculates the number of tiles tall
     * the map is and returns a subsection of the rowNames array of that size.
     * Called every 250 ms for the first 5 seconds the app is open.
     */
    function calcNumRows(){
    	var rowNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "@", "#", "$", "%", "&", "=", "+", "~", ";", ">"];
    	var map = document.getElementById('map');
    	var height = map.naturalHeight; //calculate the height of the map
    	
    	height -= 36;
    	height = height / 34;
    	var temp = rowNames.slice(0, height+1);
    	
    	if(temp.length != 0){
    		$interval.cancel(rowTimer); //cancel $interval timer
    		$scope.rows = temp;
    	}
    };
    
    /* Using the width of the map image, calculates the number of tiles wide
     * the map is and returns an array of that size.
     * Called every 250 ms for the first 5 seconds the app is open.
     */
   function calcNumColumns(){
    	var map = document.getElementById('map');
    	var width = map.naturalWidth; //calculate the height of the map
    	
    	width -= 36;
    	width = width / 34;
    	var temp = [];
    	
    	for(var i = 0; i < width; i++)
    		temp.push(i+1);
    	
    	if(temp.length != 0){
    		$interval.cancel(colTimer); //cancel $interval timer
    		$scope.columns = temp;
    	}
    };
    
    //Sets the character to display in the information box
    $scope.displayData = function(index){
    	if($scope.loadedChar == undefined)
    		positionCharBox(index);
    	
    	//Close the box if you click the same character again
    	if($scope.loadedChar == $scope.charaData[index])
    		$scope.loadedChar = undefined;
    	else 
    		$scope.loadedChar = $scope.charaData[index];
    };
    
    //Relocate the information box relative to the clicked char
    function positionCharBox(index){
    	var div = document.getElementById('char_'+index);
		var x = div.style.left;
    	var y = div.style.top;
    	x = parseInt(x.substring(0, x.length-2));
    	y = parseInt(y.substring(0, y.length-2));
    	
    	if(x < 671) x += 40;	
    	else x -= 671;
    	
    	if(y < 77) y += 40;
    	else y -= 77;
    	
    	drag.style.left = x + 'px';
    	drag.style.top = y + 'px';
    };
    
    //Returns true if the enemy has a coordinate on the map
    //Units in the back of a pair up should have a coordinate of ""
    $scope.enemyHasPos = function(index){
    	if(enemyPos[index] != "") return true;
    	else return false;
    }
    
    //Removes the character being displayed in the info box and hides it
    $scope.removeData = function(){
    	$scope.loadedChar = undefined;
    };
    
    //Returns true if a character has a position coordinate
    $scope.hasPos = function(index){
    	return charPos[index] != "";
    };
    
    //Returns true if the currently loaded character is paired up with another character
    $scope.ifPaired = function(){
    	if($scope.loadedChar == undefined) return false;
    	return $scope.loadedChar[57] != "None";
    };
    
    //Returns true if the unit at index is paired up
    $scope.isPairedAllChars = function(index){
    	return $scope.charaData[index][57] != "None";
    };
    
    $scope.getPairUnitIcon = function(index){
    	var pairedUnit = $scope.charaData[index][57]; //get paired unit's name
    	var found = false;
    	var inc = 0;
    	
    	//Find paired unit
    	while(!found && inc < $scope.charaData.length){
    		if($scope.charaData[inc][0] == pairedUnit){
    			found = true;
    		}else inc++;
    	}
    	
    	return $scope.charaData[inc][99];
    };
    
    //Returns true if the enemy at index is paired up
    $scope.enemyIsPaired = function(index){
    	return $scope.enemyData[index][2] != "None";
    };
    
    /* Triggered when the enemy's "Switch to Paired Unit" button is clicked
     * Finds paired unit, relocates its info box to the same position as the currently
     * open one and displays it. Old info box is hidden.
     * WARNING: DOESN'T WORK PROPERLY IF BOTH UNITS ARE DISPLAYED BECAUSE OF RELIANCE
     * ON SPRITE BEING HIDDEN
     */
    $scope.toggleEnemyPair = function(index){
    	var pairUp = $scope.enemyData[index][2]; //get paired unit's name
    	var found = false;
    	var inc = 0;
    	
    	//Find paired unit
    	while(!found && inc < $scope.enemyData.length){
    		if($scope.enemyData[inc][0] == pairUp) found = true;
    		else inc++;
    	}
    	
    	//Checks if the enemy the info box belongs to is hidden
    	var spriteHidden;
    	if(enemyPos[index] == "") spriteHidden = true;
    	else spriteHidden = false;
    	
    	//Collect info about the current info box and the info box to be displayed
    	var currBox = document.getElementById('enemy_' + index + '_box');
    	var currBoxScope = angular.element(currBox).scope();
    	var pairBox = document.getElementById('enemy_' + inc + '_box');
    	var pairBoxScope = angular.element(pairBox).scope();
    	
    	//Toggle visibility
    	currBoxScope.viewInfo = false;
    	pairBoxScope.viewInfo = true;
    	
    	//If the sprite is not hidden (enemy is in front of pair up), relocate paired unit's info box
    	if(!spriteHidden){
    		var currEnemy = document.getElementById('enemy_' + index);
    		pairBox.style.top = (currBox.offsetTop + currEnemy.offsetTop) + 'px';
        	pairBox.style.left = (currBox.offsetLeft + currEnemy.offsetLeft) + 'px';
    	}
    };
    
    //Switches char info box to show the stats of the paired unit
    //Triggered when char info box "Switch to Paired Unit" button is clicked
    $scope.findPairUpChar = function(){
    	if($scope.loadedChar == undefined) return false;
    	var pairedUnit = $scope.loadedChar[57]; //get paired unit's name
    	var found = false;
    	var inc = 0;
    	
    	//Find paired unit
    	while(!found && inc < $scope.charaData.length){
    		if($scope.charaData[inc][0] == pairedUnit){
    			$scope.loadedChar = $scope.charaData[inc];
    			found = true;
    		}else inc++;
    	}
    };
    
    //Checks rate of atk/crit/hit/avo (@ index) to see if they are greater than 0
    $scope.checkRate = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var rate = parseInt($scope.loadedChar[index]);
    	if(rate >= 0) return true;
    	else return false;
    };
    
    //Checks if a weapon name is a valid type, so that weapon proficiency can be displayed
    //Version for characters
    $scope.existsWeapon = function(index){
    	if($scope.loadedChar == undefined) return false;
    	var w = $scope.loadedChar[index];
    	return compareWeaponName(w);
    };
    
    //Checks if a weapon name is a valid type, so that weapon proficiency can be displayed
    //Version for enemies
    $scope.existsEnemyWeapon = function(enemy,index){
    	var w = $scope.enemyData[enemy][index];
    	return compareWeaponName(w);
    };
    
    //Helper function
    function compareWeaponName(weaponName){
    	if(weaponName != "" && weaponName != "N/A") return true;
    	else return false;
    };
    
    //Checks if the passed "type" is listed in the effectiveness column of a character's weapon
    //(Ex. Flier, Monster, Beast, Dragon, Armor)
    $scope.weaponEffective = function(index, type){
    	if($scope.loadedChar == undefined) return false;
    	
    	var types = $scope.loadedChar[index][17];
    	types = types.toLowerCase();
    	if(types.indexOf(type) != -1) return true;
    	else return false;
    };
    
    //Checks if the passed "type" is listed in the effectiveness column of an enemy's weapon
    //(Ex. Flier, Monster, Beast, Dragon, Armor)
    $scope.enemyWeaponEffective = function(enemy, index, type){
    	var types = $scope.enemyData[enemy][index][17];
    	types = types.toLowerCase();
    	if(types.indexOf(type) != -1) return true;
    	else return false;
    };
    
    //Returns the weapon rank icon relevant to the passed weapon type
    $scope.weaponIcon = function(index){    	
    	var w = $scope.loadedChar[index];
    	return getIcon(w);
    };
    
    //Returns the weapon rank icon relevant to the passed weapon type
    $scope.enemyWeaponIcon = function(enemy,index){
    	var w = $scope.enemyData[enemy][index];
    	return getIcon(w);
    };
    
    //Helper function :)
    function getIcon(weaponName){
    	var c = weaponName.toLowerCase();
    	return "IMG/rank_" + c + ".png";
    };
    
    //Calculates the percentage of weapon proficicency for a specific weapon,
    //then returns the width of the progress bar in pixels
    $scope.calcWeaponExp = function(index){
    	if($scope.loadedChar == undefined) return 0;
    	
    	var exp = $scope.loadedChar[index];
    	var slash = exp.indexOf("/");
    	var progress = parseInt(exp.substring(0,slash));
    	var total = parseInt(exp.substring(slash+1,exp.length));
    	
    	return (progress/total) * 30;
    };
    
    //Checks to see if the weapon name in the passed slot is null
    //Version for characters
    $scope.validWeapon = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var weaponName = $scope.loadedChar[index][0];
    	if(weaponName != "-" && weaponName != "- (-)")
    		return true;
    	else return false;
    };
    
    //Checks to see if the weapon name in the passed slot is null
    //Version for enemies
    $scope.validEnemyWeapon = function(enemy, index){
    	var weaponName = $scope.enemyData[enemy][index][0];
    	if(weaponName != "")
    		return true;
    	else return false;
    };
    
    //Returns true if the weapon at the index has a description
    $scope.weaponHasDes = function(index){
    	if($scope.loadedChar == undefined) return false;
    	return $scope.loadedChar[index].length == 20;
    };
    
    //Returns true if the weapon at the index has a listed range
    $scope.hasWeaponRange = function(index){
    	if($scope.loadedChar == undefined) return false;
    	return $scope.loadedChar[index][18] != "";
    };
    
    //Returns true if the weapon at the index has a listed rank
    $scope.hasWeaponRank = function(index){
    	if($scope.loadedChar == undefined) return false;
    	return $scope.loadedChar[index][4] != "";
    };
    
    //Returns the icon for the class of the weapon at the index
    //Version for characters
    $scope.getWeaponClassIcon = function(index){
    	if($scope.loadedChar == undefined) return false;
    	var type = $scope.loadedChar[index][1];
    	type = type.toLowerCase();
    	return "IMG/type_" + type + ".png";
    };
    
    //Returns the icon for the class of the weapon at the index
    //Version for enemies
    $scope.getEnemyWeaponClassIcon = function(enemy,index){
    	var type = $scope.enemyData[enemy][index][1];
    	type = type.toLowerCase();
    	return "IMG/type_" + type + ".png";
    };
    
    /* Calculates total buff/debuffs for each stat (str/mag/skl/etc) and
     * returns the appropriate text color.
     * red (#af2b00) <- total<0
     * blue (#42adf4) <- total>0
     * tan (#E5C68D) <- total=0
     */
    $scope.determineStatColor = function(stat){
    	var color = "#E5C68D"; //default tan
    	var debuff;
    	var weaponBuff;
    	var pairUp;
    	
    	if($scope.loadedChar == undefined) return color; //returns tan
    	
    	//Determine appropriate indicies for stat being evaluated (passed string)
    	if(stat == "str"){
    		debuff = 19; weaponBuff = 45; pairUp = 59;
    	}else if(stat == "mag"){
    		debuff = 20; weaponBuff = 46; pairUp = 60;
    	}else if(stat == "skl"){
    		debuff = 21; weaponBuff = 47; pairUp = 61;
    	}else if(stat == "spd"){
    		debuff = 22; weaponBuff = 48; pairUp = 62;
    	}else if(stat == "lck"){
    		debuff = 23; weaponBuff = 49; pairUp = 63;
    	}else if(stat == "def"){
    		debuff = 24; weaponBuff = 50; pairUp = 64;
    	}else if(stat == "res"){
    		debuff = 25; weaponBuff = 51; pairUp = 65;
    	}else{ return color; } //if string passed is invalid, return tan
    	
    	if($scope.loadedChar[debuff] == "") debuff = 0;
    	else debuff = parseInt($scope.loadedChar[debuff]);
    	
    	weaponBuff = parseInt($scope.loadedChar[weaponBuff]);
    	
    	if($scope.loadedChar[pairUp] == "") pairUp = 0;
    	else pairUp = parseInt($scope.loadedChar[pairUp]);
    	
    	var totalBuffs = debuff + weaponBuff + pairUp;
    	if(totalBuffs > 0)
    		color = "#42adf4"; //blue buff
    	else if(totalBuffs < 0)
    		color = "#af2b00"; //red debuff
    	return color;
    };
    
    $scope.determineEnemyStatColor = function(stat, index){
    	var color = "#E5C68D"; //default tan
    	var debuff;
    	var weaponBuff;
    	var pairUp;
    	
    	//Determine appropriate indicies for stat being evaluated (passed string)
    	if(stat == "str"){
    		debuff = 16; weaponBuff = 59; pairUp = 66;
    	}else if(stat == "mag"){
    		debuff = 17; weaponBuff = 60; pairUp = 67;
    	}else if(stat == "skl"){
    		debuff = 18; weaponBuff = 61; pairUp = 68;
    	}else if(stat == "spd"){
    		debuff = 19; weaponBuff = 62; pairUp = 69;
    	}else if(stat == "lck"){
    		debuff = 20; weaponBuff = 63; pairUp = 70;
    	}else if(stat == "def"){
    		debuff = 21; weaponBuff = 64; pairUp = 71;
    	}else if(stat == "res"){
    		debuff = 22; weaponBuff = 65; pairUp = 72;
    	}else{ return color; } //if string passed is invalid, return tan
    	
    	var enemy = $scope.enemyData[index];
    	
    	debuff = parseInt(enemy[debuff]);
    	weaponBuff = parseInt(enemy[weaponBuff]);
    	
    	if(enemy[pairUp] == "") pairUp = 0;
    	else pairUp = parseInt(enemy[pairUp]);
    	
    	var totalBuffs = debuff + weaponBuff + pairUp;
    	if(totalBuffs > 0)
    		color = "#42adf4"; //blue buff
    	else if(totalBuffs < 0)
    		color = "#af2b00"; //red debuff
    	return color;
    };
    
    //Checks if there is a value in the index
    $scope.validDebuff = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	if($scope.loadedChar[index] == "") return false;
    	else return true;
    };
    
    //Checks if the value in the index is != 0
    $scope.validWeaponBuff = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var value = parseInt($scope.loadedChar[index]);
    	return value != 0;
    };
    
    //Checks if the loaded character is a) paired with someone
    //and b) if the stat has a buff that is != 0
    $scope.validPairUpBuff = function(index){
    	if($scope.loadedChar == undefined) return false;
    	if($scope.loadedChar[index] == "") return false;
    	
    	var value = parseInt($scope.loadedChar[index]);
    	return value != 0;
    };
    
    $scope.formatWeaponBuff = function(index){
    	var value = parseInt($scope.loadedChar[index]);
    	if(value > 0) return "+" + value;
    	else return value;
    };
    
    //For displaying skill gems, checks to see if the character's
    //level >= lvlCap (passed in, value at which character obtains skill)
    $scope.checkLvl = function(lvlCap){
    	if($scope.loadedChar == undefined) return false;
    	
    	var lvl = parseInt($scope.loadedChar[2]);
    	if(lvl >= lvlCap) return true;
    	else return false;
    };
    
    //For displaying enemy skill gems, checks to see if the enemy has a
    //skill name in that slot
    $scope.hasSkill = function(enemy,index){
    	if($scope.enemyData[enemy][index] != "-") return true;
    	else return false;
    };
    
    //Checks if the shield value for the passed enemy is greater than number
    $scope.checkEShields = function(enemy, number){
    	var value = parseInt($scope.enemyData[enemy][3]);
    	if(value >= number) return true;
    	else return false;
    };
    
    //Parses an enemy's name to see if it contains a number at the end.
    //If it does, it returns that number
    $scope.getEnemyNum = function(index){
    	var name = $scope.enemyData[index][0];
    	if(name.lastIndexOf(" ") == -1 || name == undefined)
    		return "";
    	name = name.substring(name.lastIndexOf(" ")+1, name.length);
    	
    	if(name.match(/^[0-9]+$/) != null) return name;
    	else return "";
    };
    
    //***********************\\
    // X,Y POSITION SETTING  \\
    // FOR VARIOUS THINGS    \\
    //***********************\\
    
    //Using a character's coordinates, calculates their horizontal
    //position on the map
    $scope.determineX = function(index, num){
    	var pos;
    	if(num == 0) pos = charPos[index];
    	else pos = enemyPos[index];
    	if(pos == "") return "0px";
    	
    	pos = pos.substring(1,pos.length); //grab last 1-2 chars
    	pos = parseInt(pos);
    	return ((pos*34)+2) + "px";
    };
    
    //Using a character's coordinates, calculates their vertical
    //position on the map
    $scope.determineY = function(index, num){
    	var pos;
    	if(num == 0) pos = charPos[index];
    	else pos = enemyPos[index];
    	if(pos == "") return "0px";
    	
    	pos = pos.substring(0,1); //grab first char
    	if(pos.match(/[A-Z]/i)) //If pos is a letter
    		return (-34*(64-pos.charCodeAt(0))+2) + "px";
    	
    	switch(pos){
    		case '@': pos = 27; break;
    		case '#': pos = 28; break;
    		case '$': pos = 29; break;
    		case '%': pos = 30; break;
    		case '&': pos = 31; break;
    		case '=': pos = 32; break;
    		case '+': pos = 33; break;
    		case '~': pos = 34; break;
    		case ';': pos = 35; break;
    		case '>': pos = 36; break;
    		default: pos = 0; break;
    	}
    	
    	return ((pos*34)+2) + "px";
    };
    
    //Returns the vertical position of a glowBox element
    $scope.determineGlowY = function(index){
    	return (((index+1)*34)+2) + "px";
    };
    
    //Returns the horizontal position of a glowBox element
    $scope.determineGlowX = function(index){
    	return (index*34) + "px";
    };
    
    //Calculates the vertical position of an enemy's information box,
    //relative to the enemy itself
    $scope.displayEInfoY = function(index){
    	var enemy = document.getElementById('enemy_'+index);
    	var map = document.getElementById('map');
    	var pageBottom = map.naturalHeight;
    	var top = -69;
    	var enemyTop = enemy.style.top;
    	enemyTop = parseInt(enemyTop.substring(0,enemyTop.length-2));
    	
    	if(enemyTop < 69) top = 0;
    	else if(enemyTop + 109 > pageBottom) top = -1* (pageBottom - enemyTop);
    	
    	return top + "px";
    };
    
    //Calculates the horiztonal position of an enemy's information box, relative
    //to the enemy itself
    $scope.displayEInfoX = function(index){
    	var enemy = document.getElementById('enemy_'+index);
    	var enemyLeft = enemy.style.left;
    	enemyLeft = parseInt(enemyLeft.substring(0,enemyLeft.length-2));
    	var left = -488;
    	
    	if(enemyLeft + left < 0) left = 37;
    	
    	return left + "px";
    };
    
    //*************************\\
    // SUPPORT FOR DRAGABILITY \\
    // OF CHAR INFO BOX        \\
    //*************************\\
    
    function dragStart(event){
    	var style = window.getComputedStyle(event.target, null);
        event.dataTransfer.setData("text/html",(parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
    };
    
    function dragOver(event){
    	event.preventDefault();
    	return false;
    };
    
    function dragEnter(event){
    	event.preventDefault();
    };
    
    function dropDiv(event){
    	event.preventDefault();
    	var drag = document.getElementById('infoBox');
    	var offset = event.dataTransfer.getData("text/html").split(',');
    	drag.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    	drag.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    };
    
    //Set event listeners to be activated when the div is dragged
    var drag = document.getElementById('infoBox');
    var drop = document.getElementById('dropArea');
    drag.addEventListener('dragstart',dragStart,false);
    drop.addEventListener('dragenter',dragEnter,false);
    drop.addEventListener('dragover',dragOver,false);
    drop.addEventListener('drop',dropDiv,false);
}]);