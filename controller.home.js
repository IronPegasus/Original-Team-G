app.controller('HomeCtrl', ['$scope', '$location', 'DataService', function ($scope, $location, DataService) {
    var onLoad = checkData();
    var charPos = ["Y34", "", "S41", "U39", "@37", "&40", "Z36", "", "R34", "%36", "T29", "R39", "R33", "+40", "T27", "S39", "W39", "V39", "#42", "", "V34", "X28", "X39", "Y33", "$42", "=39", "Q33", "W32", "@36", "Y38"];
    var enemyPos = ["S26", "&17", "K45", "M21", "~18", "S29", "", "S27", "W20", "@11", "%11", "", "K41", "J42", "T21", "H35", "N26", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    $scope.kaden = "https://vignette4.wikia.nocookie.net/fireemblem/images/3/34/FE14_Nishiki_Fox_Spirit_Map_Sprite.gif/revision/latest?cb=20151107160827";
    
    //Reroutes the user if they haven't logged into the app
    //Loads data from the DataService if they have
    function checkData(){
    	if(DataService.getCharacters() == null)
    		$location.path('/');
    	else{
    		$scope.charaData = DataService.getCharacters();
    		$scope.enemyData = DataService.getEnemies();
    		//$scope.loadedChar = $scope.charaData[0];
    	}
    };
    
    $scope.calcNumRows = function(){
    	var rowNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "@", "#", "$", "%", "&", "=", "+", "~", ";", ">"];
    	var map = document.getElementById('map');
    	var height = map.naturalHeight; //calculate the height of the map
    	
    	height -= 36;
    	height = height / 34;
    	$scope.rows = rowNames.slice(0, height+1);
    };
    
   $scope.calcNumColumns = function(){
    	var map = document.getElementById('map');
    	var width = map.naturalWidth; //calculate the height of the map
    	
    	width -= 36;
    	width = width / 34;
    	$scope.columns = [];
    	
    	for(var i = 0; i < width; i++)
    		$scope.columns.push(i+1);
    };
    
    //Sets the character to display in the information box
    $scope.displayData = function(index){
    	//Relocate the character information box relative to the mouse if not displayed
    	if($scope.loadedChar == undefined){
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
    	}
		$scope.loadedChar = $scope.charaData[index];
    };
    
    //Removes the character being displayed in the info box
    $scope.removeData = function(){
    	$scope.loadedChar = undefined;
    };
    
    //Checks rate of atk/crit/hit/avo to see if they are greater than 0
    $scope.checkRate = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var rate = parseInt($scope.loadedChar[index]);
    	if(rate >= 0) return true;
    	else return false;
    };
    
    //Checks if a weapon name is a valid type, so that weapon proficiency can be displayed
    $scope.existsWeapon = function(index){
    	if($scope.loadedChar == undefined) return false;
    	var w = $scope.loadedChar[index];
    	return compareWeaponName(w);
    };
    
    $scope.existsEnemyWeapon = function(enemy,index){
    	var w = $scope.enemyData[enemy][index];
    	return compareWeaponName(w);
    };
    
    function compareWeaponName(weaponName){
    	if(weaponName == "Sword" || weaponName == "Lance" || weaponName == "Axe"
    		|| weaponName == "Tome" || weaponName == "Knife" || weaponName == "Bow"
    		|| weaponName == "Stone" || weaponName == "Staff")
    		return true;
    	else
    		return false;
    };
    
    //Returns the icon route relevant to the passed weapon type
    $scope.weaponIcon = function(index){    	
    	var w = $scope.loadedChar[index];
    	return getIcon(w);
    };
    
    $scope.enemyWeaponIcon = function(enemy,index){
    	var w = $scope.enemyData[enemy][index];
    	return getIcon(w);
    };
    
    function getIcon(weaponName){
    	if(weaponName == "Sword"){ return "IMG/sword_rank.png";}
    	if(weaponName == "Lance"){ return "IMG/lance_rank.png";}
    	if(weaponName == "Axe"){ return "IMG/axe_rank.png"; }
    	if(weaponName == "Tome"){ return "IMG/tome_rank.png"; }
    	if(weaponName == "Knife"){ return "IMG/star_rank.png"; }
    	if(weaponName == "Bow"){ return "IMG/bow_rank.png"; }
    	if(weaponName == "Stone"){ return "IMG/stone_rank.png"; }
    	if(weaponName == "Staff"){ return "IMG/stave_rank.png"; }
    	return "";
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
    $scope.validWeapon = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var weaponName = $scope.loadedChar[index][0];
    	if(weaponName != "-" && weaponName != "- (-)")
    		return true;
    	else return false;
    };
    
    $scope.validEnemyWeapon = function(enemy, index){
    	var weaponName = $scope.enemyData[enemy][index][0];
    	if(weaponName != "")
    		return true;
    	else return false;
    };
    
    $scope.weaponHasDes = function(index){
    	if($scope.loadedChar == undefined) return false;
    	return $scope.loadedChar[index].length == 20;
    };
    
    $scope.hasWeaponRange = function(index){
    	if($scope.loadedChar == undefined) return false;
    	return $scope.loadedChar[index][18] != "";
    };
    
    $scope.hasWeaponRank = function(index){
    	if($scope.loadedChar == undefined) return false;
    	return $scope.loadedChar[index][4] != "";
    };
    
    $scope.getWeaponClassIcon = function(index){
    	if($scope.loadedChar == undefined) return false;
    	var type = $scope.loadedChar[index][1];
    	type = type.toLowerCase();
    	return "IMG/type_" + type + ".png";
    };
    
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
    	if(value == 0) return false;
    	else return true;
    };
    
    //Checks if the loaded character is a) paired with someone
    //and b) if the stat has a buff that is != 0
    $scope.validPairUpBuff = function(index){
    	if($scope.loadedChar == undefined) return false;
    	if($scope.loadedChar[index] == "") return false;
    	
    	var value = parseInt($scope.loadedChar[index]);
    	if(value == 0) return false;
    	else return true;
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
    
    $scope.checkEShields = function(enemy, number){
    	if($scope.enemyData[enemy][3] >= number) return true;
    	else return false;
    };
    
    $scope.determineX = function(index, num){
    	var pos;
    	if(num == 0) pos = charPos[index];
    	else pos = enemyPos[index];
    	if(pos == "") return "0px";
    	
    	pos = pos.substring(1,pos.length); //grab last 1-2 chars
    	pos = parseInt(pos);
    	return ((pos*34)+2) + "px";
    };
    
    $scope.determineY = function(index, num){
    	var pos;
    	if(num == 0) pos = charPos[index];
    	else pos = enemyPos[index];
    	if(pos == "") return "0px";
    	
    	pos = pos.substring(0,1); //grab first char
    	//If pos is a letter
    	if(pos.match(/[A-Z]/i))
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
    
    $scope.determineGlowY = function(index){
    	var temp = (((index+1)*34)+2) + "px";
    	return temp;
    };
    
    $scope.determineGlowX = function(index){
    	var temp = (index*34) + "px";
    	return temp;
    };
    
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
    
    $scope.displayEInfoX = function(index){
    	var enemy = document.getElementById('enemy_'+index);
    	var enemyLeft = enemy.style.left;
    	enemyLeft = parseInt(enemyLeft.substring(0,enemyLeft.length-2));
    	var left = -488;
    	
    	if(enemyLeft + left < 0) left = 37;
    	
    	return left + "px";
    };
    
    //SUPPORT FOR DRAGABILITY
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
    
    var drag = document.getElementById('infoBox');
    var drop = document.getElementById('dropArea');
    var map = document.getElementById('map');
    drag.addEventListener('dragstart',dragStart,false);
    drop.addEventListener('dragenter',dragEnter,false);
    drop.addEventListener('dragover',dragOver,false);
    drop.addEventListener('drop',dropDiv,false);
    drop.style.width = map.naturalWidth + 'px';
	drop.style.height = map.naturalHeight + 'px';
}]);