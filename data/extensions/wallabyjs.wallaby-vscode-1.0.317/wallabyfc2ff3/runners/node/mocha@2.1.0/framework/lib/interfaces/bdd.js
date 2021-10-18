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
var Suite=require("../suite"),Test=require("../test"),utils=require("../utils"),escapeRe=require("escape-string-regexp");module.exports=function(e){var t=[e];e.on("pre-require",function(e,i,n){e.before=function(e,i){t[0].beforeAll(e,i)},e.after=function(e,i){t[0].afterAll(e,i)},e.beforeEach=function(e,i){t[0].beforeEach(e,i)},e.afterEach=function(e,i){t[0].afterEach(e,i)},e.describe=e.context=function(e,n){var r=Suite.create(t[0],e);return r.file=i,t.unshift(r),n.call(r),t.shift(),r},e.xdescribe=e.xcontext=e.describe.skip=function(e,i){var n=Suite.create(t[0],e);n.pending=!0,t.unshift(n),i.call(n),t.shift()},e.describe.only=function(t,i){var r=e.describe(t,i);return n.grep(r.fullTitle()),r},e.it=e.specify=function(e,n){var r=t[0];r.pending&&(n=null);var s=new Test(e,n);return s.file=i,r.addTest(s),s},e.it.only=function(t,i){var r=e.it(t,i),s="^"+escapeRe(r.fullTitle())+"$";return n.grep(new RegExp(s)),r},e.xit=e.xspecify=e.it.skip=function(t){e.it(t)}})};