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
var Suite=require("../suite"),Test=require("../test"),escapeRe=require("escape-string-regexp"),utils=require("../utils");module.exports=function(e){var t=[e];e.on("pre-require",function(e,i,n){e.setup=function(e,i){t[0].beforeEach(e,i)},e.teardown=function(e,i){t[0].afterEach(e,i)},e.suiteSetup=function(e,i){t[0].beforeAll(e,i)},e.suiteTeardown=function(e,i){t[0].afterAll(e,i)},e.suite=function(e,n){var r=Suite.create(t[0],e);return r.file=i,t.unshift(r),n.call(r),t.shift(),r},e.suite.skip=function(e,i){var n=Suite.create(t[0],e);n.pending=!0,t.unshift(n),i.call(n),t.shift()},e.suite.only=function(t,i){var r=e.suite(t,i);n.grep(r.fullTitle())},e.test=function(e,n){var r=t[0];r.pending&&(n=null);var s=new Test(e,n);return s.file=i,r.addTest(s),s},e.test.only=function(t,i){var r=e.test(t,i),s="^"+escapeRe(r.fullTitle())+"$";n.grep(new RegExp(s))},e.test.skip=function(t){e.test(t)}})};