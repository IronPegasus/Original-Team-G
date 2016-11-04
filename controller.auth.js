app.controller('AuthCtrl', ['$scope', '$location', 'DataService', function ($scope, $location, DataService) {
    var id = fetch();
    $scope.loadingIcon = pickLoadingIcon();
    var salvSheetId = '15e6GxH-FkGeRXrx3shsVencuJTnT8eQdaVM2MY9yy7A';
    var characterData;
    var enemyData;
    var wIndex;
    
    //Set div visibility
    var authorizeDiv = document.getElementById('authorize-div');
    var loadingDiv = document.getElementById('loading-div');
    loadingDiv.style.display = 'none';

    //Initiate auth flow in response to user clicking authorize button.
    $scope.loadAPI = function(event) {
    	gapi.client.init({
    		'apiKey': id, 
    		'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    	}).then(function(){
    		authorizeDiv.style.display = 'none';
    		loadingDiv.style.display = 'inline';
    		fetchCharacterData();
    	});
    };
    
    function pickLoadingIcon(){
    	var rand = Math.floor((Math.random() * 14) + 1); //generate a number between one and twelve
    	switch(rand){
	    	case 1: return "IMG/cavalier.gif"; break;
	    	case 2: return "IMG/darkmage.gif"; break;
	    	case 3: return "IMG/diviner.gif"; break;
	    	case 4: return "IMG/fighter.gif"; break;
	    	case 5: return "IMG/kitsune.gif"; break;
	    	case 6: return "IMG/knight.gif"; break;
	    	case 7: return "IMG/ninja.gif"; break;
	    	case 8: return "IMG/samurai.gif"; break;
	    	case 9: return "IMG/spearfighter.gif"; break;
	    	case 10: return "IMG/thief.gif"; break;
	    	case 11: return "IMG/archer.gif"; break;
	    	case 12: return "IMG/skyknight.gif"; break;
	    	case 13: return "IMG/wolfskin.gif"; break;
	    	case 14: return "IMG/troubadour.gif"; break;
    	}
    };

    //Fetch whole formatted spreadsheet
    function fetchCharacterData() {
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: salvSheetId,
        majorDimension: "ROWS",
        range: 'Ugly Characatures!A3:CU32',
      }).then(function(response) {
    	 characterData = response.result;
    	 fetchImageData();
      });
    };
    
    //Fetch image URLs and append them to characterData
    function fetchImageData(){
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: salvSheetId,
            majorDimension: "ROWS",
            valueRenderOption: "FORMULA",
            range: 'Characatures!B3:AH3',
          }).then(function(response) {
        	 var row = response.result.values[0];
        	 
        	//Properly format image URLs
         	 for(var i = 0; i < characterData.values.length; i++){
        		 var str = row[i];
        		 if(str != ""){
        			 var start = str.indexOf("\"")+1;
            		 var end = str.lastIndexOf("\"");
            		 var url = str.substring(start, end);
            		 
            		 //Append "s" to "http" if needed
            		 if(url.substring(0,5) != "https")
            			 url = url.substring(0,4) + "s" + url.substring(4,url.length);
            			 
            		 characterData.values[i].push(url); 
        		 }else{
        			 row.splice(i, 1);
        			 i-=1;
        		 }
        	 }
        	 fetchWeaponNames();
          });
    };
    
    //Fetch character inventories and append them to characterData
    function fetchWeaponNames(){
    	//Fetch inventories for each character
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: salvSheetId,
            majorDimension: "COLUMNS",
            range: 'Characatures!B27:AH31',
          }).then(function(response) {
        	  var weapons = response.result.values;
        	  
        	  //Fetch weapon information sheet
        	  gapi.client.sheets.spreadsheets.values.get({
                  spreadsheetId: salvSheetId,
                  majorDimension: "ROWS",
                  range: 'Weapon Index!A2:T',
                }).then(function(response2) {
                  wIndex = response2.result.values;
	         	  for(var i = 0; i < characterData.values.length; i++){
	         		 var charName = characterData.values[i][0];
	         		 if(charName == "Amy" || charName == "Asami" || charName == "Tristan"){
	         			 //Dual column processing
	         			 var column = weapons[i];
	         			 var uses = weapons[i+1];
	         			 weapons.splice(i+1,1); //remove uses column, don't mess up alignment!
	         			 
	         			 for(var j = 0; j < column.length; j++){
	         				var wRay = locateWeapon(column[j], wIndex);
	         				wRay[0] = column[j] + " (" + uses[j] + ")"; //append name with (uses)
	         				characterData.values[i].push(wRay);
	         			 }
	         		 }else{
	         			 //Normal column processing
	         			 var column = weapons[i];
	             		 for(var j = 0; j < column.length; j++){
	             			var wRay = locateWeapon(column[j], wIndex);
	             			characterData.values[i].push(wRay);
	             		 }
	         		 }
	         	  }
	         	  fetchSkillInfo();
                });
          });
    };
    
    //Fetch skills/descriptions for each character and append them
    function fetchSkillInfo(){
    	//Fetch skill names for each character
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: salvSheetId,
            majorDimension: "COLUMNS",
            range: 'Characatures!B35:AG42',
          }).then(function(response) {
        	  var skills = response.result.values;
        	  
        	  //Fetch normal skills and their matching descriptions
        	  gapi.client.sheets.spreadsheets.values.get({
                  spreadsheetId: salvSheetId,
                  majorDimension: "ROWS",
                  range: 'Skrillex!A1:B143',
                }).then(function(response2) {
                	 var skillDescriptions = response2.result.values;
                	 
                	 //Fetch personal skills and their matching descriptions
                	 gapi.client.sheets.spreadsheets.values.get({
                         spreadsheetId: salvSheetId,
                         majorDimension: "ROWS",
                         range: 'Personal Skrillex!B2:C31',
                       }).then(function(response3) {
                    	   var personalSkillsDesc = response3.result.values;
                    	   
                    	   for(var i = 0; i < characterData.values.length; i++){
                       		 var charSkl = skills[i];
                       		 if(charSkl.length > 0){
                                 for(var j = 0; j < charSkl.length; j++){
                                     characterData.values[i].push(findSkill(charSkl[j], skillDescriptions));
                                 }
                                 characterData.values[i].push(personalSkillsDesc[i]);
                       		 }else{
                       		     skills.splice(i,1);
                       		     i--;
                       		 }
                       	   }
                    	   
	                       DataService.setCharacters(characterData.values); //save compiled data
	                       getEnemyData();
                       });
                });
          });
    };
    
    //Fetch the entire contents of the enemies spreadsheet
    function getEnemyData(){
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: salvSheetId,
            majorDimension: "ROWS",
            range: 'Loser Cowards!A3:CD',
          }).then(function(response) {
       	   	  enemyData = response.result.values;
       	   	  enemyData.splice(40,2); //temp solution to extra data in spreadsheet
       	   	  
       	   	  //Replace weapon names with weapon data arrays
       	   	  for(var i = 0; i < enemyData.length; i++){
       	   		  for(var j = 29; j < 34; j++){
       	   			  enemyData[i][j] = locateWeapon(enemyData[i][j], wIndex);
       	   		  }
       	   	  }
       	   	  
              DataService.setEnemies(enemyData); //save compiled data
              redirect(); //go to map page
          });
    };
    
    //Search for skill
    function findSkill(skill, list){
    	for(var i = 0; i < list.length; i++)
    		if(list[i][0] == skill)
    			return list[i];
    	return [skill, "A description could not be found for this skill."];
    };
    
    function locateWeapon(name, list){
    	if(name.indexOf("(") != -1)
    		name = name.substring(0,name.indexOf("(")-1);
    	
    	if(name.indexOf("G") == name.length-1) //if last character in the string is G, it's money
    		return [name, "Gold", "-", "0", "Z", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "Wealth", "0", "I bet you could buy something nice with this."];
    	
    	for(var i = 0; i < list.length; i++)
    		if(list[i][0] == name)
    			return list[i].slice();
    	
    	return [name, "Mystery", "Mental", "0", "Z", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "Confusion", "0", "Couldn't find any data on this weapon."];
    };
    
    //Redirect user to the map page once data has been loaded
    function redirect(){
    	$scope.loadPercent = 100;
    	$location.path('/map').replace();
    	$scope.$apply();
    };
    
    function fetch(){
    	var request = new XMLHttpRequest();
    	request.open('GET', 'LIB/text.txt', false);
    	request.send();
    	if (request.status == 200)
    		return request.responseText;
    };
}]);