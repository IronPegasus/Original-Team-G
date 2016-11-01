app.controller('AuthCtrl', ['$scope', '$location', 'DataService', function ($scope, $location, DataService) {
    var id = fetch();
    var salvSheetId = '15e6GxH-FkGeRXrx3shsVencuJTnT8eQdaVM2MY9yy7A';
    var characterData;
    var enemyData;
    
    $scope.loadPercent = 0;
    var loadIncrement = 14;
    
    //Set div visibility
    var authorizeDiv = document.getElementById('authorize-div');
    var yatoDiv = document.getElementById('yato-div');
    var yatoOutlineDiv = document.getElementById('yato-outline-div');
    yatoDiv.style.display = 'none';
    yatoOutlineDiv.style.display = 'none';

    //Initiate auth flow in response to user clicking authorize button.
    $scope.loadAPI = function(event) {
    	gapi.client.init({
    		'apiKey': id, 
    		'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    	}).then(function(){
    		authorizeDiv.style.display = 'none';
	      	yatoDiv.style.display = 'inline';
	      	yatoOutlineDiv.style.display = 'inline';
    		fetchCharacterData();
    	});
    };

    //Fetch whole formatted spreadsheet
    function fetchCharacterData() {
      $scope.loadPercent += loadIncrement;
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
    	$scope.loadPercent += loadIncrement;
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
    	$scope.loadPercent += loadIncrement;
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: salvSheetId,
            majorDimension: "COLUMNS",
            range: 'Characatures!B27:AH31',
          }).then(function(response) {
        	  var weapons = response.result.values;
         	  for(var i = 0; i < characterData.values.length; i++){
         		 var charName = characterData.values[i][0];
         		 if(charName == "Amy" || charName == "Asami" || charName == "Tristan"){
         			 //Dual column processing
         			 var column = weapons[i];
         			 var uses = weapons[i+1];
         			 weapons.splice(i+1,1); //remove uses column, don't mess up alignment!
         			 
         			 for(var j = 0; j < column.length; j++)
             			 characterData.values[i].push(column[j] + " (" + uses[j] + ")");
         		 }else{
         			 //Normal column processing
         			 var column = weapons[i];
             		 for(var j = 0; j < column.length; j++)
             			 characterData.values[i].push(column[j]);
         		 }
         	  }
        	 fetchSkillInfo();
          });
    };
    
    //Fetch skills/descriptions for each character and append them
    function fetchSkillInfo(){
    	$scope.loadPercent += loadIncrement;
    	
    	//Fetch skill names for each character
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: salvSheetId,
            majorDimension: "COLUMNS",
            range: 'Characatures!B35:AG42',
          }).then(function(response) {
        	  var skills = response.result.values;
        	  $scope.loadPercent += loadIncrement;
        	  
        	  //Fetch normal skills and their matching descriptions
        	  gapi.client.sheets.spreadsheets.values.get({
                  spreadsheetId: salvSheetId,
                  majorDimension: "ROWS",
                  range: 'Skrillex!A1:B143',
                }).then(function(response2) {
                	 var skillDescriptions = response2.result.values;
                	 $scope.loadPercent += loadIncrement;
                	 
                	 //Fetch personal skills and their matching descriptions
                	 gapi.client.sheets.spreadsheets.values.get({
                         spreadsheetId: salvSheetId,
                         majorDimension: "ROWS",
                         range: 'Personal Skrillex!B2:C31',
                       }).then(function(response3) {
                    	   var personalSkillsDesc = response3.result.values;
                    	   $scope.loadPercent += loadIncrement;
                    	   
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