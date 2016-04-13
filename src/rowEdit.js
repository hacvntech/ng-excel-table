/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-12 17:58:51
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-14 01:09:19
*/

'use strict';

angular.module('xtable.rowEdit', [])
	.value('defaults', {
		editable: true
	})
    .directive('rowEditing', function ($window, excelTableModel, $templateRequest, $compile, defaults) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
            	scope.editable = defaults.editable;
            	$templateRequest("template/rowediting.html").then(function(html){
	            	scope.data = scope[attrs.data];
	            	scope.model = scope[attrs.model];

					var tpl = $compile(html)(scope);
					element.append(tpl);
				});
				element.on('dblclick', function(e){
                	if(e.target && e.target.matches('.row-'+(parseInt(e.target.dataset.index)+1)) ){
                		scope.data = scope[attrs.data];
	            		scope.model = scope[attrs.model];
                		/* get position of clicked row */
                		var parent = e.target;
						while (parent) {
							parent = parent.parentNode;
							if(parent.className.indexOf("excel-table") != -1)
								break;
						}
                		var top = e.target.offsetTop,
                			left = parent.offsetLeft,
                			cellHeight = e.target.offsetHeight-8,
                			cellWidth = e.target.offsetWidth-11;

                		/* show form edit inline and calculate height of input */
                		var allCellInput = parent.parentNode.getElementsByClassName('cell-edit');
                		for(var i=0; i < allCellInput.length; i++){
                			/* store cell value in first column for reset position purpose after sorting */
                			if(i == 0){
                				scope.recordEditing = scope.data[e.target.dataset.index];
                			}
                			allCellInput[i].style.width = cellWidth+'px';
                			allCellInput[i].value = scope.data[e.target.dataset.index][allCellInput[i].parentNode.dataset.field];
                		}
                		scope.tableEl = parent.parentNode;
                		scope.recordIndex = e.target.dataset.index;

                		scope.tableEl.querySelector('.row-edit-form').style.display = "block";
                		scope.tableEl.querySelector('.row-edit-form').style.top = top+'px';
                		scope.tableEl.querySelector('.row-edit-form').style.left = left+'px';
                		scope.tableEl.querySelector('.row-edit-form').style.height = cellHeight+'px';
                	}
                });
				/* watching data changed for reset position of form */
				scope.$watch(attrs.data, function(value) {
					if(scope.recordEditing != undefined){
						for(var i = 0; i < value.length; i++){
							if(value[i] === scope.recordEditing){
								var newIndexOfRecordEditing = i+1;
								break;
							}
						}
						if(newIndexOfRecordEditing != undefined){
							var newPos = scope.tableEl.querySelector('.tb-cell.row-'+newIndexOfRecordEditing).offsetTop;
							scope.tableEl.querySelector('.row-edit-form').style.top = newPos+'px';
						}
					}
				});
				scope.save = function(){
					var tableEl = scope.tableEl;
                	var recordIndex = scope.recordIndex;
                	var allCellInput = tableEl.getElementsByClassName('cell-edit');
            		for(var i=0; i < allCellInput.length; i++){
            			var value = null;
            			switch(allCellInput[i].parentNode.dataset.type){
            				case "number":
            					value = Number(allCellInput[i].value.replace(/[., ]/gi, ""));
            					break;
            				case "string":
            					value = allCellInput[i].value.toString();
            					break;
            				default:
            					break;
            			}
            			scope.data[recordIndex][allCellInput[i].parentNode.dataset.field] = value;
            		}
					scope.tableEl.querySelector('.row-edit-form').style.display = "none";
				}
				scope.cancel = function(){
					scope.tableEl.querySelector('.row-edit-form').style.display = "none";
					scope.recordEditing = undefined;
				}
            }
        };
    })