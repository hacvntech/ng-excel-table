"use strict";angular.module("xtable.rowEdit",["isteven-multi-select"]).value("defaults",{editable:!0}).filter("getCurrentEditRecord",function(){return function(e,t,a){var i=null;for(var r in t)if(t[r].primary){i=t[r].dataIndex;break}for(var d in e)if(e[d][i]==a)return e[d]}}).filter("findType",function(){return function(e,t){var a=[];for(var i in e)e[i].type===t&&a.push(e[i]);return a}}).filter("mappingDataToList",function(){return function(e,t,a){for(var i in e)delete e[i].ticked;if(!(t instanceof String))return"Invalid Format of List";var r=t.split(",");for(var d in r)for(var i in e)e[i][a]===r[d]&&(e[i].ticked=!0);return e}}).directive("rowEditing",["$window","excelTableModel","$templateRequest","$compile","defaults","$filter","$http","$rootScope",function(e,t,a,i,r,d,l,o){return{restrict:"A",link:function(e,t,n){e.editable=r.editable,e.picker={},e.datefield={},e.listIn={},e.listOut={},e.listCfg={};var s=d("findType")(e[n.model],"list");for(var f in s)e.listCfg[s[f].dataIndex]={btnDisplay:s[f].btnDisplay,itemDisplay:s[f].itemDisplay,valueDisplay:s[f].valueDisplay,multiSelect:s[f].multiSelect?"multiple":"single"},e.listIn[s[f].dataIndex]=s[f].store,e.listOut[s[f].dataIndex]={};var c=d("findType")(e[n.model],"date");for(var f in c)e.picker[c[f].dataIndex]={dateOptions:{dateDisabled:function(e){if(c[f].disableWeekend){var t=e.date,a=e.mode;return"day"===a&&(0===t.getDay()||6===t.getDay())}return!0},maxDate:void 0==c[f].maxDate?"":c[f].maxDate,minDate:void 0==c[f].minDate?"":c[f].minDate,startingDay:void 0==c[f].startingDay?0:c[f].startingDay},opened:!1};a("template/rowediting.html").then(function(a){e.data=e[n.data],e.model=e[n.model];var r=i(a)(e);t.append(r)}),e.editRow=function(a){t[0].querySelector(".ctrl-panel-wrapper").style.left=t[0].offsetWidth/2-100+t[0].scrollLeft+"px";for(var i=[];a.target&&(i.unshift(a.target),!a.target.matches(".tb-row.tb-cell"));){if(a.target.matches(".xtable"))return!1;a.target=a.target.parentNode}if(a.target&&a.target.matches(".tb-row.tb-cell")){e.data=e[n.data],e.model=e[n.model],e.recordEditing=d("getCurrentEditRecord")(e[n.data],e.model,a.target.dataset.record),o.$emit("rowEditing",e.recordEditing);for(var r=a.target;r&&(r=r.parentNode,-1==r.className.indexOf("excel-table")););for(var l=a.target.offsetTop,s=r.offsetLeft,f=a.target.offsetHeight,c=a.target.offsetWidth,p=r.parentNode.getElementsByClassName("cell-edit"),u=0;u<p.length;u++)switch(p[u].style.width=c+"px",p[u].parentNode.dataset.type){case"date":var g=new Date(e.recordEditing[p[u].parentNode.dataset.field]);g instanceof Date&&"invalid date"!=g.toString().toLowerCase()?e.datefield[p[u].parentNode.dataset.field]=g:e.datefield[p[u].parentNode.dataset.field]=new Date;break;case"list":var v=e.listIn[p[u].parentNode.dataset.field],m=new String(e.recordEditing[p[u].parentNode.dataset.field]),y=e.listCfg[p[u].parentNode.dataset.field].valueDisplay;e.listIn[p[u].parentNode.dataset.field]=d("mappingDataToList")(v,m,y);break;default:p[u].value=e.recordEditing[p[u].parentNode.dataset.field]}if(e.tableEl=r.parentNode,!e[n.tblOption].forceFit){for(var b=0,w=0;w<e.model.length;w++)b+=parseFloat(e.model[w].width);e.tableEl.querySelector(".row-edit-form").style.width=b+2+"px"}e.tableEl.querySelector(".row-edit-form").style.display="block",e.tableEl.querySelector(".row-edit-form").style.top=l+"px",e.tableEl.querySelector(".row-edit-form").style.left=s+"px",e.tableEl.querySelector(".row-edit-form").style.height=f+"px",e[n.tblOption].dblClickToEdit&&e.$apply()}},e[n.tblOption].dblClickToEdit?t.on("dblclick",function(t){e.editRow(t)}):e.$on("editRow",function(t,a){e.editRow(a)}),e.$watch(n.data,function(t){if(void 0!=e.recordEditing){for(var a=0;a<t.length;a++)if(t[a]===e.recordEditing){var i=a+1;break}if(void 0!=i){var r=e.tableEl.querySelector(".tb-cell.row-"+i).offsetTop;e.tableEl.querySelector(".row-edit-form").style.top=r+"px"}}}),e.save=function(){for(var t=e.tableEl,a=t.getElementsByClassName("cell-edit"),i=0;i<a.length;i++){var r=null;switch(a[i].parentNode.dataset.type){case"number":r=Number(a[i].value.replace(/[., ]/gi,""));break;case"string":r=a[i].value.toString();break;case"date":var d=e.datefield[a[i].parentNode.dataset.field];r=d instanceof Date?d:"Invalid Date";break;case"list":var d=e.listOut[a[i].parentNode.dataset.field],l=e.listCfg[a[i].parentNode.dataset.field].valueDisplay;r=[];for(var o in d)r.push(d[o][l]);r=r.join()}e.recordEditing[a[i].parentNode.dataset.field]=r}e.tableEl.querySelector(".row-edit-form").style.display="none",e.saveUpdatedRecord()},e.cancel=function(){e.tableEl.querySelector(".row-edit-form").style.display="none",e.recordEditing=void 0,o.$emit("rowEditing",void 0)},e.saveUpdatedRecord=function(){var t={method:"POST",withCredentials:!0,data:e.recordEditing,url:e[n.tblOption].rud.update};l(t).then(function(t){console.log(t),e.recordEditing=void 0,o.$emit("rowEditing",void 0)},function(e){console.log(e)})},e.openDatePicker=function(t,a){e.picker[a].opened=!0}}}}]);