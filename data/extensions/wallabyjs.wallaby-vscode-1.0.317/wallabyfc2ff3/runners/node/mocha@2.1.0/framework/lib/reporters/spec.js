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
function Spec(e){function t(){return Array(n).join("  ")}Base.call(this,e);var i=this,n=(this.stats,0),r=0;e.on("start",function(){console.log()}),e.on("suite",function(e){++n,console.log(color("suite","%s%s"),t(),e.title)}),e.on("suite end",function(e){--n,1==n&&console.log()}),e.on("pending",function(e){var i=t()+color("pending","  - %s");console.log(i,e.title)}),e.on("pass",function(e){if("fast"==e.speed){var i=t()+color("checkmark","  "+Base.symbols.ok)+color("pass"," %s ");cursor.CR(),console.log(i,e.title)}else{var i=t()+color("checkmark","  "+Base.symbols.ok)+color("pass"," %s ")+color(e.speed,"(%dms)");cursor.CR(),console.log(i,e.title,e.duration)}}),e.on("fail",function(e,i){cursor.CR(),console.log(t()+color("fail","  %d) %s"),++r,e.title)}),e.on("end",i.epilogue.bind(i))}var Base=require("./base"),cursor=Base.cursor,color=Base.color;exports=module.exports=Spec,Spec.prototype.__proto__=Base.prototype;