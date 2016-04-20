"use strict";angular.module("xtable.rowEdit",["isteven-multi-select"]).value("defaults",{editable:!0}).filter("getCurrentEditRecord",function(){return function(e,t,a){for(var i in e)if(e[i][t]==a)return e[i]}}).filter("findType",function(){return function(e,t){var a=[];for(var i in e)e[i].type===t&&a.push(e[i]);return a}}).filter("mappingDataToList",function(){return function(e,t,a){for(var i in e)delete e[i].ticked;if(!(t instanceof String))return"Invalid Format of List";var r=t.split(",");for(var d in r)for(var i in e)e[i][a]===r[d]&&(e[i].ticked=!0);return e}}).directive("rowEditing",["$window","excelTableModel","$templateRequest","$compile","defaults","$filter","$http","$rootScope",function(e,t,a,i,r,d,o,l){return{restrict:"A",link:function(e,t,n){e.editable=r.editable,e.picker={},e.datefield={},e.listIn={},e.listOut={},e.listCfg={};var s=d("findType")(e[n.model],"list");for(var f in s)e.listCfg[s[f].dataIndex]={btnDisplay:s[f].btnDisplay,itemDisplay:s[f].itemDisplay,valueDisplay:s[f].valueDisplay,multiSelect:s[f].multiSelect?"multiple":"single"},e.listIn[s[f].dataIndex]=s[f].store,e.listOut[s[f].dataIndex]={};var p=d("findType")(e[n.model],"date");for(var f in p)e.picker[p[f].dataIndex]={dateOptions:{dateDisabled:function(e,t){return p[f].disableWeekend?"day"===t&&(0===e.getDay()||6===e.getDay()):!1},maxDate:void 0==p[f].maxDate?"":p[f].maxDate,minDate:void 0==p[f].minDate?"":p[f].minDate,startingDay:void 0==p[f].startingDay?0:p[f].startingDay},opened:!1};a("template/rowediting.html").then(function(a){e.data=e[n.data],e.model=e[n.model];var r=i(a)(e);t.append(r)}),e.editRow=function(a){t[0].querySelector(".ctrl-panel-wrapper").style.left=t[0].offsetWidth/2-100+t[0].scrollLeft+"px";for(var i=[];a.target&&(i.unshift(a.target),!a.target.matches(".tb-row.tb-cell"));){if(a.target.matches(".xtable"))return!1;a.target=a.target.parentNode}if(a.target&&a.target.matches(".tb-row.tb-cell")){e.data=e[n.data],e.model=e[n.model],e.recordEditing=d("getCurrentEditRecord")(e[n.data],n.primary,a.target.dataset.record),l.$emit("rowEditing",e.recordEditing);for(var r=a.target;r&&(r=r.parentNode,-1==r.className.indexOf("excel-table")););for(var o=a.target.offsetTop,s=r.offsetLeft,f=a.target.offsetHeight,p=a.target.offsetWidth,c=r.parentNode.getElementsByClassName("cell-edit"),u=0;u<c.length;u++)switch(c[u].style.width=p+"px",c[u].parentNode.dataset.type){case"date":var g=new Date(e.recordEditing[c[u].parentNode.dataset.field]);g instanceof Date&&"invalid date"!=g.toString().toLowerCase()?e.datefield[c[u].parentNode.dataset.field]=d("date")(g,c[u].parentNode.dataset.dateformat):e.datefield[c[u].parentNode.dataset.field]=d("date")(new Date,c[u].parentNode.dataset.dateformat);break;case"list":var m=e.listIn[c[u].parentNode.dataset.field],v=new String(e.recordEditing[c[u].parentNode.dataset.field]),b=e.listCfg[c[u].parentNode.dataset.field].valueDisplay;e.listIn[c[u].parentNode.dataset.field]=d("mappingDataToList")(m,v,b);break;default:c[u].value=e.recordEditing[c[u].parentNode.dataset.field]}if(e.tableEl=r.parentNode,!e[n.tblOption].forceFit){for(var y=0,w=0;w<e.model.length;w++)y+=parseFloat(e.model[w].width);e.tableEl.querySelector(".row-edit-form").style.width=y+2+"px"}e.tableEl.querySelector(".row-edit-form").style.display="block",e.tableEl.querySelector(".row-edit-form").style.top=o+"px",e.tableEl.querySelector(".row-edit-form").style.left=s+"px",e.tableEl.querySelector(".row-edit-form").style.height=f+"px",e[n.tblOption].dblClickToEdit&&e.$apply()}},e[n.tblOption].dblClickToEdit?t.on("dblclick",function(t){e.editRow(t)}):e.$on("editRow",function(t,a){e.editRow(a)}),e.$watch(n.data,function(t){if(void 0!=e.recordEditing){for(var a=0;a<t.length;a++)if(t[a]===e.recordEditing){var i=a+1;break}if(void 0!=i){var r=e.tableEl.querySelector(".tb-cell.row-"+i).offsetTop;e.tableEl.querySelector(".row-edit-form").style.top=r+"px"}}}),e.save=function(){for(var t=e.tableEl,a=t.getElementsByClassName("cell-edit"),i=0;i<a.length;i++){var r=null;switch(a[i].parentNode.dataset.type){case"number":r=Number(a[i].value.replace(/[., ]/gi,""));break;case"string":r=a[i].value.toString();break;case"date":var d=e.datefield[a[i].parentNode.dataset.field];r=d instanceof Date?d:"Invalid Date";break;case"list":var d=e.listOut[a[i].parentNode.dataset.field],o=e.listCfg[a[i].parentNode.dataset.field].valueDisplay;r=[];for(var l in d)r.push(d[l][o]);r=r.join()}e.recordEditing[a[i].parentNode.dataset.field]=r}e.tableEl.querySelector(".row-edit-form").style.display="none",e.saveUpdatedRecord()},e.cancel=function(){e.tableEl.querySelector(".row-edit-form").style.display="none",e.recordEditing=void 0,l.$emit("rowEditing",void 0)},e.saveUpdatedRecord=function(){if("remote"==e[n.tblOption].rud.update.type){var t={url:e[n.tblOption].rud.update.url,method:e[n.tblOption].rud.read.method,withCredentials:void 0==e[n.tblOption].rud.credentials?!1:e.tableOption.rud.credentials,header:e[n.tblOption].rud.header};t.data=e[n.tblOption].rud.update.data,t.data[e[n.tblOption].rud.customScopeParams]=e.recordEditing,o(t).then(function(t){e.recordEditing=void 0,l.$emit("rowEditing",void 0),"function"==typeof e[n.tblOption].rud.update.fn.success&&e[n.tblOption].rud.update.fn.success(t)},function(t){"function"==typeof e[n.tblOption].rud.update.fn.failure&&e[n.tblOption].rud.update.fn.failure(t)})}else e.recordEditing=void 0,l.$emit("rowEditing",void 0)},e.openDatePicker=function(t,a){t.preventDefault(),t.stopPropagation(),e.picker[a].opened=!0}}}}]);