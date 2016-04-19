"use strict";angular.module("xtable.rowEdit",["isteven-multi-select"]).value("defaults",{editable:!0}).filter("getCurrentEditRecord",function(){return function(e,t,a){var l=null;for(var i in t)if(t[i].primary){l=t[i].dataIndex;break}for(var n in e)if(e[n][l]==a)return e[n]}}).filter("findType",function(){return function(e,t){var a=[];for(var l in e)e[l].type===t&&a.push(e[l]);return a}}).filter("mappingDataToList",function(){return function(e,t,a){for(var l in e)delete e[l].ticked;if(!(t instanceof String))return"Invalid Format of List";var i=t.split(",");for(var n in i)for(var l in e)e[l][a]===i[n]&&(e[l].ticked=!0);return e}}).directive("rowEditing",["$window","excelTableModel","$templateRequest","$compile","defaults","$filter","$http","$rootScope",function(e,t,a,l,i,n,o,r){return{restrict:"A",link:function(e,t,s){e.editable=i.editable,e.picker={},e.datefield={},e.listIn={},e.listOut={},e.listCfg={};var d=n("findType")(e[s.model],"list");for(var c in d)e.listCfg[d[c].dataIndex]={btnDisplay:d[c].btnDisplay,itemDisplay:d[c].itemDisplay,valueDisplay:d[c].valueDisplay,multiSelect:d[c].multiSelect?"multiple":"single"},e.listIn[d[c].dataIndex]=d[c].store,e.listOut[d[c].dataIndex]={};var p=n("findType")(e[s.model],"date");for(var c in p)e.picker[p[c].dataIndex]={dateOptions:{dateDisabled:function(e){if(p[c].disableWeekend){var t=e.date,a=e.mode;return"day"===a&&(0===t.getDay()||6===t.getDay())}return!0},maxDate:void 0==p[c].maxDate?"":p[c].maxDate,minDate:void 0==p[c].minDate?"":p[c].minDate,startingDay:void 0==p[c].startingDay?0:p[c].startingDay},opened:!1};a("template/rowediting.html").then(function(a){e.data=e[s.data],e.model=e[s.model];var i=l(a)(e);t.append(i)}),e.editRow=function(a){t[0].querySelector(".ctrl-panel-wrapper").style.left=t[0].offsetWidth/2-100+t[0].scrollLeft+"px";for(var l=[];a.target&&(l.unshift(a.target),!a.target.matches(".tb-row.tb-cell"));){if(a.target.matches(".xtable"))return!1;a.target=a.target.parentNode}if(a.target&&a.target.matches(".tb-row.tb-cell")){e.data=e[s.data],e.model=e[s.model],e.recordEditing=n("getCurrentEditRecord")(e[s.data],e.model,a.target.dataset.record),r.$emit("rowEditing",e.recordEditing);for(var i=a.target;i&&(i=i.parentNode,-1==i.className.indexOf("excel-table")););for(var o=a.target.offsetTop,d=i.offsetLeft,c=a.target.offsetHeight,p=a.target.offsetWidth,g=i.parentNode.getElementsByClassName("cell-edit"),m=0;m<g.length;m++)switch(g[m].style.width=p+"px",g[m].parentNode.dataset.type){case"date":var u=new Date(e.recordEditing[g[m].parentNode.dataset.field]);u instanceof Date&&"invalid date"!=u.toString().toLowerCase()?e.datefield[g[m].parentNode.dataset.field]=u:e.datefield[g[m].parentNode.dataset.field]=new Date;break;case"list":var f=e.listIn[g[m].parentNode.dataset.field],b=new String(e.recordEditing[g[m].parentNode.dataset.field]),v=e.listCfg[g[m].parentNode.dataset.field].valueDisplay;e.listIn[g[m].parentNode.dataset.field]=n("mappingDataToList")(f,b,v);break;default:g[m].value=e.recordEditing[g[m].parentNode.dataset.field]}if(e.tableEl=i.parentNode,!e[s.tblOption].forceFit){for(var y=0,h=0;h<e.model.length;h++)y+=parseFloat(e.model[h].width);e.tableEl.querySelector(".row-edit-form").style.width=y+2+"px"}e.tableEl.querySelector(".row-edit-form").style.display="block",e.tableEl.querySelector(".row-edit-form").style.top=o+"px",e.tableEl.querySelector(".row-edit-form").style.left=d+"px",e.tableEl.querySelector(".row-edit-form").style.height=c+"px",e[s.tblOption].dblClickToEdit&&e.$apply()}},e[s.tblOption].dblClickToEdit?t.on("dblclick",function(t){e.editRow(t)}):e.$on("editRow",function(t,a){e.editRow(a)}),e.$watch(s.data,function(t){if(void 0!=e.recordEditing){for(var a=0;a<t.length;a++)if(t[a]===e.recordEditing){var l=a+1;break}if(void 0!=l){var i=e.tableEl.querySelector(".tb-cell.row-"+l).offsetTop;e.tableEl.querySelector(".row-edit-form").style.top=i+"px"}}}),e.save=function(){for(var t=e.tableEl,a=t.getElementsByClassName("cell-edit"),l=0;l<a.length;l++){var i=null;switch(a[l].parentNode.dataset.type){case"number":i=Number(a[l].value.replace(/[., ]/gi,""));break;case"string":i=a[l].value.toString();break;case"date":var n=e.datefield[a[l].parentNode.dataset.field];i=n instanceof Date?n:"Invalid Date";break;case"list":var n=e.listOut[a[l].parentNode.dataset.field],o=e.listCfg[a[l].parentNode.dataset.field].valueDisplay;i=[];for(var r in n)i.push(n[r][o]);i=i.join()}e.recordEditing[a[l].parentNode.dataset.field]=i}e.tableEl.querySelector(".row-edit-form").style.display="none",e.saveUpdatedRecord()},e.cancel=function(){e.tableEl.querySelector(".row-edit-form").style.display="none",e.recordEditing=void 0,r.$emit("rowEditing",void 0)},e.saveUpdatedRecord=function(){var t={method:"POST",withCredentials:!0,data:e.recordEditing,url:e[s.tblOption].rud.update};o(t).then(function(t){console.log(t),e.recordEditing=void 0,r.$emit("rowEditing",void 0)},function(e){console.log(e)})},e.openDatePicker=function(t,a){e.picker[a].opened=!0}}}}]),angular.module("excel-table",["ui.bootstrap","ngSanitize"]).factory("excelTableModel",function(){var e=null,t=null,a=null,l=null;return{setDataModel:function(t){e=t},getDataModel:function(){return e},setModel:function(e){e=e},getModel:function(){return t},setPredicate:function(e){e=e},getPredicate:function(){return a},setReverse:function(e){e=e},getReverse:function(){return l}}}).filter("startFrom",function(){return function(e,t){return e?(t=+t,e.slice(t)):[]}}).directive("tbCell",["$window","excelTableModel",function(e,t){return{restrict:"A",link:function(e,t,a){t.on("mouseover",function(){if(-1!=a["class"].indexOf("row-"))for(var e=document.getElementsByClassName(a["class"]),t=e.length,l=0;t>l;l++)e[l].className+=" row-hover"}),t.on("mouseout",function(){if(-1!=a["class"].indexOf("row-"))for(var e=document.getElementsByClassName(a["class"]),t=e.length,l=0;t>l;l++)e[l].className=e[l].className.replace(" row-hover","")}),e.editRow=function(t){e.$emit("editRow",t)},t.on("click",function(){if(-1!=a["class"].indexOf("sortable")){if(void 0!=e.recordEditing)return!1;var l=!0,i=document.getElementsByClassName("sortable"),n=t[0].querySelector(".fa"),o=t[0].className.substring(t[0].className.indexOf("col-")+4,t[0].className.indexOf(" ng-class"));if(void 0==n)return!1;for(var r=0;r<i.length;r++)i[r].className=i[r].className.replace(" active","");t[0].className+=" active",-1==n.className.indexOf("desc")?(n.className=n.className.replace("asc","desc"),l=!1):(n.className=n.className.replace("desc","asc"),l=!0),e.order(o,l)}})}}}]).directive("compileHtml",["$compile",function(e){return function(t,a,l){t.$watch(function(e){return e.$eval(l.compileHtml)},function(l){a.html(l),e(a.contents())(t)})}}]).directive("excelTable",["$compile","$filter","excelTableModel","$http","$rootScope","$sanitize",function(e,t,a,l,i,n){return{scope:{model:"=model",data:"=data",tableOption:"=tblOption"},restrict:"E",templateUrl:"template/table.html",link:function(e,n,o){if(e.cellFilter={},e.dataParams={},e.totalWidth="100%",e.tblDefaultOptions={type:"local",forceFit:!0,allowPaging:!1,allowFilter:!1,dblClickToEdit:!0,rud:{read:void 0,update:void 0},pagingOption:void 0},Object.keys(e.tblDefaultOptions).map(function(t,a){void 0!=e.tableOption&&(e.tblDefaultOptions[t]=e.tableOption[t])}),e.tableOption=e.tblDefaultOptions,n.bind("scroll",function(){this.querySelector(".ctrl-panel-wrapper").style.left=this.offsetWidth/2-100+this.scrollLeft+"px"}),e.tableOption.forceFit){for(var r=0,s=0;s<e.model.length;s++)r+=e.model[s].width;for(var s=0;s<e.model.length;s++)e.model[s].width=e.model[s].width/r*100+"%"}else{for(var r=0,s=0;s<e.model.length;s++)r+=e.model[s].width,e.model[s].width=e.model[s].width+"px";e.totalWidth=r+2+"px"}var d=t("orderBy");e.order=function(t,a){"remote"==e.tableOption.type?(e.predicate=t,e.dataParams.sorting={sortBy:t,ascending:a},e.getRecords()):(e.predicate=t,e.data=d(e.data,t,!a),e.$apply())},e.getRecords=function(){var t={method:"POST",withCredentials:!0,url:e.tableOption.rud.read};"remote"==e.tableOption.type&&(t.data=e.dataParams),l(t).then(function(t){e.data=t.data.data,e.tableOption.allowPaging&&(e.paging.totalItems=t.data.totalItems)},function(e){console.log(e)})},i.$on("rowEditing",function(t,a){e.recordEditing=a}),a.setModel(e.model),a.setDataModel(e.data),e.primaryKey=o.primary,e.tableOption.allowPaging?(e.paging={currentPage:1,totalItems:void 0,pagingSize:void 0,itemsPerPage:5,boundaryLinks:!1,boundaryLinkNumbers:!1,rotate:!0,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",forceEllipses:!1},Object.keys(e.paging).map(function(t,a){void 0!=e.tableOption.pagingOption[t]&&(e.paging[t]=e.tableOption.pagingOption[t])}),e.dataParams.paging={start:0,limit:e.paging.itemsPerPage},e.getRecords(),e.pageChanged=function(){"remote"==e.tableOption.type&&(e.dataParams.paging.start=(e.paging.currentPage-1)*e.paging.itemsPerPage,e.getRecords())},e.updateTableData=function(){return void 0!=e.recordEditing?!1:void("remote"==e.tableOption.type&&(e.paging.currentPage=1,e.dataParams.paging.start=0,e.dataParams.paging.limit=e.paging.itemsPerPage,e.getRecords()))}):e.getRecords(),e.$watch("cellFilter",function(a,l){"remote"==e.tableOption.type?(e.paging.currentPage=1,e.dataParams.search=a,e.getRecords()):(e.filtered=t("filter")(e.data,a),void 0!=e.filtered&&void 0!=e.paging&&(e.paging.totalItems=e.filtered.length,e.currentPage=1))},!0)}}}]);var app=angular.module("excelTable",["excel-table","xtable.rowEdit"]);app.controller("AppController",["$scope",function(e){e.listBrowser=[{id:"1",name:"Opera",maker:"(Opera Software)"},{id:"2",name:"Internet Explorer",maker:"(Microsoft)"},{id:"3",name:"Firefox",maker:"(Mozilla Foundation)"},{id:"4",name:"Safari",maker:"(Apple)"},{id:"5",name:"Chrome",maker:"(Google)"}],e.tblOption={type:"local",forceFit:!0,allowFilter:!0,allowPaging:!0,dblClickToEdit:!1,rud:{read:"http://localhost/inspinia/index.php",update:"http://localhost/inspinia/index.php"},pagingOption:{pagingSize:1,itemsPerPage:3,boundaryLinkNumbers:!0,rotate:!1}},e.cellFn_test=function(t,a){for(var l=0;l<e.tblData.length;l++)e.tblData[l].id==a.id&&e.tblData.splice(l,1)};var t=[{dataIndex:"id",title:"ID",type:"number",allowFilter:!1,width:120,primary:!0,sortable:!0,editable:!1},{dataIndex:"date",title:"Date",type:"date",width:1400,dateFormat:"dd-MM-yyyy",disableWeekend:!0,minDate:new Date,startingDay:1},{dataIndex:"browser",title:"Browser",type:"list",width:240,sortable:!0,btnDisplay:"name",itemDisplay:"name marker",valueDisplay:"id",multiSelect:!0,store:e.listBrowser},{dataIndex:"id",title:"Delete",type:"html",width:200,html:'<span ng-click="col.func($event, cell)"><i class="fa fa-trash" style="color:red;"></i></span><span ng-click="editRow($event)"><i class="fa fa-pencil-square-o" style="color:blue;"></i></span>',func:e.cellFn_test}];e.tblModel=t}]),angular.module("templates").run(["$templateCache",function(e){e.put("index.html",'<!doctype html><html class="no-js" ng-app="excelTable"><head><meta charset="utf-8"><title>Excel Table</title><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"><link rel="shortcut icon" href="favicon.ico" type="image/x-icon"><link rel="stylesheet" href="../bower_components/isteven-angular-multiselect/isteven-multi-select.css"><link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css"></head><body ng-controller="AppController"><excel-table class="xtable" tbl-option="tblOption" model="tblModel" data="tblData" data-primary="id" row-editing=""></excel-table><script src="../bower_components/isteven-angular-multiselect/isteven-multi-select.js"></script></body></html>'),e.put("template/rowediting.html",'<div class="excel-table row-edit-form"><div class="tb-col" ng-repeat="col in model" style="width:{{col.width}}"><div ng-if="col.editable == true || col.editable == undefined" class="tb-cell" data-field="{{col.dataIndex}}" data-type="{{col.type}}" data-dateformat="{{col.dateFormat}}"><input class="cell-edit" type="number" ng-if="col.type == \'number\'"> <input class="cell-edit" type="text" ng-if="col.type == \'string\'"><isteven-multi-select class="cell-edit" ng-if="col.type == \'list\'" input-model="listIn[col.dataIndex]" output-model="listOut[col.dataIndex]" button-label="{{listCfg[col.dataIndex].btnDisplay}}" item-label="{{listCfg[col.dataIndex].itemDisplay}}" tick-property="ticked" selection-mode="{{listCfg[col.dataIndex].multiSelect}}"></isteven-multi-select><div class="cell-edit datepicker" ng-if="col.type == \'date\'"><input type="text" class="form-control" uib-datepicker-popup="{{col.dateFormat}}" ng-model="datefield[col.dataIndex]" datepicker-options="picker[col.dataIndex].dateOptions" is-open="picker[col.dataIndex].opened" close-text="Close"> <span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="openDatePicker($event, col.dataIndex)"><i class="glyphicon glyphicon-calendar"></i></button></span></div></div><div ng-if="col.editable == false" class="tb-cell" data-field="{{col.dataIndex}}" data-type="{{col.type}}"><input class="cell-edit" type="text" disabled=""></div></div><div class="ctrl-panel-container"><div class="ctrl-panel-wrapper"><span class="save" ng-click="save()">Save</span> <span class="cancel" ng-click="cancel()">Cancel</span></div></div></div>'),e.put("template/table.html",'<div class="excel-table" style="width:{{totalWidth}}"><div class="tb-col" ng-repeat="col in model" style="width:{{col.width}}"><div tb-cell="" class="tb-cell header col-{{col.dataIndex}} ng-class:(col.sortable ? \'sortable\' : \'\');">{{col.title}} <span class="pull-right" ng-if="col.sortable"><i class="fa fa-sort-amount-asc"></i></span></div><div ng-if="tableOption.allowFilter" tb-cell="" class="tb-cell cell-filter col-{{col.dataIndex}}"><input ng-disabled="col.allowFilter == false || col.type == \'html\'" class="form-control" type="text" ng-model="cellFilter[col.dataIndex]"></div><div tb-cell="" data-index="{{$index}}" data-record="{{cell[primaryKey]}}" class="tb-row tb-cell row-{{$index+1}}" ng-repeat="cell in {true: (data | filter:cellFilter | startFrom:(paging.currentPage-1)*paging.itemsPerPage | limitTo:paging.itemsPerPage), false: (data | filter:cellFilter)}[tableOption.type === \'local\'] track by $index" ng-switch="col.type"><span ng-switch-when="date" ng-bind="cell[col.dataIndex] | date:col.dateFormat"></span> <span ng-switch-when="html" compile-html="col.html"></span> <span ng-switch-default="" ng-bind="cell[col.dataIndex]"></span></div></div></div><div class="table-control form-group" ng-if="tableOption.allowPaging"><uib-pagination class="pagination-sm right" ng-model="paging.currentPage" total-items="paging.totalItems" max-size="paging.pagingSize" items-per-page="paging.itemsPerPage" boundary-links="paging.boundaryLinks" boundary-link-numbers="paging.boundaryLinkNumbers" rotate="paging.rotate" direction-links="paging.directionLinks" first-text="{{paging.firstText}}" previous-text="{{paging.previousText}}" next-text="{{paging.nextText}}" last-text="{{paging.lastText}}" force-ellipses="paging.forceEllipses" ng-change="pageChanged()"></uib-pagination><div class="pager-limitTo"><label>Per page:</label> <input type="number" class="form-control" ng-model="paging.itemsPerPage" min="1" max="100" step="1" ng-change="updateTableData()"> <label>{{paging.itemsPerPage > 1 ? \'records\' : \'record\'}}</label></div></div>'),e.put("serve/index.html",'<!doctype html><html class="no-js" ng-app="excelTable"><head><meta charset="utf-8"><title>Excel Table</title><meta name="description" content=""><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"><link rel="shortcut icon" href="favicon.ico" type="image/x-icon"><link rel="stylesheet" href="../bower_components/isteven-angular-multiselect/isteven-multi-select.css"><link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css"><link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.css"><link rel="stylesheet" href="index.css"></head><body ng-controller="AppController"><excel-table class="xtable" tbl-option="tblOption" model="tblModel" data="tblData" data-primary="id" row-editing=""></excel-table><script src="../bower_components/jquery/dist/jquery.min.js"></script><script src="../bower_components/angular/angular.js"></script><script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script><script src="../bower_components/bootstrap/dist/js/bootstrap.js"></script><script src="../bower_components/angular-sanitize/angular-sanitize.js"></script><script src="rowEdit.js?v=1461060231007"></script><script src="excelTable.js?v=1461060231007"></script><script src="app.js?v=1461060231007"></script><script src="../bower_components/isteven-angular-multiselect/isteven-multi-select.js"></script></body></html>')}]);