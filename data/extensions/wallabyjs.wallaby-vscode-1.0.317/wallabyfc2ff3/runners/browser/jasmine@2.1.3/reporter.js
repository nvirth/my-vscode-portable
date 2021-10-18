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
var JasmineReporter=function(e){var t=e.initialSpecId(),i=[],n={},r=function(t){if(t&&t.failedExpectations&&t.failedExpectations.length)for(var i=0;i<t.failedExpectations.length;i++){var n=t.failedExpectations[i];n&&!n.matcherName&&"string"==typeof n.message&&"string"==typeof n.stack&&e.reportDeclarationError({message:n.message,stack:n.stack})}};this.jasmineStarted=function(t){e.started({total:t.totalSpecsDefined})},this.jasmineDone=function(t){r(t),e.complete()},this.suiteStarted=function(e){i.push(e.description)},this.suiteDone=function(e){r(e),i.pop()},this.specStarted=function(i){var r=++t,s=n[i.id]={id:r};e.specStart(r,i.description),s.time=(new e._Date).getTime()},this.specDone=function(r){var s=n[r.id]||{id:t};r._id=s.id,r._time=s.time,delete n[r.id];var o="passed"===r.status,a="disabled"===r.status||"pending"===r.status||"excluded"===r.status||r._disabled,l=a?"pending"===r.status?"skipped":"excluded"===r.status?"disabled":"disabled"===r.status?"disabled":"executed":"executed";r._disabled&&(l="disabled");var c=e.specEnd(),u={id:r._id,timeRange:c,name:r.description,suite:i.slice(),status:l,time:a?0:(new e._Date).getTime()-r._time,log:[],testFile:r._testFile};if(!o&&!a)for(var h=r.failedExpectations,p=0;p<h.length;p++){var f=h[p];f.showDiff=f.showDiff||"toEqual"===f.matcherName,u.log.push(e.setAssertionData(f,{message:f.message,stack:f.stack}))}u.log.length||delete u.log,e.result(u)}},jasmineEnv=jasmine.getEnv(),tracer=window.$_$tracer,adapter=new JasmineReporter(tracer);jasmineEnv.addReporter(adapter);