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
function Doc(e){function t(){return Array(i).join("  ")}Base.call(this,e);var i=(this.stats,e.total,2);e.on("suite",function(e){e.root||(++i,console.log('%s<section class="suite">',t()),++i,console.log("%s<h1>%s</h1>",t(),utils.escape(e.title)),console.log("%s<dl>",t()))}),e.on("suite end",function(e){e.root||(console.log("%s</dl>",t()),--i,console.log("%s</section>",t()),--i)}),e.on("pass",function(e){console.log("%s  <dt>%s</dt>",t(),utils.escape(e.title));var i=utils.escape(utils.clean(e.fn.toString()));console.log("%s  <dd><pre><code>%s</code></pre></dd>",t(),i)}),e.on("fail",function(e,i){console.log('%s  <dt class="error">%s</dt>',t(),utils.escape(e.title));var n=utils.escape(utils.clean(e.fn.toString()));console.log('%s  <dd class="error"><pre><code>%s</code></pre></dd>',t(),n),console.log('%s  <dd class="error">%s</dd>',t(),utils.escape(i))})}var Base=require("./base"),utils=require("../utils");exports=module.exports=Doc;