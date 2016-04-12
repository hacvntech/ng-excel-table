'use strict';

angular.module('excel-table')
	.controller('ExcelTableController', function ExcelTableController($scope, TableModel) {
		$scope.tblModel = TableModel.getModel();
		$scope.tblData = TableModel.getData();
		
		$scope.cellClick = function(obj, $event){
			console.log($event.target);
		}
	});