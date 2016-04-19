/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 14:33:56
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-19 16:17:28
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
        	type: 'local',
        	forceFit: false,
        	allowFilter: true,
        	// allowPaging: true,
        	rud: {
        		read: 'http://localhost/inspinia/index.php',
        		update: 'http://localhost/inspinia/index.php'
        	},
        	pagingOption: {
        		totalItems: 3,
        		pagingSize: 3,
        		itemsPerPage: 1,
				boundaryLinkNumbers: true,
				rotate: false
        	}
        };
        $scope.cellFn_test = function(e, record){
			for(var i = 0; i < $scope.tblData.length; i++){
				if($scope.tblData[i].id == record.id)
					$scope.tblData.splice(i, 1);
			}
		}
		var dataModel = [{
		// 	dataIndex: 'id',
		// 	title: 'ID',
		// 	type: 'number',
		// 	allowFilter: false,
		// 	width: 60,
		// 	primary: true,
		// 	sortable: true,
		// 	editable: false
		// },{
			dataIndex: 'date',
			title: 'Date',
			type: 'date',
			width: 1400,
			dateFormat: 'dd-MM-yyyy',
			disableWeekend: true,
			minDate: new Date(),
			startingDay: 1
		},{
			dataIndex: 'browser',
			title: 'Browser',
			type: 'list',
			width: 240,
			sortable: true,
			btnDisplay: 'name',
			itemDisplay: 'name marker',
			valueDisplay: 'id',
			multiSelect: true,
			store: $scope.listBrowser
		},{
			dataIndex: 'id',
			title: 'Delete',
			type: 'html',
			width: 200,
			html: '<span ng-click="col.func($event, cell)"><i class="fa fa-trash" style="color:red;"></i></span>',
			func: $scope.cellFn_test
		}];
		$scope.tblModel = dataModel;
	});
	
	// .run(['$templateCache', function ($templateCache) {
	// 	$templateCache.put('template/table.html');
	// }]);