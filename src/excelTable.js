/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 19:00:54
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-14 00:21:28
*/

'use strict';

angular.module('excel-table', [])
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
                        }
                        else{
                            icon.className = icon.className.replace('desc','asc');
                        }
                        /* call order function */
                        scope.order(field);
                    }
                });
            }
        };
    })
    .directive('excelTable', function ($compile, $filter, excelTableModel) {
        return {
            scope: {
	            model:'=model',
	            data:'=data'
	        },
            restrict: 'E',
            templateUrl: 'template/table.html',
            link: function (scope, element, attrs) {
                excelTableModel.setModel(scope.model);
                excelTableModel.setDataModel(scope.data);
                var orderBy = $filter('orderBy');
                scope.order = function(predicate) {
                    scope.predicate = predicate;
                    scope.reverse = (scope.predicate === predicate) ? !scope.reverse : false;
                    scope.data = orderBy(scope.data, predicate, scope.reverse);
                    scope.$apply();
                };
            }
        };
    })