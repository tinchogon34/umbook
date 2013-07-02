Ext.util.JSON=new (function(){
var _1={}.hasOwnProperty?true:false;
var _2=function(n){
return n<10?"0"+n:n;
};
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
var _3=function(s){
if(/["\\\x00-\x1f]/.test(s)){
return "\""+s.replace(/([\x00-\x1f\\"])/g,function(a,b){
var c=m[b];
if(c){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
})+"\"";
}
return "\""+s+"\"";
};
var _4=function(o){
var a=["["],b,i,l=o.length,v;
for(i=0;i<l;i+=1){
v=o[i];
switch(typeof v){
case "undefined":
case "function":
case "unknown":
break;
default:
if(b){
a.push(",");
}
a.push(v===null?"null":Ext.util.JSON.encode(v));
b=true;
}
}
a.push("]");
return a.join("");
};
var _5=function(o){
return "\""+o.getFullYear()+"-"+_2(o.getMonth()+1)+"-"+_2(o.getDate())+"T"+_2(o.getHours())+":"+_2(o.getMinutes())+":"+_2(o.getSeconds())+"\"";
};
this.encode=function(o){
if(typeof o=="undefined"||o===null){
return "null";
}else{
if(o instanceof Array){
return _4(o);
}else{
if(o instanceof Date){
return _5(o);
}else{
if(typeof o=="string"){
return _3(o);
}else{
if(typeof o=="number"){
return isFinite(o)?String(o):"null";
}else{
if(typeof o=="boolean"){
return String(o);
}else{
var a=["{"],b,i,v;
for(i in o){
if(!_1||o.hasOwnProperty(i)){
v=o[i];
switch(typeof v){
case "undefined":
case "function":
case "unknown":
break;
default:
if(b){
a.push(",");
}
a.push(this.encode(i),":",v===null?"null":this.encode(v));
b=true;
}
}
}
a.push("}");
return a.join("");
}
}
}
}
}
}
};
this.decode=function(_6){
return eval("("+_6+")");
};
})();
Ext.encode=Ext.util.JSON.encode;
Ext.decode=Ext.util.JSON.decode;
var rabbit={result:{},util:{bind:function(_7,_8){
return function(){
try{
return _7.apply(_8,arguments);
}
catch(e){
console.error(e);
return undefined;
}
};
},userRole:null},logLevel:"debug"};
rabbit.events={buttonClicked:"buttonClicked",buttonMouseOver:"buttonMouseOver",buttonMouseOut:"buttonMouseOut",checkBoxClicked:"checkBoxClicked",click:"click",clickAreaClicked:"clickAreaClicked",loadPage:"loadPage",pageLoaded:"pageLoaded",propertyChange:"propertyChange",radioButtonClicked:"radioButtonClicked",svgBlur:"svgBlur",svgFocus:"svgFocus",tabButtonMouseOut:"tabButtonMouseOut",tabButtonMouseOver:"tabButtonMouseOver",showDatepicker:"showDatepicker",hideDatepicker:"hideDatepicker",changeDatepickerPage:"changeDatepickerPage",changeSlider:"changeSlider",subMenuShow:"subMenuShow",subMenuHide:"subMenuHide",sliderChangedEvent:"sliderChangedEvent"};
rabbit.eventDispatcher=function _returnEventDispatcher(){
var _9={};
return {registerOnEvent:function registerOnEvent(_a,_b,_c,_d){
if(typeof _a!=="string"||typeof _b!=="function"||typeof _c!=="object"){
throw "Invalid Arguments for registerOnEvent";
}
if(!_9.hasOwnProperty(_a)){
_9[_a]=[];
}
var _e={"callback":_b,"thisArg":_c,"includeEventType":false};
if(_d){
_e.includeEventType=true;
}
_9[_a].push(_e);
},raiseEvent:function raiseEvent(_f){
var _10=_9[_f];
if(typeof _10==="undefined"){
console.warn("No handler for invoked eventType "+_f);
return;
}
for(var i=0;i<_10.length;i++){
try{
var _11=_10[i].callback;
var _12=_10[i].thisArg;
var _13=_10[i].includeEventType;
if(typeof _11==="function"){
var _14=Array.prototype.slice.call(arguments);
if(!_13){
_14.shift();
}
_11.apply(_12,_14);
}
}
catch(e){
console.error(e);
}
}
}};
}();
rabbit.result.manager={currentPageId:"no",pageNames:null,datePickerClicked:false,customDatepickerObjects:[],init:function(_15){
try{
var _16=document.getElementById("pageData").firstChild;
var _17="";
while(_16!=null){
_17+=_16.nodeValue;
_16=_16.nextSibling;
}
this.pageData=Ext.util.JSON.decode(_17).pages;
var _18=document.getElementById("pageNames").firstChild;
if((_18!=null)&&(_18.nodeValue!="__pageNames__")){
_17="";
while(_18!=null){
_17+=_18.nodeValue;
_18=_18.nextSibling;
}
this.pageNames=Ext.util.JSON.decode(_17);
}
var _19=document.getElementsByTagName("div");
this.layers=new Array();
for(var i=0;i<_19.length;i++){
if(_19[i].getAttribute("name")=="layer"){
this.layers.push(_19[i]);
}
}
this._initEventHandlers();
this._initPlugins();
if(_15!=undefined){
rabbit.facade.loadPage(_15);
}
}
catch(e){
console.error(e);
}
},_initEventHandlers:function _initEventHandlers(){
YAHOO.util.Event.addListener(document,rabbit.events.click,this._handleDomEvent(rabbit.events.click));
},_initPlugins:function _initPlugins(){
for(var i=0;i<rabbit.facade._availablePlugins.length;i++){
try{
var _1a=rabbit.facade._availablePlugins[i];
_1a.init.apply(_1a,_1a._initialArguments);
}
catch(e){
console.error(e);
}
}
},_handleDomEvent:function _handleDomEvent(_1b){
return function(_1c){
rabbit.eventDispatcher.raiseEvent(_1b,_1c);
};
},setClass:function(_1d,_1e){
_1d.setAttribute("class",_1e);
},showPage:function(_1f){
try{
if(_1f==""){
return;
}
if(_1f==this.currentPageId){
return;
}
var _20=this.pageData[_1f];
if(_20==undefined){
if(_1f.indexOf("://")!=-1){
window.location.href=_1f;
}else{
window.location.href="http://"+_1f;
}
return;
}
var id;
for(var i=0;i<this.layers.length;i++){
id=this.layers[i].getAttribute("id");
if(_20[id]==true){
this.layers[i].style.left="0px";
this.layers[i].style.top="0px";
}else{
this.layers[i].style.left="-3000px";
this.layers[i].style.top="-3000px";
}
}
var _21=selectorUtil.getElementsByName("pageLayer");
for(var i=0;i<_21.length;i++){
if(_21[i].id==(_1f+"-layer")){
_21[i].style.left="0px";
_21[i].style.top="0px";
}else{
_21[i].style.left="-3000px";
_21[i].style.top="-3000px";
}
}
this.changeTab(_1f);
rabbit.eventDispatcher.raiseEvent(rabbit.events.pageLoaded,_20);
}
catch(e){
console.error(e);
}
},changeTab:function changeTab(_22){
var _23=selectorUtil.getElementsByName("target"+this.currentPageId);
for(var i=0;i<_23.length;i++){
if(_23[i].getAttribute("class")){
this.setClass(_23[i],_23[i].getAttribute("class").replace(/\bselected\b/,""));
}else{
this.setClass(_23[i],"");
}
}
_23=selectorUtil.getElementsByName("target"+_22);
for(i=0;i<_23.length;i++){
if(_23[i].getAttribute("class")){
this.setClass(_23[i],"selected "+_23[i].getAttribute("class"));
}else{
this.setClass(_23[i],"selected");
}
}
this.currentPageId=_22;
},menuExternalLinkCallback:function(_24){
if(_24.indexOf("://")==-1){
_24="http://"+_24;
}
window.location.href=_24;
},menuClick:function(a,b,_25){
if(rabbit.result.manager.pageData[_25]!=null){
if(rabbit.result.manager.pageNames==null){
if(rabbit.result.manager.currentPageId!=_25){
var url=window.location.href;
url=url.replace(rabbit.result.manager.currentPageId,_25);
window.location.href=url;
}
}else{
if(rabbit.result.manager.pageNames[_25]!=null){
url=window.location.href;
url=url.substr(0,url.lastIndexOf("/"));
window.location.href=url+"/"+rabbit.result.manager.pageNames[_25];
}
}
}else{
rabbit.result.manager.menuExternalLinkCallback(_25);
}
},onSvgBlur:function(id){
rabbit.facade.raiseEvent(rabbit.events.svgBlur,id);
},onPropertyChanged:function(id,_26){
rabbit.facade.raiseEvent(rabbit.events.propertyChange,id,_26);
},onSvgFocus:function(id){
rabbit.facade.raiseEvent(rabbit.events.svgFocus,id);
},onSvgChanged:function(id,_27){
rabbit.facade.raiseEvent(rabbit.events.checkBoxClicked,id,_27);
},fireMouseOn:function(id){
rabbit.facade.fireMouseOn(id);
},setupDatepicker:function(id){
rabbit.stencils.datepicker.setupDatepicker(id);
},setupMenu:function(id,_28){
rabbit.stencils.menu.setupMenu(id,_28);
},setFill:function(id,_29){
rabbit.stencils.stencil.setFill(id,_29);
},setupSlider:function(id,_2a,_2b,_2c,pos){
rabbit.stencils.slider.setupSlider(id,_2a,_2b,_2c,pos);
}};
rabbit.facade=function _returnFacade(){
var _2d=rabbit.eventDispatcher;
return {_availablePlugins:[],vml:false,registerPlugin:function registerPlugin(_2e,_2f){
try{
var _30=Array.prototype.slice.call(arguments);
_30.shift();
_2e._initialArguments=_30;
this._availablePlugins.push(_2e);
}
catch(e){
console.log(e);
}
},registerOnEvent:function registerOnEvent(_31,_32,_33){
try{
return _2d.registerOnEvent.apply(_2d,arguments);
}
catch(e){
console.error(e);
return undefined;
}
},registerOnEvents:function registerOnEvents(_34,_35,_36){
for(var i=0;i<_34.length;i++){
console.debug("Registering a handler for "+arguments[0]);
try{
_2d.registerOnEvent(_34[i],_35,_36,true);
}
catch(e){
console.error(e);
}
}
},raiseEvent:function raiseEvent(_37,_38){
console.debug("Raising a "+arguments[0]+" event");
try{
return _2d.raiseEvent.apply(_2d,arguments);
}
catch(e){
console.error(e);
return undefined;
}
},fireMouseOn:function fireMouseOn(_39){
var _3a=document.getElementById(_39);
if(_3a==null){
return;
}
console.debug("Forwarding a click event to "+_39);
_3a.click();
_3a.focus();
},loadPage:function loadPage(_3b){
return rabbit.result.manager.showPage(_3b);
},getBaseUrl:function getBaseUrl(){
return rabbit.result.manager.baseUrl;
},getPageUrl:function getPageUrl(){
return this.getBaseUrl()+rabbit.result.manager.currentPageId;
},getRole:function getRole(){
return rabbit.result.manager.currentRole;
}};
}();
if(typeof (console)==="undefined"){
Console=function(){
this.log=function(){
};
this.warn=function(){
};
this.error=function(){
};
this.debug=function(){
};
};
console=new Console();
}else{
if(typeof console.debug==="undefined"){
console.warn=console.log;
console.debug=console.log;
}else{
if(rabbit.logLevel==="error"){
console.warn=function(){
};
console.log=function(){
};
console.debug=function(){
};
}else{
if(rabbit.logLevel==="warn"){
console.log=function(){
};
console.debug=function(){
};
}else{
if(rabbit.logLevel==="log"){
console.debug=function(){
};
}
}
}
}
}
if((!document.URL.match(/http:\/\/localhost:.*/))&&(!document.URL.match(/http(s)?:\/\/softwaredreieck.de.*/))){
console.error=function(e){
var _3c={"message":e.name+": "+e.message,"url":e.fileName,"line":e.lineNumber,"stack":e.stack,"userAgent":navigator.userAgent,"pageId":rabbit.result.manager.currentPageId};
YAHOO.util.Connect.asyncRequest("POST",rabbit.result.manager.baseUrl+rabbit.result.manager.currentPageId+"/errorreport",function(){
},"data="+Ext.util.JSON.encode(_3c));
};
}
if(!rabbit.plugins){
rabbit.plugins={};
}
rabbit.plugins.background=function(){
var _3d=rabbit.facade;
return {init:function init(){
_3d.registerOnEvent(rabbit.events.pageLoaded,this.adjustBackgroundImage,this);
},adjustBackgroundImage:function adjustBackgroundImage(_3e){
var _3f=document.getElementById("borderDiv");
_3f.style.width=_3e.width+"px";
_3f.style.height=_3e.height+"px";
var _40=document.getElementById("background");
_40.setAttribute("width",_3e.width);
_40.setAttribute("height",_3e.height);
_40.setAttribute("style","width:"+_3e.width+"px;height:"+_3e.height+"px;");
this._replaceBackgroundImage(_3e);
},_replaceBackgroundImage:function _replaceBackgroundImage(_41){
if(!_3d.vml){
var _42=document.getElementById("background");
var _43=_42.getElementsByTagNameNS("http://www.w3.org/2000/svg","image")[0];
_43.setAttribute("width",_41.width);
_43.setAttribute("height",_41.height);
if(_41.image!==""){
_43.setAttribute("display","inherit");
_43.setAttributeNS("http://www.w3.org/1999/xlink","href",_41.image);
}else{
_43.setAttribute("display","none");
_43.removeAttributeNS("http://www.w3.org/1999/xlink","href");
}
}else{
var _42=document.getElementById("background");
var _43=document.createElement("img");
_43.style.width="";
_43.style.height="";
_43.setAttribute("src",_41.image.replace("_(d)+Z",""));
_42.replaceChild(_43,_42.firstChild);
if(_41.image==""){
_43.style.display="none";
}else{
_43.style.display="inline";
this._adjustBackgroundImgSize(_41.width,_41.height);
}
}
},_adjustBackgroundImgSize:function _adjustBackgroundImgSize(_44,_45){
if(!document.images[0].complete){
window.setTimeout("rabbit.plugins.background._adjustBackgroundImgSize("+_44+", "+_45+");",100);
return;
}
var _46=document.images[0].width;
var _47=document.images[0].height;
if(_46/_47>_44/_45){
document.images[0].width=_44;
document.images[0].height=_47*_44/_46;
}else{
document.images[0].width=_46*_45/_47;
document.images[0].height=_45;
}
}};
}();
rabbit.facade.registerPlugin(rabbit.plugins.background);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.button=function(){
var _48=rabbit.facade;
return {init:function init(){
_48.registerOnEvent(rabbit.events.buttonClicked,this.onClick,this);
_48.registerOnEvent(rabbit.events.buttonMouseOver,this.onMouseOver,this);
_48.registerOnEvent(rabbit.events.buttonMouseOut,this.onMouseOut,this);
},onClick:function onClick(_49){
location.href=_49;
},onMouseOver:function onMouseOver(id){
document.getElementById(id).className="ClickableSketchHover";
},onMouseOut:function onMouseOut(id){
document.getElementById(id).className="ClickableSketch";
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.button);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.checkBox=function(){
var _4a=rabbit.facade;
return {init:function init(){
rabbit.facade.registerOnEvent(rabbit.events.checkBoxClicked,this.onClick,this);
},onClick:function onClick(_4b,_4c){
console.log("Click to checkbox "+_4b);
var _4d=document.getElementById(_4b);
if(_4d==null){
return true;
}
var _4e=document.getElementById(_4c);
if(_4e==null){
return true;
}
if(!_4d.checked){
_4e.setAttribute("visibility","hidden");
}else{
_4e.setAttribute("visibility","inherit");
}
return true;
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.checkBox);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.clickarea=function(){
var _4f=rabbit.facade;
return {init:function init(){
_4f.registerOnEvent(rabbit.events.clickAreaClicked,this.onClick,this);
},onClick:function onClick(_50){
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.clickarea);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.datepicker=function(){
var _51=rabbit.facade;
var _52=[];
var _53=false;
var _54=function(id){
for(var i=0;i<_52.length;i++){
var _55=_52[i];
if(_55.calendarId==id){
return _55;
}
}
return null;
};
var _56=function(id,_57,_58){
var _59=_54(id);
_59.calendar.setYear(_57);
_59.calendar.setMonth(_58);
_59.calendar.render();
};
var _5a=function _hideCalendar(id,_5b,_5c){
if(_5b){
document.getElementById(id+"_input").value=_5b;
}
var _5d=_54(id);
_5d.calendarVisible=false;
var svg=document.getElementById(_5d.calendarId+"_open_calendar");
if(svg){
svg.style.display="none";
}
_5d.calendar.hide();
_5d.overlay.hide();
_53=false;
};
var _5e=function _showCalendar(id,_5f){
var _60=_54(id);
_60.calendarVisible=true;
_60.calendar.show();
_60.overlay.show();
_53=true;
var svg=document.getElementById(_60.calendarId+"_open_calendar");
if(svg){
svg.style.display="block";
}
};
var _61=function _61(_62){
for(var i=0;i<_62.childNodes.length;i++){
var _63=_62.childNodes[i];
if(_63.nodeType!=1){
continue;
}
if(_63.getAttribute("id")==undefined){
_63.setAttribute("id",_62.getAttribute("id")+"_"+i);
}
arguments.callee(_63);
}
};
var _64=function _64(evt){
if(!evt){
return;
}
if(!_51.vml){
evt.stopPropagation();
}else{
evt.cancelBubble=true;
}
};
return {init:function init(){
_51.registerOnEvent(rabbit.events.click,this.hideDatePickerOnClick,this);
},calendarOpen:function(id){
return _53;
}(),setupDatepicker:function setupDatepicker(id){
try{
var _65=new YAHOO.widget.Overlay(id+"_ov",{zIndex:9990,width:"200px",height:"200px",context:[id+"_input","tl","bl"]});
_65.render();
var cal=new YAHOO.widget.Calendar(id+"_cal");
var _66=new Object();
_66["calendar"]=cal;
_66.overlay=_65;
_66["calendarId"]=id;
_66["calendarVisible"]=false;
_52.push(_66);
cal.selectEvent.subscribe(rabbit.util.bind(function(evt,d){
var _67=this.formatIsoDate(d[0][0][0],d[0][0][1],d[0][0][2]);
rabbit.facade.raiseEvent(rabbit.events.hideDatepicker,_66.calendarId,_67,rabbit.util.userRole,"displayMouseClick");
},this),cal,true);
cal.render();
cal.hide();
_65.hide();
var _68=id+"_cal";
_61(document.getElementById(id+"_cal"));
cal.changePageEvent.subscribe(rabbit.util.bind(function(evt,d){
var _69=cal.cfg.getProperty("pagedate");
var _6a=_69.getUTCFullYear();
var _6b=_69.getMonth();
rabbit.facade.raiseEvent(rabbit.events.changeDatepickerPage,_66.calendarId,_6a,_6b,rabbit.util.userRole,"displayMouseClick");
_61(document.getElementById(_68));
},this),cal,true);
YAHOO.util.Event.addListener(id+"_button","click",rabbit.util.bind(this.toggleCalendarCallback,this),_66);
YAHOO.util.Event.addListener(id+"_input","click",rabbit.util.bind(this.toggleCalendarCallback,this),_66);
YAHOO.util.Event.addListener(id+"_ov","click",_64);
}
catch(e){
console.error("Error setting up datepicker");
console.error(e);
}
rabbit.facade.registerOnEvent(rabbit.events.showDatepicker,_5e,this);
rabbit.facade.registerOnEvent(rabbit.events.hideDatepicker,_5a,this);
rabbit.facade.registerOnEvent(rabbit.events.changeDatepickerPage,_56,this);
},hideDatePickerOnClick:function hideDatePickerOnClick(e){
if(this.calendarOpen){
for(var i=0;i<_52.length;i++){
var _6c=_52[i];
if(_6c.calendarVisible){
rabbit.facade.raiseEvent(rabbit.events.hideDatepicker,_6c.calendarId,null,rabbit.util.userRole,"displayMouseClick");
}
}
}
},toggleCalendarCallback:function toggleCalendarCallback(evt,_6d){
if(!_6d.calendarVisible){
rabbit.facade.raiseEvent(rabbit.events.showDatepicker,_6d.calendarId,rabbit.util.userRole,"displayMouseClick");
this.calendarOpen=true;
}else{
rabbit.facade.raiseEvent(rabbit.events.hideDatepicker,_6d.calendarId,null,rabbit.util.userRole,"displayMouseClick");
this.calendarOpen=false;
}
_64(evt);
},formatIsoDate:function formatIsoDate(y,m,d){
return y.toString()+(m<10?"-0":"-")+m.toString()+(d<10?"-0":"-")+d.toString();
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.datepicker);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.menu=function(){
var _6e=[];
var _6f=function(_70){
for(var i=0;i<_6e.length;i++){
var _71=_6e[i];
if(_71.domId==_70){
return _71;
}
}
return null;
};
var _72=function(_73,_74){
var _75=_6f(_73);
if(_75){
for(var i=0;i<_74.length;i++){
var _76=_75.getSubmenus();
for(var j=0;j<_76.length;j++){
if(_76[j].id==_74[i]){
_75=_76[j];
}
}
}
}
return _75;
};
var _77=function(_78,_79,_7a){
if(_7a!=null&&_7a!=rabbit.util.userRole){
var _7b=_72(_78,_79);
if(_7b){
_7b.show();
}
}
};
var _7c=function(_7d,_7e,_7f){
if(_7f!=null&&_7f!=rabbit.util.userRole){
var _80=_72(_7d,_7e);
if(_80){
_80.hide();
}
}
};
var _81=function(obj){
var _82=obj;
var _83=[];
while(_82.getRoot()!=_82){
_83.push(_82.id);
_82=_82.getRoot();
}
var _84=_82.domId;
var _85=[];
for(var i=_83.length-1;i>=0;i--){
_85.push(_83[i]);
}
return [_84,_85];
};
var _86=function(){
var _87=_81(this);
rabbit.facade.raiseEvent(rabbit.events.subMenuShow,_87[0],_87[1],rabbit.util.userRole);
};
var _88=function(){
var _89=_81(this);
rabbit.facade.raiseEvent(rabbit.events.subMenuHide,_89[0],_89[1],rabbit.util.userRole);
};
return {init:function init(){
},setupMenu:function setupMenu(id,_8a,_8b){
try{
_8a=_8a.replace(/&quot;/g,"\"");
_8a=Ext.util.JSON.decode(_8a);
if(_8b=="vertical"){
var _8c=new YAHOO.widget.Menu(id+"-bar",{itemdata:_8a,visible:true,position:"static",hidedelay:750,lazyload:true});
}else{
var _8c=new YAHOO.widget.MenuBar(id+"-bar",{lazyload:true,autosubmenudisplay:true,showdelay:10,itemdata:_8a});
}
_8c.render(id);
_8c.show();
_8c.domId=id;
_6e.push(_8c);
_8c.subscribe("show",_86);
_8c.subscribe("hide",_88);
rabbit.facade.registerOnEvent(rabbit.events.subMenuShow,_77,this);
rabbit.facade.registerOnEvent(rabbit.events.subMenuHide,_7c,this);
}
catch(e){
console.error(e);
}
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.menu);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.radioButton=function(){
var _8d=rabbit.facade;
return {init:function init(){
_8d.registerOnEvent(rabbit.events.radioButtonClicked,this.onClick,this);
},getAllRadioButtons:function getAllRadioButtons(){
var _8e=[];
var _8f=document.getElementsByTagName("input");
for(var i=0;i<_8f.length;i++){
if(_8f[i].type==="radio"){
_8e.push(_8f[i]);
}
}
return _8e;
},onClick:function onClick(_90,_91){
console.log("Click to radioButton "+_90);
var _92=this.getAllRadioButtons();
for(var i=0;i<_92.length;i++){
var _93=_92[i];
var _94=_93.getAttribute("id")+"_svgChecked";
var _95=document.getElementById(_94);
if(_95!=null){
if(!_93.checked){
if(rabbit.facade.vml){
_95.style.setAttribute("display","none");
}else{
_95.setAttribute("visibility","hidden");
}
}else{
if(rabbit.facade.vml){
_95.style.removeAttribute("display");
}else{
_95.setAttribute("visibility","inherit");
}
}
}
}
return true;
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.radioButton);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.slider=function(){
var _96={};
var _97=function(_98,_99,_9a){
var _9b=_96[_98];
if(!_9b){
return;
}
if(_9a!=null&&_9a!=rabbit.util.userRole){
_9b.setValue(_99);
}
};
return {init:function init(){
},setupSlider:function(id,_9c,_9d,_9e,_9f){
try{
_9c=parseInt(_9c);
_9e=parseInt(_9e);
if(_9f){
_9f=parseInt(_9f)*2;
}else{
_9f=0;
}
var _a0=(_9e-(_9e)/21)/10;
var _a1=_a0*_9c;
var _a2=_9e-_a1;
var _a3=null;
if(_9d=="vertical"){
_a3=YAHOO.widget.Slider.getVertSlider(id,id+"_thumb_vert",_a2,_a1,_a0);
}else{
_a3=YAHOO.widget.Slider.getHorizSlider(id,id+"_thumb_horiz",_a2,_a1,_a0);
}
_96[id]=_a3;
_a3.animate=false;
_a3.subscribe("change",function(){
var _a4=Math.round(this.getValue()+_9f);
rabbit.facade.raiseEvent(rabbit.events.sliderChangedEvent,id,_a4,rabbit.util.userRole);
});
rabbit.facade.registerOnEvent(rabbit.events.sliderChangedEvent,_97,this);
}
catch(e){
console.error(e);
}
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.slider);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.stencil=function(){
var _a5=rabbit.facade;
var _a6=function _a6(_a7,_a8){
var _a9=document.getElementById(_a7);
if(_a9){
_a9.style.setProperty("fill",_a8,"");
}
};
var _aa=function _aa(_ab,_ac){
var _ad,_ae=document.getElementById(_ab);
if(_ae){
if(_ac=="url(#sketchedHover)"){
_ad=_ae.ownerDocument.createElement("v:fill");
_ad.setAttribute("src","/rabbit/result/icons/sketchedFilledButton.png");
_ad.setAttribute("type","tile");
_ad.setAttribute("origin","0.1,0.1");
_ad.setAttribute("size","175pt,75pt");
_ad.setAttribute("on","true");
_ae.getElementsByTagName("fill")[0].parentNode.replaceChild(_ad,_ae.getElementsByTagName("fill")[0]);
}else{
_ad=_ae.ownerDocument.createElement("v:fill");
_ad.setAttribute("color",_ac);
_ad.setAttribute("on"," true");
_ae.getElementsByTagName("fill")[0].parentNode.replaceChild(_ad,_ae.getElementsByTagName("fill")[0]);
}
}
};
return {init:function init(){
_a5.registerOnEvent(rabbit.events.svgFocus,this.onSvgFocus,this);
_a5.registerOnEvent(rabbit.events.svgBlur,this.onSvgBlur,this);
_a5.registerOnEvent(rabbit.events.propertyChange,this.onPropertyChanged,this);
},setFill:function setFill(id,_af){
if(rabbit.facade.vml){
_aa(id,_af);
}else{
_a6(id,_af);
}
},onSvgFocus:function onSvgFocus(_b0){
var _b1;
if(_b0 instanceof Array){
for(var key in _b0){
_b1=document.getElementById(_b0[key]);
if(_b1!=null){
_b1.setAttribute("class","svg_selected_element");
}
}
}else{
_b1=document.getElementById(_b0);
if(_b1!=null){
_b1.setAttribute("class","svg_selected_element");
}
}
},onSvgBlur:function onSvgBlur(_b2){
var _b3;
if(_b2 instanceof Array){
for(var key in _b2){
_b3=document.getElementById(_b2[key]);
if(_b3!=null){
_b3.setAttribute("class","svg_unselected_element");
}
}
}else{
_b3=document.getElementById(_b2);
if(_b3!=null){
_b3.setAttribute("class","svg_unselected_element");
}
}
},onPropertyChanged:function onPropertyChanged(_b4,_b5){
var _b6=document.getElementById(_b5);
if(_b6==null){
return true;
}
console.debug("Property changed on "+_b4);
if(event.srcElement[event.propertyName]==false){
_b6.style.setAttribute("display","none");
}else{
_b6.style.removeAttribute("display");
}
return true;
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.stencil);
if(!rabbit.stencils){
rabbit.stencils={};
}
rabbit.stencils.tabButton=function(){
var _b7=rabbit.facade;
var _b8=function _b8(_b9,_ba){
var _bb=document.getElementById(_b9);
if(_bb){
_bb.className=_ba;
}
};
var _bc=function _bc(_bd,_be){
var _bf=document.getElementById(_bd);
if(_bf){
_bf.style.setProperty("fill",_be,"");
}
};
var _c0=function _c0(_c1,_c2){
var _c3,_c4=document.getElementById(_c1);
if(_c4){
if(_c2=="url(#sketchedHover)"){
_c3=_c4.ownerDocument.createElement("v:fill");
_c3.setAttribute("src","/rabbit/result/icons/sketchedFilledButton.png");
_c3.setAttribute("type","tile");
_c3.setAttribute("origin","0.1,0.1");
_c3.setAttribute("size","175pt,75pt");
_c3.setAttribute("on","true");
_c4.getElementsByTagName("fill")[0].parentNode.replaceChild(_c3,_c4.getElementsByTagName("fill")[0]);
}else{
_c3=_c4.ownerDocument.createElement("v:fill");
_c3.setAttribute("color",_c2);
_c3.setAttribute("on"," true");
_c4.getElementsByTagName("fill")[0].parentNode.replaceChild(_c3,_c4.getElementsByTagName("fill")[0]);
}
}
};
return {init:function init(){
_b7.registerOnEvent(rabbit.events.tabButtonMouseOver,this.handleMouseOver,this);
_b7.registerOnEvent(rabbit.events.tabButtonMouseOut,this.handleMouseOut,this);
_b7.registerOnEvent(rabbit.events.loadPage,this.loadPage,this);
},loadPage:function loadPage(_c5){
_b7.loadPage(_c5);
},handleMouseOver:function handleMouseOut(id,_c6){
if(typeof id!=="string"||(_c6!=="result"&&_c6!=="sketched")){
console.error("Updating tabButton "+id+" failed.");
return;
}
try{
if(_c6==="sketched"){
_b8(id+"_div_small","ClickableSketchHover");
_b8(id+"_div_big","ClickableSketchHover");
}else{
if(rabbit.vml){
_c0(id+"_big_path","#EEEEEE");
_c0(id+"_small_path","#EEEEEE");
}else{
_bc(id+"_big_path","#EEEEEE");
_bc(id+"_small_path","#EEEEEE");
}
}
}
catch(e){
console.error("Updating tabButton "+id+" failed.");
console.error(e);
}
},handleMouseOut:function handleMouseOut(id,_c7){
if(typeof id!=="string"||(_c7!=="result"&&_c7!=="sketched")){
console.error("Updating tabButton "+id+" failed.");
return;
}
try{
if(_c7==="sketched"){
_b8(id+"_div_small","ClickableSketch");
_b8(id+"_div_big","ClickableSketch");
}else{
if(rabbit.vml){
_c0(id+"_big_path","white");
_c0(id+"_small_path","white");
}else{
_bc(id+"_big_path","white");
_bc(id+"_small_path","white");
}
}
}
catch(e){
console.error("Updating tabButton "+id+" failed.");
console.error(e);
}
}};
}();
rabbit.facade.registerPlugin(rabbit.stencils.tabButton);

