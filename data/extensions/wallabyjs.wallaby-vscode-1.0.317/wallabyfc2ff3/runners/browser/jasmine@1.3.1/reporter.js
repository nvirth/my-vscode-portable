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
var JasmineReporter=function(e){var t=e.initialSpecId();this.reportRunnerStarting=function(t){e.started({total:t.specs().length})},this.reportRunnerResults=function(){e.complete()},this.reportSpecStarting=function(i){i.id=++t,e.specStart(i.id,i.description),i.results_.time=(new e._Date).getTime()},this.reportSpecResults=function(t){for(var i=e.specEnd(),n=0===t.results_.failedCount,r=t.results_.skipped,s=r?"disabled":"executed",o={id:t.id,timeRange:i,name:t.description,suite:[],status:s,time:r?0:(new e._Date).getTime()-t.results_.time,log:[]},a=t.suite;a;)o.suite.unshift(a.description),a=a.parentSuite;if(!n&&!r)for(var l=t.results_.items_,c=0;c<l.length;c++){var u=l[c];u.passed_||(u.showDiff=u.showDiff||"toEqual"===u.matcherName,o.log.push(e.setAssertionData(u,{message:u.message,stack:u.trace&&u.trace.stack?u.trace.stack:e._undefined})))}o.log.length||delete o.log,e.result(o)};var i=jasmine.getEnv();this.specFilter=function(t){if(!(i.exclusive_<=t.exclusive_))return!1;if(!e.hasSpecFilter())return!0;for(var n=[t.description],r=t.suite;r;)n.unshift(r.description),r=r.parentSuite;return e.specFilter(n)}};