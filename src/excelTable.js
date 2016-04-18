/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 19:00:54
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-18 15:57:20
*/

'use strict';

angular.module('excel-table', ['ui.bootstrap'])
    .factory('excelTableModel', function() {
        var dataModel = null,
            model = null,
            predicate = null,
            reverse = null;
        return {
            setDataModel: function(data){
                dataModel = data;
            },
            getDataModel: function(){
                return dataModel;
            },
            setModel: function(model){
                model = model;
            },
            getModel: function(){
                return model;
            },
            setPredicate: function(predicate){
                predicate = predicate;
            },
            getPredicate: function(){
                return predicate;
            },
            setReverse: function(reverse){
                reverse = reverse;
            },
            getReverse: function(){
                return reverse;
            }
        };
    })
    .filter('startFrom', function () {
        return function (input, start) {
            if (input) {
                start = +start;
                return input.slice(start);
            }
            return [];
        };
    })
    .directive('tbCell', function ($window, excelTableModel) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('mouseover', function () {
                    if(attrs.class.indexOf('row-') != -1){
	                    var elms = document.getElementsByClassName(attrs.class);
						var n = elms.length;
						for(var i = 0; i < n; i ++) {
						    elms[i].className += " row-hover";
						}
                    }
                });
                element.on('mouseout', function () {
                    if(attrs.class.indexOf('row-') != -1){
	                    var elms = document.getElementsByClassName(attrs.class);
						var n = elms.length;
						for(var i = 0; i < n; i ++) {
						    elms[i].className = elms[i].className.replace(" row-hover", "");
						}
                    }
                });
                element.on('click', function() {
                    if(attrs.class.indexOf('sortable') != -1){
                        var isAscending = true;
                        var elms = document.getElementsByClassName('sortable');
                        var icon = element[0].querySelector('.fa');
                        var field = element[0].className.substring(element[0].className.indexOf("col-")+4, element[0].className.indexOf(" ng-class"));
                        if(icon == undefined)
                            return false;

                        for(var i = 0; i < elms.length; i++){
                            elms[i].className = elms[i].className.replace(" active", "");
                        }
                        element[0].className += ' active';

                        if(icon.className.indexOf('desc') == -1){
                            icon.className = icon.className.replace('asc','desc');
                            isAscending = false;
                        }
                        else{
                            icon.className = icon.className.replace('desc','asc');
                            isAscending = true;
                        }
                        /* call order function */
                        scope.order(field, isAscending);
                    }
                });
            }
        };
    })
    .directive('excelTable', function ($compile, $filter, excelTableModel, $http) {
        return {
            scope: {
	            model:'=model',
                data:'=data',
                tableOption:'=tblOption'
	        },
            restrict: 'E',
            templateUrl: 'template/table.html',
            link: function (scope, element, attrs) {
                scope.dataParams = {};
                var orderBy = $filter('orderBy');
                scope.order = function(predicate, isAscending) {
                    if(scope.tableOption.type == "remote"){
                        /* remote sorting */
                        scope.predicate = predicate;
                        scope.dataParams['sorting'] = {
                            sortBy: predicate,
                            ascending: isAscending
                        };
                        scope.getRecords();
                    }
                    else{
                        /* local sorting */
                        scope.predicate = predicate;
                        scope.data = orderBy(scope.data, predicate, !isAscending);
                        scope.$apply();
                    }
                };
                scope.getRecords = function(){
                    var httpOpts = {
                        method: 'POST',
                        withCredentials: true,
                        url: scope.tableOption.rud.read,
                    };
                    if(scope.tableOption.type == 'remote'){
                        httpOpts['data'] = scope.dataParams;
                    }
                    $http(httpOpts).then(function successCallback(response) {
                        scope.data = response.data.data;
                        if(scope.tableOption.allowPaging){
                            scope.paging.totalItems = response.data.totalItems;
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                };
                excelTableModel.setModel(scope.model);
                excelTableModel.setDataModel(scope.data);
                scope.primaryKey = attrs.primary;
                if(scope.tableOption.allowPaging){
                    scope.paging = {
                        currentPage: 1,
                        totalItems: undefined,
                        pagingSize: undefined,
                        itemsPerPage: 5,
                        boundaryLinks: false,
                        boundaryLinkNumbers: false,
                        rotate: true,
                        directionLinks: true,
                        firstText: 'First',
                        previousText: 'Previous',
                        nextText: 'Next',
                        lastText: 'Last',
                        forceEllipses: false
                    };
                    Object.keys(scope.paging).map(function(key, index){
                        if(scope.tableOption.pagingOption[key] != undefined)
                            scope.paging[key] = scope.tableOption.pagingOption[key]
                    });
                    scope.dataParams['paging'] = {
                        start: 0,
                        limit: scope.paging.itemsPerPage
                    };
                    scope.getRecords();
                    scope.pageChanged = function(){
                        /* get remote paging data */
                        if(scope.tableOption.type == "remote"){
                            scope.dataParams['paging'].start = (scope.paging.currentPage - 1) * scope.paging.itemsPerPage;
                            scope.getRecords();
                        }
                    }
                    scope.updateTableData = function(){
                        if(scope.tableOption.type == "remote"){
                            scope.paging.currentPage = 1;
                            scope.dataParams['paging'].start = 0;
                            scope.dataParams['paging'].limit = scope.paging.itemsPerPage;
                            scope.getRecords();
                        }
                    }
                }
                else{
                    scope.getRecords();
                }
            }
        };
    })