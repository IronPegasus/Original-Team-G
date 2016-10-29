app.controller('HomeCtrl', ['$scope', '$location', 'DataService', function ($scope, $location, DataService) {
    var onLoad = checkData();
    
    function checkData(){
    	if(DataService.getSpreadsheet() == null)
    		$location.path('/');
    	else{
    		$scope.charaData = DataService.getSpreadsheet();
    		$scope.loadedChar = $scope.charaData[0];
    	}
    };
    
    $scope.displayData = function(index){
    	$scope.loadedChar = $scope.charaData[index];
    };
    
    $scope.checkRate = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var rate = parseInt($scope.loadedChar[index]);
    	if(rate >= 0) return true;
    	else return false;
    };
    
    $scope.existsWeapon = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var weaponName = $scope.loadedChar[index];
    	if(weaponName == "Sword" || weaponName == "Lance" || weaponName == "Axe"
    		|| weaponName == "Tome" || weaponName == "Knife" || weaponName == "Bow"
    		|| weaponName == "Stone" || weaponName == "Staff")
    		return true;
    	else
    		return false;
    };
    
    //Comment 2
    $scope.weaponIcon = function(index){    	
    	var weaponName = $scope.loadedChar[index];
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
    
    $scope.calcWeaponExp = function(index){
    	var exp = $scope.loadedChar[index];
    	var slash = exp.indexOf("/");
    	var progress = parseInt(exp.substring(0,slash));
    	var total = parseInt(exp.substring(slash+1,exp.length));
    	
    	return (progress/total) * 30;
    };
    
    $scope.validWeapon = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var weaponName = $scope.loadedChar[index];
    	if(weaponName != "-" && weaponName != "None" && weaponName != "- (-)")
    		return true;
    	else return false;
    };
    
    $scope.determineStatColor = function(stat){
    	var color = "#E5C68D"; //default tan
    	var debuff;
    	var weaponBuff;
    	var pairUp;
    	
    	if($scope.loadedChar == undefined) return color;
    	
    	//Determine appropriate indicies for stat being evaluated
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
    	}else{ return color; } //if string passed is invalid, quit
    	
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
    
    $scope.validDebuff = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	if($scope.loadedChar[index] == "") return false;
    	else return true;
    };
    
    $scope.validWeaponBuff = function(index){
    	if($scope.loadedChar == undefined) return false;
    	
    	var value = parseInt($scope.loadedChar[index]);
    	if(value == 0) return false;
    	else return true;
    };
    
    $scope.validPairUpBuff = function(index){
    	if($scope.loadedChar == undefined) return false;
    	if($scope.loadedChar[index] == "") return false;
    	
    	var value = parseInt($scope.loadedChar[index]);
    	if(value == 0) return false;
    	else return true;
    };
    
    $scope.checkLvl = function(lvlCap){
    	if($scope.loadedChar == undefined) return false;
    	
    	var lvl = parseInt($scope.loadedChar[2]);
    	if(lvl >= lvlCap) return true;
    	else return false;
    };
}]);