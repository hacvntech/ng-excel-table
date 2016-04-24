/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 14:33:56
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-24 12:13:18
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
        	forceFit: true,
        	allowFilter: true,
        	allowPaging: true,
        	dblClickToEdit: true,
        	rud: {
        		customScopeParams: 'jsonObject',
        		read: {
        			type: 'local',
        			header: {
                        'Content-type':'application/json'
                    },
                    method: 'POST',
        			url:'http://localhost/inspinia/index.php',
        			// url:'http://117.5.76.17:12345/api/customrouter',
        			data: {
        				functionName: 'pageSortSearchOrderHeader' 
        			},
        			fn: {}
        		},
        		update: {
        			type: 'local',
        			header: {
                        'Content-type':'application/json'
                    },
                    method: 'POST',
        			url:'http://localhost/inspinia/index.php',
        			// url:'http://117.5.76.17:12345/api/customrouter',
        			data: {
        				functionName: 'updateOrderHeaderObject' 
        			},
        			fn: {
        				success: function(response){
        					console.log(response)
        				},
        				failure: function(response){
        					console.log(response)
        				}
        			}
        		}
        	},
        	pagingOption: {
        		// totalItems: 3,
        		pagingSize: 3,
        		itemsPerPage: 3,
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
			dataIndex: 'booking_no',
			title: 'Booking No.',
			type: 'string',
			allowFilter: false,
			width: 120,
			sortable: false,
			editable: false
		},{
			dataIndex: 'cus_name',
			title: 'Customer',
			type: 'string',
			width: 250
		},{
			dataIndex: 'date_empty_cont',
			title: 'Date Empty Cont',
			type:'date',
			width: 200,
			dateFormat: 'dd-MM-yyyy',
			disableWeekend: true,
			minDate: new Date(),
			startingDay: 1
		},{
			dataIndex: 'roah_name',
			title: 'Tuyen Duong',
			type:'string',
			width: 200
		},{
		// 	dataIndex: 'browser',
		// 	title: 'Browser',
		// 	type: 'list',
		// 	width: 240,
		// 	sortable: true,
		// 	btnDisplay: 'name',
		// 	itemDisplay: 'name marker',
		// 	valueDisplay: 'id',
		// 	multiSelect: true,
		// 	store: $scope.listBrowser
		// },{
			dataIndex: 'booking_no',
			title: 'Delete',
			type: 'html',
			width: 200,
			html: '<div>'
                +'<button class="btn btn-outline btn-default hac-row-btn" ng-click="col.func1(salary)">'
                +    '<i class="fa fa-edit"></i>'
                +'</button>'
                +'<button class="btn btn-outline btn-default hac-row-btn" ng-click="col.func2(salary)">'
                +    '<i class="fa fa-trash-o"></i>'
                +'</button>'
                +'</div>',
			func1: $scope.cellFn_test
		}];
		$scope.tblModel = dataModel;
	});