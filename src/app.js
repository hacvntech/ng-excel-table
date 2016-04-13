/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 14:33:56
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-14 00:21:55
*/
'use strict';
var app = angular.module('excelTable', ['excel-table','xtable.rowEdit']);
	app.controller('AppController', function AppController($scope) {
		var dataModel = [{
			dataIndex: 'id',
			title: 'ID',
			sortable: true,
			editable: false,
			type: 'number'
		},{
			dataIndex: 'name',
			title: 'Name',
			type: 'string'
		},{
			dataIndex: 'email',
			title: 'Email',
			sortable: true,
			type: 'string'
		}];
		var dataValue = [{
			id: 1,
			name: 'Mot',
			email: 'test4@gmail.com'
		},{
			id: 2,
			name: 'Hai',
			email: 'test2@gmail.com'
		},{
			id: 3,
			name: 'Ba',
			email: 'test6@gmail.com'
		}];
		$scope.tblModel = dataModel;
		$scope.tblData = dataValue;
	});
	
	// .run(['$templateCache', function ($templateCache) {
	// 	$templateCache.put('template/table.html');
	// }]);