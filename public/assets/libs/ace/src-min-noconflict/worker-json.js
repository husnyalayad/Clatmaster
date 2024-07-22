"no use strict";!function(e){function t(e,t){var n=e,r="";while(n){var i=t[n];if(typeof i=="string")return i+r;if(i)return i.location.replace(/\/*$/,"/")+(r||i.main||i.name);if(i===!1)return"";var s=n.lastIndexOf("/");if(s===-1)break;r=n.substr(s)+r,n=n.slice(0,s)}return e}if(typeof e.window!="undefined"&&e.document)return;if(e.require&&e.define)return;e.console||(e.console=function(){var e=Array.prototype.slice.call(arguments,0);postMessage({type:"log",data:e})},e.console.error=e.console.warn=e.console.log=e.console.trace=e.console),e.window=e,e.ace=e,e.onerror=function(e,t,n,r,i){postMessage({type:"error",data:{message:e,data:i&&i.data,file:t,line:n,col:r,stack:i&&i.stack}})},e.normalizeModule=function(t,n){if(n.indexOf("!")!==-1){var r=n.split("!");return e.normalizeModule(t,r[0])+"!"+e.normalizeModule(t,r[1])}if(n.charAt(0)=="."){var i=t.split("/").slice(0,-1).join("/");n=(i?i+"/":"")+n;while(n.indexOf(".")!==-1&&s!=n){var s=n;n=n.replace(/^\.\//,"").replace(/\/\.\//,"/").replace(/[^\/]+\/\.\.\//,"")}}return n},e.require=function(r,i){i||(i=r,r=null);if(!i.charAt)throw new Error("worker.js require() accepts only (parentId, id) as arguments");i=e.normalizeModule(r,i);var s=e.require.modules[i];if(s)return s.initialized||(s.initialized=!0,s.exports=s.factory().exports),s.exports;if(!e.require.tlns)return console.log("unable to load "+i);var o=t(i,e.require.tlns);return o.slice(-3)!=".js"&&(o+=".js"),e.require.id=i,e.require.modules[i]={},importScripts(o),e.require(r,i)},e.require.modules={},e.require.tlns={},e.define=function(t,n,r){arguments.length==2?(r=n,typeof t!="string"&&(n=t,t=e.require.id)):arguments.length==1&&(r=t,n=[],t=e.require.id);if(typeof r!="function"){e.require.modules[t]={exports:r,initialized:!0};return}n.length||(n=["require","exports","module"]);var i=function(n){return e.require(t,n)};e.require.modules[t]={exports:{},factory:function(){var e=this,t=r.apply(this,n.slice(0,r.length).map(function(t){switch(t){case"require":return i;case"exports":return e.exports;case"module":return e;default:return i(t)}}));return t&&(e.exports=t),e}}},e.define.amd={},e.require.tlns={},e.initBaseUrls=function(t){for(var n in t)this.require.tlns[n]=t[n]},e.initSender=function(){var n=e.require("ace/lib/event_emitter").EventEmitter,r=e.require("ace/lib/oop"),i=function(){};return function(){r.implement(this,n),this.callback=function(e,t){postMessage({type:"call",id:t,data:e})},this.emit=function(e,t){postMessage({type:"event",name:e,data:t})}}.call(i.prototype),new i};var n=e.main=null,r=e.sender=null;e.onmessage=function(t){var i=t.data;if(i.event&&r)r._signal(i.event,i.data);else if(i.command)if(n[i.command])n[i.command].apply(n,i.args);else{if(!e[i.command])throw new Error("Unknown command:"+i.command);e[i.command].apply(e,i.args)}else if(i.init){e.initBaseUrls(i.tlns),r=e.sender=e.initSender();var s=this.require(i.module)[i.classname];n=e.main=new s(r)}}}(this),ace.define("ace/lib/oop",[],function(e,t,n){"use strict";t.inherits=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})},t.mixin=function(e,t){for(var n in t)e[n]=t[n];return e},t.implement=function(e,n){t.mixin(e,n)}}),ace.define("ace/apply_delta",[],function(e,t,n){"use strict";function r(e,t){throw console.log("Invalid Delta:",e),"Invalid Delta: "+t}function i(e,t){return t.row>=0&&t.row<e.length&&t.column>=0&&t.column<=e[t.row].length}function s(e,t){t.action!="insert"&&t.action!="remove"&&r(t,"delta.action must be 'insert' or 'remove'"),t.lines instanceof Array||r(t,"delta.lines must be an Array"),(!t.start||!t.end)&&r(t,"delta.start/end must be an present");var n=t.start;i(e,t.start)||r(t,"delta.start must be contained in document");var s=t.end;t.action=="remove"&&!i(e,s)&&r(t,"delta.end must contained in document for 'remove' actions");var o=s.row-n.row,u=s.column-(o==0?n.column:0);(o!=t.lines.length-1||t.lines[o].length!=u)&&r(t,"delta.range must match delta lines")}t.applyDelta=function(e,t,n){var r=t.start.row,i=t.start.column,s=e[r]||"";switch(t.action){case"insert":var o=t.lines;if(o.length===1)e[r]=s.substring(0,i)+t.lines[0]+s.substring(i);else{var u=[r,1].concat(t.lines);e.splice.apply(e,u),e[r]=s.substring(0,i)+e[r],e[r+t.lines.length-1]+=s.substring(i)}break;case"remove":var a=t.end.column,f=t.end.row;r===f?e[r]=s.substring(0,i)+s.substring(a):e.splice(r,f-r+1,s.substring(0,i)+e[f].substring(a))}}}),ace.define("ace/lib/event_emitter",[],function(e,t,n){"use strict";var r={},i=function(){this.propagationStopped=!0},s=function(){this.defaultPrevented=!0};r._emit=r._dispatchEvent=function(e,t){this._eventRegistry||(this._eventRegistry={}),this._defaultHandlers||(this._defaultHandlers={});var n=this._eventRegistry[e]||[],r=this._defaultHandlers[e];if(!n.length&&!r)return;if(typeof t!="object"||!t)t={};t.type||(t.type=e),t.stopPropagation||(t.stopPropagation=i),t.preventDefault||(t.preventDefault=s),n=n.slice();for(var o=0;o<n.length;o++){n[o](t,this);if(t.propagationStopped)break}if(r&&!t.defaultPrevented)return r(t,this)},r._signal=function(e,t){var n=(this._eventRegistry||{})[e];if(!n)return;n=n.slice();for(var r=0;r<n.length;r++)n[r](t,this)},r.once=function(e,t){var n=this;this.on(e,function r(){n.off(e,r),t.apply(null,arguments)});if(!t)return new Promise(function(e){t=e})},r.setDefaultHandler=function(e,t){var n=this._defaultHandlers;n||(n=this._defaultHandlers={_disabled_:{}});if(n[e]){var r=n[e],i=n._disabled_[e];i||(n._disabled_[e]=i=[]),i.push(r);var s=i.indexOf(t);s!=-1&&i.splice(s,1)}n[e]=t},r.removeDefaultHandler=function(e,t){var n=this._defaultHandlers;if(!n)return;var r=n._disabled_[e];if(n[e]==t)r&&this.setDefaultHandler(e,r.pop());else if(r){var i=r.indexOf(t);i!=-1&&r.splice(i,1)}},r.on=r.addEventListener=function(e,t,n){this._eventRegistry=this._eventRegistry||{};var r=this._eventRegistry[e];return r||(r=this._eventRegistry[e]=[]),r.indexOf(t)==-1&&r[n?"unshift":"push"](t),t},r.off=r.removeListener=r.removeEventListener=function(e,t){this._eventRegistry=this._eventRegistry||{};var n=this._eventRegistry[e];if(!n)return;var r=n.indexOf(t);r!==-1&&n.splice(r,1)},r.removeAllListeners=function(e){e||(this._eventRegistry=this._defaultHandlers=undefined),this._eventRegistry&&(this._eventRegistry[e]=undefined),this._defaultHandlers&&(this._defaultHandlers[e]=undefined)},t.EventEmitter=r}),ace.define("ace/range",[],function(e,t,n){"use strict";var r=function(e,t){return e.row-t.row||e.column-t.column},i=function(){function e(e,t,n,r){this.start={row:e,column:t},this.end={row:n,column:r}}return e.prototype.isEqual=function(e){return this.start.row===e.start.row&&this.end.row===e.end.row&&this.start.column===e.start.column&&this.end.column===e.end.column},e.prototype.toString=function(){return"Range: ["+this.start.row+"/"+this.start.column+"] -> ["+this.end.row+"/"+this.end.column+"]"},e.prototype.contains=function(e,t){return this.compare(e,t)==0},e.prototype.compareRange=function(e){var t,n=e.end,r=e.start;return t=this.compare(n.row,n.column),t==1?(t=this.compare(r.row,r.column),t==1?2:t==0?1:0):t==-1?-2:(t=this.compare(r.row,r.column),t==-1?-1:t==1?42:0)},e.prototype.comparePoint=function(e){return this.compare(e.row,e.column)},e.prototype.containsRange=function(e){return this.comparePoint(e.start)==0&&this.comparePoint(e.end)==0},e.prototype.intersects=function(e){var t=this.compareRange(e);return t==-1||t==0||t==1},e.prototype.isEnd=function(e,t){return this.end.row==e&&this.end.column==t},e.prototype.isStart=function(e,t){return this.start.row==e&&this.start.column==t},e.prototype.setStart=function(e,t){typeof e=="object"?(this.start.column=e.column,this.start.row=e.row):(this.start.row=e,this.start.column=t)},e.prototype.setEnd=function(e,t){typeof e=="object"?(this.end.column=e.column,this.end.row=e.row):(this.end.row=e,this.end.column=t)},e.prototype.inside=function(e,t){return this.compare(e,t)==0?this.isEnd(e,t)||this.isStart(e,t)?!1:!0:!1},e.prototype.insideStart=function(e,t){return this.compare(e,t)==0?this.isEnd(e,t)?!1:!0:!1},e.prototype.insideEnd=function(e,t){return this.compare(e,t)==0?this.isStart(e,t)?!1:!0:!1},e.prototype.compare=function(e,t){return!this.isMultiLine()&&e===this.start.row?t<this.start.column?-1:t>this.end.column?1:0:e<this.start.row?-1:e>this.end.row?1:this.start.row===e?t>=this.start.column?0:-1:this.end.row===e?t<=this.end.column?0:1:0},e.prototype.compareStart=function(e,t){return this.start.row==e&&this.start.column==t?-1:this.compare(e,t)},e.prototype.compareEnd=function(e,t){return this.end.row==e&&this.end.column==t?1:this.compare(e,t)},e.prototype.compareInside=function(e,t){return this.end.row==e&&this.end.column==t?1:this.start.row==e&&this.start.column==t?-1:this.compare(e,t)},e.prototype.clipRows=function(t,n){if(this.end.row>n)var r={row:n+1,column:0};else if(this.end.row<t)var r={row:t,column:0};if(this.start.row>n)var i={row:n+1,column:0};else if(this.start.row<t)var i={row:t,column:0};return e.fromPoints(i||this.start,r||this.end)},e.prototype.extend=function(t,n){var r=this.compare(t,n);if(r==0)return this;if(r==-1)var i={row:t,column:n};else var s={row:t,column:n};return e.fromPoints(i||this.start,s||this.end)},e.prototype.isEmpty=function(){return this.start.row===this.end.row&&this.start.column===this.end.column},e.prototype.isMultiLine=function(){return this.start.row!==this.end.row},e.prototype.clone=function(){return e.fromPoints(this.start,this.end)},e.prototype.collapseRows=function(){return this.end.column==0?new e(this.start.row,0,Math.max(this.start.row,this.end.row-1),0):new e(this.start.row,0,this.end.row,0)},e.prototype.toScreenRange=function(t){var n=t.documentToScreenPosition(this.start),r=t.documentToScreenPosition(this.end);return new e(n.row,n.column,r.row,r.column)},e.prototype.moveBy=function(e,t){this.start.row+=e,this.start.column+=t,this.end.row+=e,this.end.column+=t},e}();i.fromPoints=function(e,t){return new i(e.row,e.column,t.row,t.column)},i.comparePoints=r,i.comparePoints=function(e,t){return e.row-t.row||e.column-t.column},t.Range=i}),ace.define("ace/anchor",[],function(e,t,n){"use strict";function o(e,t,n){var r=n?e.column<=t.column:e.column<t.column;return e.row<t.row||e.row==t.row&&r}function u(e,t,n){var r=e.action=="insert",i=(r?1:-1)*(e.end.row-e.start.row),s=(r?1:-1)*(e.end.column-e.start.column),u=e.start,a=r?u:e.end;return o(t,u,n)?{row:t.row,column:t.column}:o(a,t,!n)?{row:t.row+i,column:t.column+(t.row==a.row?s:0)}:{row:u.row,column:u.column}}var r=e("./lib/oop"),i=e("./lib/event_emitter").EventEmitter,s=function(){function e(e,t,n){this.$onChange=this.onChange.bind(this),this.attach(e),typeof n=="undefined"?this.setPosition(t.row,t.column):this.setPosition(t,n)}return e.prototype.getPosition=function(){return this.$clipPositionToDocument(this.row,this.column)},e.prototype.getDocument=function(){return this.document},e.prototype.onChange=function(e){if(e.start.row==e.end.row&&e.start.row!=this.row)return;if(e.start.row>this.row)return;var t=u(e,{row:this.row,column:this.column},this.$insertRight);this.setPosition(t.row,t.column,!0)},e.prototype.setPosition=function(e,t,n){var r;n?r={row:e,column:t}:r=this.$clipPositionToDocument(e,t);if(this.row==r.row&&this.column==r.column)return;var i={row:this.row,column:this.column};this.row=r.row,this.column=r.column,this._signal("change",{old:i,value:r})},e.prototype.detach=function(){this.document.off("change",this.$onChange)},e.prototype.attach=function(e){this.document=e||this.document,this.document.on("change",this.$onChange)},e.prototype.$clipPositionToDocument=function(e,t){var n={};return e>=this.document.getLength()?(n.row=Math.max(0,this.document.getLength()-1),n.column=this.document.getLine(n.row).length):e<0?(n.row=0,n.column=0):(n.row=e,n.column=Math.min(this.document.getLine(n.row).length,Math.max(0,t))),t<0&&(n.column=0),n},e}();s.prototype.$insertRight=!1,r.implement(s.prototype,i),t.Anchor=s}),ace.define("ace/document",[],function(e,t,n){"use strict";var r=e("./lib/oop"),i=e("./apply_delta").applyDelta,s=e("./lib/event_emitter").EventEmitter,o=e("./range").Range,u=e("./anchor").Anchor,a=function(){function e(e){this.$lines=[""],e.length===0?this.$lines=[""]:Array.isArray(e)?this.insertMergedLines({row:0,column:0},e):this.insert({row:0,column:0},e)}return e.prototype.setValue=function(e){var t=this.getLength()-1;this.remove(new o(0,0,t,this.getLine(t).length)),this.insert({row:0,column:0},e||"")},e.prototype.getValue=function(){return this.getAllLines().join(this.getNewLineCharacter())},e.prototype.createAnchor=function(e,t){return new u(this,e,t)},e.prototype.$detectNewLine=function(e){var t=e.match(/^.*?(\r\n|\r|\n)/m);this.$autoNewLine=t?t[1]:"\n",this._signal("changeNewLineMode")},e.prototype.getNewLineCharacter=function(){switch(this.$newLineMode){case"windows":return"\r\n";case"unix":return"\n";default:return this.$autoNewLine||"\n"}},e.prototype.setNewLineMode=function(e){if(this.$newLineMode===e)return;this.$newLineMode=e,this._signal("changeNewLineMode")},e.prototype.getNewLineMode=function(){return this.$newLineMode},e.prototype.isNewLine=function(e){return e=="\r\n"||e=="\r"||e=="\n"},e.prototype.getLine=function(e){return this.$lines[e]||""},e.prototype.getLines=function(e,t){return this.$lines.slice(e,t+1)},e.prototype.getAllLines=function(){return this.getLines(0,this.getLength())},e.prototype.getLength=function(){return this.$lines.length},e.prototype.getTextRange=function(e){return this.getLinesForRange(e).join(this.getNewLineCharacter())},e.prototype.getLinesForRange=function(e){var t;if(e.start.row===e.end.row)t=[this.getLine(e.start.row).substring(e.start.column,e.end.column)];else{t=this.getLines(e.start.row,e.end.row),t[0]=(t[0]||"").substring(e.start.column);var n=t.length-1;e.end.row-e.start.row==n&&(t[n]=t[n].substring(0,e.end.column))}return t},e.prototype.insertLines=function(e,t){return console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead."),this.insertFullLines(e,t)},e.prototype.removeLines=function(e,t){return console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead."),this.removeFullLines(e,t)},e.prototype.insertNewLine=function(e){return console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, ['', '']) instead."),this.insertMergedLines(e,["",""])},e.prototype.insert=function(e,t){return this.getLength()<=1&&this.$detectNewLine(t),this.insertMergedLines(e,this.$split(t))},e.prototype.insertInLine=function(e,t){var n=this.clippedPos(e.row,e.column),r=this.pos(e.row,e.column+t.length);return this.applyDelta({start:n,end:r,action:"insert",lines:[t]},!0),this.clonePos(r)},e.prototype.clippedPos=function(e,t){var n=this.getLength();e===undefined?e=n:e<0?e=0:e>=n&&(e=n-1,t=undefined);var r=this.getLine(e);return t==undefined&&(t=r.length),t=Math.min(Math.max(t,0),r.length),{row:e,column:t}},e.prototype.clonePos=function(e){return{row:e.row,column:e.column}},e.prototype.pos=function(e,t){return{row:e,column:t}},e.prototype.$clipPosition=function(e){var t=this.getLength();return e.row>=t?(e.row=Math.max(0,t-1),e.column=this.getLine(t-1).length):(e.row=Math.max(0,e.row),e.column=Math.min(Math.max(e.column,0),this.getLine(e.row).length)),e},e.prototype.insertFullLines=function(e,t){e=Math.min(Math.max(e,0),this.getLength());var n=0;e<this.getLength()?(t=t.concat([""]),n=0):(t=[""].concat(t),e--,n=this.$lines[e].length),this.insertMergedLines({row:e,column:n},t)},e.prototype.insertMergedLines=function(e,t){var n=this.clippedPos(e.row,e.column),r={row:n.row+t.length-1,column:(t.length==1?n.column:0)+t[t.length-1].length};return this.applyDelta({start:n,end:r,action:"insert",lines:t}),this.clonePos(r)},e.prototype.remove=function(e){var t=this.clippedPos(e.start.row,e.start.column),n=this.clippedPos(e.end.row,e.end.column);return this.applyDelta({start:t,end:n,action:"remove",lines:this.getLinesForRange({start:t,end:n})}),this.clonePos(t)},e.prototype.removeInLine=function(e,t,n){var r=this.clippedPos(e,t),i=this.clippedPos(e,n);return this.applyDelta({start:r,end:i,action:"remove",lines:this.getLinesForRange({start:r,end:i})},!0),this.clonePos(r)},e.prototype.removeFullLines=function(e,t){e=Math.min(Math.max(0,e),this.getLength()-1),t=Math.min(Math.max(0,t),this.getLength()-1);var n=t==this.getLength()-1&&e>0,r=t<this.getLength()-1,i=n?e-1:e,s=n?this.getLine(i).length:0,u=r?t+1:t,a=r?0:this.getLine(u).length,f=new o(i,s,u,a),l=this.$lines.slice(e,t+1);return this.applyDelta({start:f.start,end:f.end,action:"remove",lines:this.getLinesForRange(f)}),l},e.prototype.removeNewLine=function(e){e<this.getLength()-1&&e>=0&&this.applyDelta({start:this.pos(e,this.getLine(e).length),end:this.pos(e+1,0),action:"remove",lines:["",""]})},e.prototype.replace=function(e,t){e instanceof o||(e=o.fromPoints(e.start,e.end));if(t.length===0&&e.isEmpty())return e.start;if(t==this.getTextRange(e))return e.end;this.remove(e);var n;return t?n=this.insert(e.start,t):n=e.start,n},e.prototype.applyDeltas=function(e){for(var t=0;t<e.length;t++)this.applyDelta(e[t])},e.prototype.revertDeltas=function(e){for(var t=e.length-1;t>=0;t--)this.revertDelta(e[t])},e.prototype.applyDelta=function(e,t){var n=e.action=="insert";if(n?e.lines.length<=1&&!e.lines[0]:!o.comparePoints(e.start,e.end))return;n&&e.lines.length>2e4?this.$splitAndapplyLargeDelta(e,2e4):(i(this.$lines,e,t),this._signal("change",e))},e.prototype.$safeApplyDelta=function(e){var t=this.$lines.length;(e.action=="remove"&&e.start.row<t&&e.end.row<t||e.action=="insert"&&e.start.row<=t)&&this.applyDelta(e)},e.prototype.$splitAndapplyLargeDelta=function(e,t){var n=e.lines,r=n.length-t+1,i=e.start.row,s=e.start.column;for(var o=0,u=0;o<r;o=u){u+=t-1;var a=n.slice(o,u);a.push(""),this.applyDelta({start:this.pos(i+o,s),end:this.pos(i+u,s=0),action:e.action,lines:a},!0)}e.lines=n.slice(o),e.start.row=i+o,e.start.column=s,this.applyDelta(e,!0)},e.prototype.revertDelta=function(e){this.$safeApplyDelta({start:this.clonePos(e.start),end:this.clonePos(e.end),action:e.action=="insert"?"remove":"insert",lines:e.lines.slice()})},e.prototype.indexToPosition=function(e,t){var n=this.$lines||this.getAllLines(),r=this.getNewLineCharacter().length;for(var i=t||0,s=n.length;i<s;i++){e-=n[i].length+r;if(e<0)return{row:i,column:e+n[i].length+r}}return{row:s-1,column:e+n[s-1].length+r}},e.prototype.positionToIndex=function(e,t){var n=this.$lines||this.getAllLines(),r=this.getNewLineCharacter().length,i=0,s=Math.min(e.row,n.length);for(var o=t||0;o<s;++o)i+=n[o].length+r;return i+e.column},e.prototype.$split=function(e){return e.split(/\r\n|\r|\n/)},e}();a.prototype.$autoNewLine="",a.prototype.$newLineMode="auto",r.implement(a.prototype,s),t.Document=a}),ace.define("ace/lib/lang",[],function(e,t,n){"use strict";t.last=function(e){return e[e.length-1]},t.stringReverse=function(e){return e.split("").reverse().join("")},t.stringRepeat=function(e,t){var n="";while(t>0){t&1&&(n+=e);if(t>>=1)e+=e}return n};var r=/^\s\s*/,i=/\s\s*$/;t.stringTrimLeft=function(e){return e.replace(r,"")},t.stringTrimRight=function(e){return e.replace(i,"")},t.copyObject=function(e){var t={};for(var n in e)t[n]=e[n];return t},t.copyArray=function(e){var t=[];for(var n=0,r=e.length;n<r;n++)e[n]&&typeof e[n]=="object"?t[n]=this.copyObject(e[n]):t[n]=e[n];return t},t.deepCopy=function s(e){if(typeof e!="object"||!e)return e;var t;if(Array.isArray(e)){t=[];for(var n=0;n<e.length;n++)t[n]=s(e[n]);return t}if(Object.prototype.toString.call(e)!=="[object Object]")return e;t={};for(var n in e)t[n]=s(e[n]);return t},t.arrayToMap=function(e){var t={};for(var n=0;n<e.length;n++)t[e[n]]=1;return t},t.createMap=function(e){var t=Object.create(null);for(var n in e)t[n]=e[n];return t},t.arrayRemove=function(e,t){for(var n=0;n<=e.length;n++)t===e[n]&&e.splice(n,1)},t.escapeRegExp=function(e){return e.replace(/([.*+?^${}()|[\]\/\\])/g,"\\$1")},t.escapeHTML=function(e){return(""+e).replace(/&/g,"&#38;").replace(/"/g,"&#34;").replace(/'/g,"&#39;").replace(/</g,"&#60;")},t.getMatchOffsets=function(e,t){var n=[];return e.replace(t,function(e){n.push({offset:arguments[arguments.length-2],length:e.length})}),n},t.deferredCall=function(e){var t=null,n=function(){t=null,e()},r=function(e){return r.cancel(),t=setTimeout(n,e||0),r};return r.schedule=r,r.call=function(){return this.cancel(),e(),r},r.cancel=function(){return clearTimeout(t),t=null,r},r.isPending=function(){return t},r},t.delayedCall=function(e,t){var n=null,r=function(){n=null,e()},i=function(e){n==null&&(n=setTimeout(r,e||t))};return i.delay=function(e){n&&clearTimeout(n),n=setTimeout(r,e||t)},i.schedule=i,i.call=function(){this.cancel(),e()},i.cancel=function(){n&&clearTimeout(n),n=null},i.isPending=function(){return n},i}}),ace.define("ace/worker/mirror",[],function(e,t,n){"use strict";var r=e("../document").Document,i=e("../lib/lang"),s=t.Mirror=function(e){this.sender=e;var t=this.doc=new r(""),n=this.deferredUpdate=i.delayedCall(this.onUpdate.bind(this)),s=this;e.on("change",function(e){var r=e.data;if(r[0].start)t.applyDeltas(r);else for(var i=0;i<r.length;i+=2){var o,u;Array.isArray(r[i+1])?o={action:"insert",start:r[i],lines:r[i+1]}:o={action:"remove",start:r[i],end:r[i+1]};if((o.action=="insert"?o.start:o.end).row>=t.$lines.length)throw u=new Error("Invalid delta"),u.data={path:s.$path,linesLength:t.$lines.length,start:o.start,end:o.end},u;t.applyDelta(o,!0)}if(s.$timeout)return n.schedule(s.$timeout);s.onUpdate()})};(function(){this.$timeout=500,this.setTimeout=function(e){this.$timeout=e},this.setValue=function(e){this.doc.setValue(e),this.deferredUpdate.schedule(this.$timeout)},this.getValue=function(e){this.sender.callback(this.doc.getValue(),e)},this.onUpdate=function(){},this.isPending=function(){return this.deferredUpdate.isPending()}}).call(s.prototype)}),ace.define("ace/mode/json/json_parse",[],function(e,t,n){"use strict";var r,i,s={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"	"},o,u=function(e){throw{name:"SyntaxError",message:e,at:r,text:o}},a=function(e){return e&&e!==i&&u("Expected '"+e+"' instead of '"+i+"'"),i=o.charAt(r),r+=1,i},f=function(){var e,t="";i==="-"&&(t="-",a("-"));while(i>="0"&&i<="9")t+=i,a();if(i==="."){t+=".";while(a()&&i>="0"&&i<="9")t+=i}if(i==="e"||i==="E"){t+=i,a();if(i==="-"||i==="+")t+=i,a();while(i>="0"&&i<="9")t+=i,a()}e=+t;if(!isNaN(e))return e;u("Bad number")},l=function(){var e,t,n="",r;if(i==='"')while(a()){if(i==='"')return a(),n;if(i==="\\"){a();if(i==="u"){r=0;for(t=0;t<4;t+=1){e=parseInt(a(),16);if(!isFinite(e))break;r=r*16+e}n+=String.fromCharCode(r)}else{if(typeof s[i]!="string")break;n+=s[i]}}else{if(i=="\n"||i=="\r")break;n+=i}}u("Bad string")},c=function(){while(i&&i<=" ")a()},h=function(){switch(i){case"t":return a("t"),a("r"),a("u"),a("e"),!0;case"f":return a("f"),a("a"),a("l"),a("s"),a("e"),!1;case"n":return a("n"),a("u"),a("l"),a("l"),null}u("Unexpected '"+i+"'")},p,d=function(){var e=[];if(i==="["){a("["),c();if(i==="]")return a("]"),e;while(i){e.push(p()),c();if(i==="]")return a("]"),e;a(","),c()}}u("Bad array")},v=function(){var e,t={};if(i==="{"){a("{"),c();if(i==="}")return a("}"),t;while(i){e=l(),c(),a(":"),Object.hasOwnProperty.call(t,e)&&u('Duplicate key "'+e+'"'),t[e]=p(),c();if(i==="}")return a("}"),t;a(","),c()}}u("Bad object")};return p=function(){c();switch(i){case"{":return v();case"[":return d();case'"':return l();case"-":return f();default:return i>="0"&&i<="9"?f():h()}},function(e,t){var n;return o=e,r=0,i=" ",n=p(),c(),i&&u("Syntax error"),typeof t=="function"?function s(e,n){var r,i,o=e[n];if(o&&typeof o=="object")for(r in o)Object.hasOwnProperty.call(o,r)&&(i=s(o,r),i!==undefined?o[r]=i:delete o[r]);return t.call(e,n,o)}({"":n},""):n}}),ace.define("ace/mode/json_worker",[],function(e,t,n){"use strict";var r=e("../lib/oop"),i=e("../worker/mirror").Mirror,s=e("./json/json_parse"),o=t.JsonWorker=function(e){i.call(this,e),this.setTimeout(200)};r.inherits(o,i),function(){this.onUpdate=function(){var e=this.doc.getValue(),t=[];try{e&&s(e)}catch(n){var r=this.doc.indexToPosition(n.at-1);t.push({row:r.row,column:r.column,text:n.message,type:"error"})}this.sender.emit("annotate",t)}}.call(o.prototype)})