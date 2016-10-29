app.service('DataService', ['$location', function ($location) {
	var spreadsheet;
	
	this.getSpreadsheet = function(){ return spreadsheet; };
	this.setSpreadsheet = function(s){ spreadsheet = s; };
}]);