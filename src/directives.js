/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 19:00:54
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-12 13:48:05
*/

'use strict';

angular.module('excel-table')
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
	.directive('tbCell', function ($window, $filter, excelTableModel) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var orderBy = $filter('orderBy');
                scope.order = function(predicate) {
                    scope.predicate = predicate;
                    scope.reverse = (scope.predicate === predicate) ? !scope.reverse : false;
                    scope.data = orderBy(scope.data, predicate, scope.reverse);
                };
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
                        var elms = document.getElementsByClassName(attrs.class);
                        var icon = element[0].querySelector('.fa');

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
                        scope.order("id");
                        console.log(scope.data);
                    }
                });
            }
        };
    })
    .directive('excelTable', function ($compile, excelTableModel) {
        return {
            scope: {
	            model:'=',
	            data:'='
	        },
            link: function (scope, element, attrs) {
            	var templateCol = '<div class="tb-col colClass">colData</div>';
                var templateCell = '<div tb-cell class="tb-cell cellClass">cellData</div>';
            	var templateSort = '<span class="pull-right"><i class="fa fa-sort-amount-desc"></i></span>';
            	var dataModel = '';
                excelTableModel.setModel(scope.model);
                excelTableModel.setDataModel(scope.data);

            	/* Generate table with data */
            	for(var c = 0; c < scope.model.length; c++){
            		var temp = '',
            			row = 1;
            		for(var d = 0; d < scope.data.length; d++){
            			if(d == 0){
                            var headerTitle = scope.model[c]["title"],
                                headerClass = 'header col-' + scope.model[c]["dataIndex"];
                            if(scope.model[c]["sortable"]){
                                headerTitle += ' ' + templateSort;
                                headerClass += ' sortable';
                            }
            				temp = templateCell.replace('cellClass', headerClass).replace('cellData', headerTitle);
            			}
            			temp += templateCell.replace('cellClass', 'row-'+row).replace('cellData', scope.data[d][scope.model[c]["dataIndex"]]);
            			row++;
					}
					if(c == 0){
            			temp = templateCol.replace('colClass', 'first').replace('colData', temp);	
            		}
            		else if(c == scope.model.length - 1){
            			temp = templateCol.replace('colClass', 'last').replace('colData', temp);
            		}
            		else{
            			temp = templateCol.replace('colClass', '').replace('colData', temp);
            		}
					dataModel += temp;
				}
				dataModel = '<div class="excel-table">'+dataModel+'</div>';
				element.html(dataModel);
            	$compile(element.contents())(scope);
            }
        };
    })