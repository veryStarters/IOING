define(function(require,exports,module){function DOM(){if(!(this instanceof DOM)){return new DOM()}this.init()}DOM.prototype={init:function(){this.DOM={root:{}};this.DOMS={0:document.createDocumentFragment()};this.DOM2={0:document.createDocumentFragment()};this.ids={};this.mid={};this.gap={};this.prop={};this.tags={I:0};this.scope={};this.events=[];this._events=[];this.listener=[];this.entanglement=[]},on:function(type,fn){if(!this._events[type]){this._events[type]=[]}this._events[type].push(fn)},off:function(type,fn){if(!this._events[type]){return}var index=this._events[type].indexOf(fn);if(index>-1){this._events[type].splice(index,1)}},trigger:function(type){if(!this._events[type]){return}var i=0,l=this._events[type].length;if(!l){return}for(;i<l;i++){this._events[type][i].apply(this,[].slice.call(arguments,1))}},save:function(source,data){this.DATA=data;this.SOURCE=source},setup:function(config){this.config=config},space:function(window,body){this.window=window;body.css({"user-select":"none","user-drag":"none","tap-highlight-color":"rgba(0, 0, 0, 0)"});return this},update:function(id,uuid,data){this.DATA=data;if(uuid==0){this.ids={}}else{this.ids.each(function(id){if(id.indexOf(uuid+".")==0){delete this[id]}})}this.updating=true;this.compile({"id":id||this.config.module,"uuid":uuid},this.get(id),data);this.updating=false;this.layoffs(uuid);this.end()},layoffs:function(uuid){for(var id in this.DOMS){if(id.indexOf(uuid+".")==0){if(!this.DOMS[id].updated){this.DOMS[id].remove();delete this.DOMS[id];if(this.config.parallel){this.DOM2[id].remove();delete this.DOM2[id]}}else{this.DOMS[id].updated=false}}}},tagid:function(name){return this.tags[name]||(this.tags[name]=this.tags.I++)},uuid:function(root,node){var uuid;uuid=root.uuid+"."+this.tagid(root.id)+"."+this.tagid(node.nodeName);this.ids[uuid]?this.ids[uuid].push(1):this.ids[uuid]=[1];uuid+="."+(this.ids[uuid].length-1);node.extendProperty("uuid",uuid)},get:function(id,callback){var that=this,source=this.SOURCE[id];if(!source){if(source==undefined){if(id.indexOf("//")==0){promise.get(id.slice(2)).then(function(err,data,xhr){if(!data){return}if(err==false){that.SOURCE[id]=data;callback.call(that,new DOMParser().parseFromString("<body>"+data+"</body>","text/html").body)}else{throw"IOING ERROR { "+id+" load fail! }"}})}else{throw"IOING ERROR { source : "+id+" is not defined! }"}}return}source=new DOMParser().parseFromString("<body>"+source+"</body>","text/html").body;if(callback){setTimeout(function(){callback.call(that,source)},0);return}return source},target:function(node){var parent=node.parentNode;return parent.command?this.target(parent):(parent.target||parent.uuid)},append:function(root,node){var uuid=node.uuid,puid=this.target(node);if(!this.DOMS[uuid]){return}if(node.command){return node.remove()}if(!this.DOMS[uuid].updated){this.DOMS[puid].appendChild(this.DOMS[uuid]);if(this.config.parallel){this.DOM2[puid].appendChild(this.DOM2[uuid])}this.DOMS[uuid].extendProperty("updated",true)}},realpath:function(root,value){var sid=this.config.sids[root.id],config=this.config;value=value.removeQuotes();if(value.indexOf("://")>0){}else{if(value.indexOf("/")==0){value=config.root+value.substr(1)}else{if(value.indexOf("./")==0){value=config.root+sid+value.substr(1)}else{if(value.indexOf("-/")==0){value=config.root+config.module+value.substr(1)}else{value=config.root+sid+"/"+value}}}}return value},createElement:function(root,node){var id=node.uuid,rid=root.uuid,name=node.nodeName,uuid=node.attributes&&node.attributes.getNamedItem("uuid")&&node.attributes.getNamedItem("uuid").value;if(!!this.DOMS[id]){this.DOMS[id].extendProperty("updated",true);return}this.DOMS[id]=document.createElement(name);this.DOMS[id].extendProperty("uuid",id);if(uuid){if(!this.DOM[rid]){this.DOM[rid]={}}this.DOM[rid][uuid]=this.DOMS[id]}if(this.config.parallel){if(node.nodeName=="CANVAS"||node.nodeName=="VIDEO"){var canvasid;this.DOM2[id]=document.createElement("DIV");canvasid=node.getAttribute("name");if(node.nodeName=="VIDEO"){try{this.events.push(function(){var context=document.getCSSCanvasContext("2d",id,this.DOMS[id].videoWidth,this.DOMS[id].videoHeight);context.getContext("2d").drawImage(this.DOMS[id],0,0,this.DOMS[id].videoWidth,this.DOMS[id].videoHeight)})}catch(e){}canvasid=id}this.DOM2[id].css({"background-image":device.feat.prefix+"canvas("+canvasid+")"})}else{this.DOM2[id]=document.createElement(name)}this.DOM2[id].extendProperty("uuid",id);if(name!="SCRIPT"){this.entanglement.push(function(){if(!node.command){this.parallel(this.DOMS[id],this.DOM2[id])}})}}},setAttribute:function(root,node,name,value,scope,update){var that=this,id=node.uuid;value=this.variable(root,value,name,node,scope,update);switch(name){case"src":case"url":case"link":case"style":value=name=="style"?value.indexOf("url(")!=-1?value.replace(/\burl\((.*)?\)/ig,function(val,url){return"url('"+that.realpath(root,url)+"')"}):value:this.realpath(root,value);break}this.DOMS[id].setAttribute(name,value);if(this.config.parallel&&!this.DOMS[id].updated){this.DOM2[id].setAttribute(name,value)
}if(!update&&!this.DOMS[id].updated){this.attributeRule(root,node,name,value,scope)}},createTextNode:function(root,node,text,scope,update){var that=this,id=node.uuid;if(node.nodeName!="STYLE"){text=this.variable(root,text,null,node,scope,update)}if(!this.DOMS[id]){this.DOMS[id]=document.createTextNode(text);this.DOMS[id].extendProperty("uuid",id);if(this.config.parallel){this.DOM2[id]=document.createTextNode(text);this.DOM2[id].extendProperty("uuid",id);this.entanglement.push(function(){that.parallel(that.DOMS[id],that.DOM2[id])})}}else{this.DOMS[id].textContent=text;this.DOMS[id].extendProperty("updated",true)}},createShadowRoot:function(node,dom){var id=node.uuid,shadowId,shadowRoot=dom.createShadowRoot,shadowTagId=this.tagid("shadow-root");if(shadowRoot){shadowId=id+"."+shadowTagId;node.extendProperty("target",shadowId);if(!this.DOMS[shadowId]){this.DOMS[shadowId]=dom.createShadowRoot();if(this.config.parallel){this.DOM2[shadowId]=this.DOM2[id].createShadowRoot()}}this.DOMS[shadowId].extendProperty("updated",true);id=shadowId}return id},variable:function(root,text,name,node,scope,update){var that=this;return text.replace(/\{\{(.*?)\}\}/g,function(content,path){var paths=path.split("||"),model=paths[0].replace(/\[(.*?)\]/g,function(content,path){return"."+scope.getValueByString(path)}),replace=paths[1],link=model.split("."),prop=link.pop(),target=link.join("."),value=scope.getValueByString(model)||replace;!update&&that.react(root,scope,target,prop,node,name,text);return value?value:""})},react:function(root,scope,target,prop,node,name,text){var link=target+prop,object=scope.getValueByString(target);if(!object){throw"IOING ERROR { on react scope[map:"+target+"] is not defined }"}var callback=function(){name?this.setAttribute(root,node,name,text,scope,true):this.createTextNode(root,node,text,scope,true)};this.prop[link]?this.prop[link].push(callback):this.prop[link]=[callback];this.entanglement.push(function(){var that=this;object.watch(prop,function(propertyName,oldValue,newValue){if(oldValue==newValue){return}for(var i=0,l=that.prop[link].length;i<l;i++){that.prop[link][i].call(that)}})})},parallel:function(reality,virtual){var that=this;if(this.config.parallel.appoint==true){if(!reality.attributes||!reality.attributes.hasOwnProperty("parallel")){return}}reality.observer({childList:true,subtree:false,attributes:true,attributeFilter:["id","class","style","src"],characterData:true,attributeOldValue:false,characterDataOldValue:false},function(records){records.each(function(index,record){switch(record.type){case"attributes":virtual.setAttribute(record.attributeName,reality.attributes[record.attributeName].value);break;case"characterData":virtual.textContent=reality.textContent;break;case"childList":record.addedNodes.each(function(i,node){if(that.DOM2[node.uuid]){return}var cloneNode=node.cloneNode(true);virtual.insertBefore(cloneNode,node.nextSibling?that.DOM2[node.nextSibling.uuid]:null);that.parallel(node,cloneNode)});record.removedNodes.each(function(i,node){that.DOM2[node.uuid].remove()});break}})})},attributeRule:function(root,node,name,value,scope){var that=this,dom=this.DOMS[node.uuid];switch(name){case"transform":value=value.split("|");var id=value[0],param=node.getAttribute("param"),eventName=value[1]||"tap";this.events.push(function(window){new window.Touch(dom).on(eventName,function(event){if(!isNaN(id)){return window.history.go(parseInt(id))}application.transform.to([id,param]);return false})});if(isNaN(id)){this.mid[id]=true}break;case"toggle-class":var value=value.split("|"),className=value[0],eventName=value[1].trim().split(" ");if(eventName){this.events.push(function(window){new window.Touch(dom).on(eventName.join(" "),function(event){if(eventName.length==2){if(event.type==eventName[0]){dom.addClass(className)}else{dom.removeClass(className)}}else{if(dom.hasClass(className)){dom.removeClass(className)}else{dom.addClass(className)}}return false})})}break;default:if(name.indexOf("on-")==0){var eventName=name.split("-")[1];if(eventName){if(eventName=="event"){value=value.split("|");eventName=value[0];value=value[1]}this.events.push(function(window){new window.Touch(dom).on(eventName,function(event){if(root.scope){that.scope[root.uuid](value,event)}else{new window.Function("event",value)(event)}return false})})}}break}},tagRule:function(root,node,scope){var that=this,dom=this.DOMS[node.uuid],uuid=node.uuid,name=node.nodeName,command=node.attributes;switch(name){case"IF":node.command=true;var condition=scope.getValueByString(command[0].name=="is"?command.getNamedItem("is").value:command[0].name);if(condition){this.compile({"id":root.id,"uuid":uuid},node,scope)}break;case"LOOP":node.command=true;var data=Object.create(scope),row=scope.getValueByString(command[0].name=="data"?command.getNamedItem("data").value:command[0].name)||[],value=command[2]?command[2].name:false||"$value",index=command[3]?command[3].name:false||"$index";for(var i in row){data[index]=i;data[value]=row[i];this.compile({"id":root.id,"uuid":this.target(node)},node.cloneNode(true),data)
}break;case"SWITCH":node.command=true;for(var i=0,l=node.children.length;i<l;i++){node.children[i].command=true;command=node.children[i].attributes;var condition=scope.getValueByString(command[0].name=="is"?command.getNamedItem("is").value:command[0].name);if(condition){this.compile({"id":root.id,"uuid":uuid,"order":true},node.children[i],scope);return}}break;case"VAR":node.command=true;var id=command[0].name=="name"&&command[0].value?command[0].value:command[0].name,val=node.textContent;if(!id){break}scope.setValueOfHref(id,scope.getValueByString(val.trim()));break;case"TEMPLATE":node.command=true;var id=command[0].name=="name"&&command[0].value?command[0].value:command[0].name;this.config.sids[id]=this.config.sids[root.id];if(!this.SOURCE[id]){this.SOURCE[id]=node.innerHTML}break;case"INPUT":case"TEXTAREA":case"HTMLAREA":node.command=false;var react=command.getNamedItem("react");if(!react){break}var react=command.getNamedItem("react"),binds=react?react.value.split("|"):[],href=binds[0],eventName=binds[1];if(!eventName){break}dom.on(eventName,function(event){scope.setValueOfHref(href,name=="HTMLAREA"?this.textContent:this.value||this.getAttribute("defaultValue")||this.defaultValue||"")});if(name=="HTMLAREA"){dom.attr({"contenteditable":"true","aria-multiline":"true","spellcheck":"true","role":"textbox","dir":"ltr"})}break;case"SCROLL":node.command=false;var scrollid=dom.id||dom.uuid,addition=dom.data("config"),infinite=dom.attributes.getNamedItem("infinite")?dom.getAttribute("infinite")||true:false,datasetURL=dom.getAttribute("url"),dataRows=datasetURL?null:scope.getValueByString(dom.getAttribute("data")),template=dom.getAttribute("template"),viewSize=Math.min(dom.offsetHeight,dom.offsetWidth)||Math.min(device.ui.height,device.ui.width),minSize=dom.getAttribute("item-min-size"),cycles=Math.max(minSize&&viewSize?Math.ceil(3*viewSize/(device.ui.scale*minSize)):(dom.getAttribute("cycles")||7),4),config={mouseWheel:device.feat.touch?false:true,scrollbars:true,fadeScrollbars:true,shrinkScrollbars:"clip",interactiveScrollbars:true,probeType:3,deceleration:0.003,preventDefault:false,infiniteMinSize:minSize};if(infinite){var i=0,source="",elements=[];while(i<cycles){source+='<section class="infinite-item" style="position: absolute; width: 100%;"></section>';i++}this.SOURCE["infinite-scroll"]='<scrolling style="visibility: hidden; position: absolute; top: 0; right: 0; bottom: 0; left: 0;">'+source+"</scrolling>";this.compile({"id":root.id,"uuid":uuid},this.get("infinite-scroll"),scope);dom.find(".infinite-item").each(function(index,element){elements.push(element)})}this.events.push(function(window){if(dom.data("scrolling")==null){if(infinite){if(!template){throw"IOING ERROR { infinite scroller template is null }"}config.extend({useTransition:true,useTransform:true,mouseWheel:true,infiniteElements:elements,infiniteLimit:2000,infiniteType:"differ",dataset:function(start,callback){if(datasetURL){promise.get(datasetURL,{"start":start}).then(function(err,data,xhr){if(err||!data){return}callback(JSON.parse(data))})}else{if(dataRows.__dataset__!=true){callback(dataRows)}else{dataRows.__dataset__=true}}},dataFiller:function(element,data){that.update(template,element.uuid,Object.create(scope).extend(data))},deceleration:0.003,cacheSize:1000,preventDefault:false,speedLimit:3})}if(addition){for(var i=0,configs=addition.split(","),l=configs.length;i<l;i++){var value=configs[i].split(":");config[value[0]]=value[1]=="true"?true:value[1]=="false"?false:value[1]}}window.scroller[scrollid]=new window.Scroll(dom,config);this.on("childrenend",function(){window.scroller[scrollid].refresh()});dom.data("scrolling","true");dom.addEventListener("touchmove",function(event){event.preventDefault()},false)}else{if(infinite){window.scroller[scrollid].updateInfiniteContent(elements)}}});break;case"STYLE":node.command=false;if(root.scope&&!dom.createShadowRoot){node.textContent="@section ("+root.scope+") {"+node.textContent+"}"}node.textContent=this.css.compile("components",node.textContent);break;case"SCRIPT":node.command=false;if(root.scope){node.command=true}if(!this.scope[uuid]){this.events.push((function(){var global=node.attributes.getNamedItem("global"),javascript=node.textContent;return function(window){if(root.scope){if(global){if(!this.scope[root.name]){new window.Function("__inject__",javascript+'; __inject__["'+root.name+'"] = '+"function (script, that) { "+'if ( typeof script == "function" ) { '+'script = "(" + script.toString() + ").apply(that, [].slice.call(arguments, 2))"'+"};"+"return eval(script.toString()) "+"};")(this.scope)}}else{new window.Function("__inject__, global, components, root, DOM",javascript+'; __inject__["'+root.uuid+'"] = '+"function (script, event) { "+"return eval(script) "+"};")(this.scope,this.scope[root.name],root.dom,this.DOMS[root.uuid],this.DOM[root.uuid])}}else{window.eval(javascript)}this.scope[uuid]=true}})())}node.textContent=null;break;case"INCLUDE":node.command=true;var id=command[0].name=="name"&&command[0].value?command[0].value:command[0].name,data=command[1]?(scope.getValueByString(command[1].name=="data"?command.getNamedItem("data").value:command[1].name)||{}):scope,source=this.get(id);
if(source){node.innerHTML=null;this.compile({"id":id,"uuid":this.target(node)},source,data)}break;default:node.command=false;if(name.indexOf("-")>0){var data=command.length?(function(){for(var i=0,l=command.length;i<l;i++){this[command[i].name]=command[i].value?command[i].name!="data"?command[i].value:scope.getValueByString(command[i].value):scope.getValueByString(command[i].name)}return this}).call({}):scope;var id=this.createShadowRoot(node,dom);this.events.push(function(window){this.get("//components/"+name.toLowerCase()+"/index.html",function(source){this.compile({"sid":"components","uuid":id,"dom":dom,"scope":name,"shadowRoot":dom.createShadowRoot?true:false},source,data);this.sync();this.end(1)})})}break}},walker:function(root,nodes,scope){var node;while(node=nodes.nextNode()){this.uuid(root,node);switch(node.nodeType){case Node.ELEMENT_NODE:this.createElement(root,node);for(var i=0,l=node.attributes.length;i<l;i++){var name=node.attributes[i].name;var value=node.attributes[i].value;this.setAttribute(root,node,name,value,scope)}this.tagRule(root,node,scope);break;case Node.TEXT_NODE:this.createTextNode(root,node,node.textContent,scope);break}this.append(root,node)}},render:function(id,source,data,update){this.save(source,data);this.compile({"id":id,"uuid":0,"update":update},this.get(id),data);this.layoffs(0);return[this.DOMS[0],this.DOM2[0]]},compile:function(root,nodes,scope){if(nodes==null){return}if(scope==undefined){throw"IOING ERROR { id: "+root.uuid+" scope is not defined }"}nodes=document.createNodeIterator(nodes,NodeFilter.SHOW_ALL,null,false);nodes.nextNode().uuid=root.uuid;this.walker(root,nodes,scope)},dispatch:function(){for(var i=0,l=this.events.length;i<l;i++){this.events[i].call(this,this.window)}this.events=[]},sync:function(){for(var i=0,l=this.entanglement.length;i<l;i++){this.entanglement[i].call(this)}this.entanglement=[]},end:function(type){this.sync();this.dispatch();for(var id in this.mid){if(!application.modules[id]){application.get(id)}}if(type==1){this.trigger("childrenend")}}};return DOM});
