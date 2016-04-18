/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 14:33:56
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-18 09:51:23
*/
'use strict';
var app = angular.module('excelTable', ['excel-table','xtable.rowEdit']);
	app.controller('AppController', function AppController($scope) {
		$scope.listBrowser = [
            {id: "1", name: "Opera",              maker: "(Opera Software)"},
            {id: "2", name: "Internet Explorer",  maker: "(Microsoft)"},
            {id: "3", name: "Firefox",            maker: "(Mozilla Foundation)"},
            {id: "4", name: "Safari",             maker: "(Apple)"},
            {id: "5", name: "Chrome",             maker: "(Google)"}
        ];
        $scope.tblOption = {
        	allowPaging: true,
        	pagingType: 'local',
        	pagingOption: {
        		totalItems: 3,
        		pagingSize: 3,
        		itemsPerPage: 1,
				boundaryLinkNumbers: true,
				rotate: false
        	}
        };
		var dataModel = [{
			dataIndex: 'id',
			primary: true,
			title: 'ID',
			sortable: true,
			editable: false,
			type: 'number'
		},{
			dataIndex: 'date',
			title: 'Date',
			type: 'date',
			dateFormat: 'dd-MM-yyyy',
			disableWeekend: true,
			minDate: new Date(),
			startingDay: 1
		},{
			// dataIndex: 'email',
			// title: 'Email',
			// type: 'string'
			dataIndex: 'browser',
			title: 'Browser',
			sortable: true,
			type: 'list',
			btnDisplay: 'name',
			itemDisplay: 'name marker',
			valueDisplay: 'id',
			multiSelect: true,
			store: $scope.listBrowser
		}];
		var dataValue = [{
			id: 1,
			date: new Date(),
			browser: '1,2'
			// email: 'test4@gmail.com'
		},{
			id: 2,
			date: new Date(),
			browser: '2,3'
			// email: 'test2@gmail.com'
		},{
			id: 3,
			date: new Date(),
			browser: '3,4'
			// email: 'test6@gmail.com'
		}];
		$scope.tblModel = dataModel;
		$scope.tblData = dataValue;		
		// $scope.tblData1 = dataValue;

	});
	
	// .run(['$templateCache', function ($templateCache) {
	// 	$templateCache.put('template/table.html');
	// }]);