app.controller('AuthCtrl', ['$scope', '$location', 'DataService', function ($scope, $location, DataService) {
    var CLIENT_ID = '509645279366-8vjrdi5uk9a5fccm7obka9jip3iieebb.apps.googleusercontent.com';
    var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    var spreadsheetData;
    
    //Check if current user has authorized this application.
    function checkAuth() {
      gapi.auth.authorize(
        {
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
          'immediate': true
        }, handleAuthResult);
    };

    //Handle response from authorization server.
    function handleAuthResult(authResult) {
      var authorizeDiv = document.getElementById('authorize-div');
      if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        loadSheetsApi();
      } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
      }
    };

    //Initiate auth flow in response to user clicking authorize button.
    $scope.handleAuthClick = function(event) {
      gapi.auth.authorize(
        {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
        handleAuthResult);
      return false;
    };
    
    //Load Sheets API client library
    function loadSheetsApi() {
      var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
      gapi.client.load(discoveryUrl).then(fetchSpreadsheetData);
    };

    //Fetch whole formatted spreadsheet
    function fetchSpreadsheetData() {
      gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '15e6GxH-FkGeRXrx3shsVencuJTnT8eQdaVM2MY9yy7A',
        majorDimension: "ROWS",
        range: 'Ugly Characatures!A3:CU32',
      }).then(function(response) {
    	 spreadsheetData = response.result;
    	 fetchImageData();
      });
    };
    
    function fetchImageData(){
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '15e6GxH-FkGeRXrx3shsVencuJTnT8eQdaVM2MY9yy7A',
            majorDimension: "ROWS",
            valueRenderOption: "FORMULA",
            range: 'Characatures!B3:AH3',
          }).then(function(response) {
        	 var row = response.result.values[0];
         	 for(var i = 0; i < spreadsheetData.values.length; i++){
        		 var str = row[i];
        		 if(str != ""){
        			 var start = str.indexOf("\"")+1;
            		 var end = str.lastIndexOf("\"");
            		 var url = str.substring(start, end);
            		 spreadsheetData.values[i].push(url); 
        		 }else{
        			 row.splice(i, 1);
        			 i-=1;
        		 }
        	 }
        	 
        	 fetchWeaponNames();
          });
    };
    
    function fetchWeaponNames(){
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '15e6GxH-FkGeRXrx3shsVencuJTnT8eQdaVM2MY9yy7A',
            majorDimension: "COLUMNS",
            range: 'Characatures!B27:AH31',
          }).then(function(response) {
        	  var weapons = response.result.values;
         	  for(var i = 0; i < spreadsheetData.values.length; i++){
         		 var charName = spreadsheetData.values[i][0];
         		 if(charName == "Amy" || charName == "Asami" || charName == "Tristan"){
         			 //Dual column processing
         			 var column = weapons[i];
         			 var uses = weapons[i+1];
         			 weapons.splice(i+1,1); //remove uses column, don't mess up alignment!
         			 
         			 for(var j = 0; j < column.length; j++)
             			 spreadsheetData.values[i].push(column[j] + " (" + uses[j] + ")");
         		 }else{
         			 //Normal column processing
         			 var column = weapons[i];
             		 for(var j = 0; j < column.length; j++)
             			 spreadsheetData.values[i].push(column[j]);
         		 }
         	  }
        	 
        	 fetchSkillInfo();
          });
    };
    
    function fetchSkillInfo(){
    	//Fetch skill names for each character
    	gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '15e6GxH-FkGeRXrx3shsVencuJTnT8eQdaVM2MY9yy7A',
            majorDimension: "COLUMNS",
            range: 'Characatures!B35:AG42',
          }).then(function(response) {
        	  var skills = response.result.values;
        	  
        	  //Fetch normal skills and their matching descriptions
        	  gapi.client.sheets.spreadsheets.values.get({
                  spreadsheetId: '15e6GxH-FkGeRXrx3shsVencuJTnT8eQdaVM2MY9yy7A',
                  majorDimension: "ROWS",
                  range: 'Skrillex!A1:B143',
                }).then(function(response2) {
                	 var skillDescriptions = response2.result.values;
                	 
                	 //Fetch personal skills and their matching descriptions
                	 gapi.client.sheets.spreadsheets.values.get({
                         spreadsheetId: '15e6GxH-FkGeRXrx3shsVencuJTnT8eQdaVM2MY9yy7A',
                         majorDimension: "ROWS",
                         range: 'Personal Skrillex!B2:C31',
                       }).then(function(response3) {
                    	   var personalSkillsDesc = response3.result.values;
                    	   for(var i = 0; i < spreadsheetData.values.length; i++){
                       		 var charSkl = skills[i];
                       		 if(charSkl.length > 0){
                                 for(var j = 0; j < charSkl.length; j++){
                                     spreadsheetData.values[i].push(findSkill(charSkl[j], skillDescriptions));
                                 }
                                 spreadsheetData.values[i].push(personalSkillsDesc[i]);
                       		 }else{
                       		     skills.splice(i,1);
                       		     i--;
                       		 }
                       	   }
                    	   
	                       DataService.setSpreadsheet(spreadsheetData.values); //save compiled data
	                       redirect(); //go to map page
                       });
                });
          });
    };
    
    function findSkill(skill, list){
    	for(var i = 0; i < list.length; i++)
    		if(list[i][0] == skill)
    			return list[i];
    	return [skill, "A description could not be found for this skill."];
    };
    
    function redirect(){
    	$location.path('/map').replace();
    	$scope.$apply();
    };
}]);