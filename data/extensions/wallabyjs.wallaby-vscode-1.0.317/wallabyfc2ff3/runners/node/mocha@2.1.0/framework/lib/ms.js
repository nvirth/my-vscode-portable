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
function parse(e){var t=/^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(e);if(t){var i=parseFloat(t[1]),n=(t[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"y":return i*y;case"days":case"day":case"d":return i*d;case"hours":case"hour":case"h":return i*h;case"minutes":case"minute":case"m":return i*m;case"seconds":case"second":case"s":return i*s;case"ms":return i}}}function shortFormat(e){return e>=d?Math.round(e/d)+"d":e>=h?Math.round(e/h)+"h":e>=m?Math.round(e/m)+"m":e>=s?Math.round(e/s)+"s":e+"ms"}function longFormat(e){return plural(e,d,"day")||plural(e,h,"hour")||plural(e,m,"minute")||plural(e,s,"second")||e+" ms"}function plural(e,t,i){if(!(e<t))return e<1.5*t?Math.floor(e/t)+" "+i:Math.ceil(e/t)+" "+i+"s"}var s=1e3,m=60*s,h=60*m,d=24*h,y=365.25*d;module.exports=function(e,t){return t=t||{},"string"==typeof e?parse(e):t["long"]?longFormat(e):shortFormat(e)};