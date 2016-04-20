/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 19:00:54
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-20 23:16:04
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
                scope.editRow = function(e){
                    scope.$emit('editRow', e);
                }
                element.on('click', function() {
                    if(attrs.class.indexOf('sortable') != -1){
                        if(scope.recordEditing != undefined){
                            // alert("Cannot sort column while editing");
                            return false;
                        }
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
    .directive('compileHtml', ['$compile', function ($compile) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compileHtml);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }])
    .directive('excelTable', function ($compile, $filter, excelTableModel, $http, $rootScope) {
        return {
            scope: {
	            model:'=model',
                data:'=data',
                tableOption:'=tblOption'
	        },
            restrict: 'E',
            templateUrl: 'template/table.html',
            link: function (scope, element, attrs) {
                scope.cellFilter = {};
                scope.dataParams = {
                    start: 0,
                    length: 0,
                    sort: {
                        predicate: "",
                        order: "ASC"
                    },
                    search: {}
                };
                scope.totalWidth = '100%';
                scope.tblDefaultOptions = {
                    type: 'local',
                    forceFit: true, // true: column fit table, false: column has actual size
                    allowPaging: false,
                    allowFilter: false,
                    dblClickToEdit: true,
                    rud: {
                        customScopeParams: undefined,
                        read: undefined,
                        update: undefined
                    },
                    pagingOption: undefined
                };
                
                Object.keys(scope.tblDefaultOptions).map(function(key, index){
                    if(scope.tableOption != undefined)
                        scope.tblDefaultOptions[key] = scope.tableOption[key];
                });
                /* re-assign default option after merge user options and default options */
                scope.tableOption = scope.tblDefaultOptions;

                /* event scroll y-axis of page and set position of control-wrapper */
                element.bind("scroll", function() {
                    this.querySelector('.ctrl-panel-wrapper').style.left = (this.offsetWidth/2 - 100) + this.scrollLeft + 'px';
                    // scope.$apply();
                });
                
                /* calculate column's width if forceFit = true */
                if(scope.tableOption.forceFit){
                    var totalWidth = 0;
                    for(var m = 0; m < scope.model.length; m++){
                        totalWidth += scope.model[m].width;
                    }
                    for(var m = 0; m < scope.model.length; m++){
                        scope.model[m].width = ((scope.model[m].width/totalWidth) * 100) + '%';
                    }
                }
                else{
                    var totalWidth = 0;
                    for(var m = 0; m < scope.model.length; m++){
                        totalWidth += scope.model[m].width;
                        scope.model[m].width = scope.model[m].width + 'px';
                    }
                    scope.totalWidth = (totalWidth + 2) + 'px';
                }

                var orderBy = $filter('orderBy');
                scope.order = function(predicate, isAscending) {
                    if(scope.tableOption.rud.read.type == "remote"){
                        /* remote sorting */
                        scope.predicate = predicate;
                        scope.dataParams['sort'] = {
                            predicate: predicate,
                            order: isAscending ? 'ASC' : 'DESC'
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
                        url: scope.tableOption.rud.read.url,
                        method: scope.tableOption.rud.read.method,
                        withCredentials: scope.tableOption.rud.credentials == undefined ? false : scope.tableOption.rud.credentials,
                        header: scope.tableOption.rud.header
                    };
                    if(scope.tableOption.rud.read.type == 'remote'){
                        httpOpts['data'] = scope.tableOption.rud.read.data;
                        /* merge custom request data with default request data before send */
                        if(httpOpts['data'][scope.tableOption.rud.customScopeParams] != undefined){
                            Object.keys(scope.dataParams).map(function(key, index){
                                if(httpOpts['data'][scope.tableOption.rud.customScopeParams][key] != undefined)
                                    httpOpts['data'][scope.tableOption.rud.customScopeParams][key] = scope.dataParams[key];
                            });
                        }
                        else{
                            httpOpts['data'][scope.tableOption.rud.customScopeParams] = scope.dataParams;
                        }
                    }
                    $http(httpOpts).then(function successCallback(response) {
                        scope.data = response.data.data;
                        if(scope.tableOption.allowPaging){
                            scope.paging.totalItems = response.data.totalItems;
                        }
                        if(typeof(scope.tableOption.rud.read.fn.success) == "function"){
                            scope.tableOption.rud.read.fn.success(response);
                        }
                    }, function errorCallback(response) {
                        if(typeof(scope.tableOption.rud.read.fn.success) == "function"){
                            scope.tableOption.rud.read.fn.failure(response);
                        }
                    });
                };
                $rootScope.$on('rowEditing', function(event, data) {
                    scope.recordEditing = data
                });
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
                    scope.dataParams['start'] = 0;
                    scope.dataParams['length'] = scope.paging.itemsPerPage;
                    scope.getRecords();
                    scope.pageChanged = function(){
                        /* get remote paging data */
                        if(scope.tableOption.rud.read.type == "remote"){
                            scope.dataParams.start = (scope.paging.currentPage - 1) * scope.paging.itemsPerPage;
                            scope.getRecords();
                        }
                    }
                    scope.updateTableData = function(){
                        if(scope.recordEditing != undefined){
                            // alert("Cannot paging while editing");
                            return false;
                        }
                        if(scope.tableOption.rud.read.type == "remote"){
                            scope.paging.currentPage = 1;
                            scope.dataParams.start = 0;
                            scope.dataParams.length = scope.paging.itemsPerPage;
                            scope.getRecords();
                        }
                    }
                }
                else{
                    scope.getRecords();
                }
                scope.$watch('cellFilter', function (newVal, oldVal) {
                    if(scope.tableOption.rud.read.type == "remote"){
                        scope.paging.currentPage = 1;
                        scope.dataParams['search'] = newVal;
                        scope.getRecords();
                    }
                    else{
                        scope.filtered = $filter('filter')(scope.data, newVal);
                        if(scope.filtered != undefined && scope.paging != undefined){
                            scope.paging.totalItems = scope.filtered.length;
                            // scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                            scope.currentPage = 1;
                        }
                    }
                }, true);
            }
        };
    })