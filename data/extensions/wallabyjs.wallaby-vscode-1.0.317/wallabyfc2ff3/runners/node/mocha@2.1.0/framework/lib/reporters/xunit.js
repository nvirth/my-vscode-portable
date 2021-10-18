/*
 * Wallaby.js - v1.0.1163
 * https://wallabyjs.com
 * Copyright (c) 2014-2021 Wallaby.js - All Rights Reserved.
 *
 * This source code file is a part of Wallaby.js and is a proprietary (closed source) software.

 * IMPORTANT:
 * Wallaby.js is a tool made by software developers for software developers with passion and love for what we do.
 * Pirating the tool is not only illegal and just morally wrong,
 * it is also unfair to other fellow programmers who are using it legally,
 * and very harmful for the tool and its future.
 */
function XUnit(e,t){Base.call(this,e);var i=this.stats,n=[],r=this;if(t.reporterOptions&&t.reporterOptions.output){if(!fs.createWriteStream)throw new Error("file output not supported in browser");r.fileStream=fs.createWriteStream(t.reporterOptions.output)}e.on("pending",function(e){n.push(e)}),e.on("pass",function(e){n.push(e)}),e.on("fail",function(e){n.push(e)}),e.on("end",function(){r.write(tag("testsuite",{name:"Mocha Tests",tests:i.tests,failures:i.failures,errors:i.failures,skipped:i.tests-i.failures-i.passes,timestamp:(new Date).toUTCString(),time:i.duration/1e3||0},!1)),n.forEach(function(e){r.test(e)}),r.write("</testsuite>")})}function tag(e,t,i,n){var r,s=i?"/>":">",o=[];for(var a in t)o.push(a+'="'+escape(t[a])+'"');return r="<"+e+(o.length?" "+o.join(" "):"")+s,n&&(r+=n+"</"+e+s),r}function cdata(e){return"<![CDATA["+escape(e)+"]]>"}var Base=require("./base"),utils=require("../utils"),fs=require("fs"),escape=utils.escape,Date=global.Date,setTimeout=global.setTimeout,setInterval=global.setInterval,clearTimeout=global.clearTimeout,clearInterval=global.clearInterval;exports=module.exports=XUnit,XUnit.prototype.done=function(e,t){this.fileStream?this.fileStream.end(function(){t(e)}):t(e)},XUnit.prototype.__proto__=Base.prototype,XUnit.prototype.write=function(e){this.fileStream?this.fileStream.write(e+"\n"):console.log(e)},XUnit.prototype.test=function(e,t){var i={classname:e.parent.fullTitle(),name:e.title,time:e.duration/1e3||0};if("failed"==e.state){var n=e.err;this.write(tag("testcase",i,!1,tag("failure",{},!1,cdata(escape(n.message)+"\n"+n.stack))))}else e.pending?this.write(tag("testcase",i,!1,tag("skipped",{},!0))):this.write(tag("testcase",i,!0))};