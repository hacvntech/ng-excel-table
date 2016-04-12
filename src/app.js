/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 14:33:56
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-12 13:08:32
*/
'use strict';
var app = angular.module('excel-table', []);

app.factory('TableModel', function() {
	var dataModel = [{
		dataIndex: 'id',
		title: 'ID',
		sortable: true,
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
		email: 'test1@gmail.com'
	},{
		id: 2,
		name: 'Hai',
		email: 'test2@gmail.com'
	},{
		id: 3,
		name: 'Ba',
		email: 'test3@gmail.com'
	}];
    return {
        setData:function (data) {
            dataModel = data;
        },
        getModel:function () {
            return dataModel;
        },
        getData:function () {
            return dataValue;
        }
    };
});

app.run(['$templateCache', function ($templateCache) {
	$templateCache.put('template/excel-table/table.html',
    'test');
}]);