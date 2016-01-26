/*
 * jquery.finger
 * https://github.com/ngryman/jquery.finger
 *
 * Copyright (c) 2013 ngryman
 * Licensed under the MIT license.
 */
!function(e,t){function a(t){t.preventDefault(),e.event.remove(T,"click",a)}function n(e,t){return(p?t.originalEvent.touches[0]:t)["page"+e.toUpperCase()]}function r(t,n,r){var o=e.Event(n,b);e.event.trigger(o,{originalEvent:t},t.target),o.isDefaultPrevented()&&(~n.indexOf("tap")&&!p?e.event.add(T,"click",a):t.preventDefault()),r&&(e.event.remove(T,y+"."+D,i),e.event.remove(T,x+"."+D,d))}function o(t){var o=t.timeStamp||+new Date;l!=o&&(l=o,k.x=b.x=n("x",t),k.y=b.y=n("y",t),k.time=o,k.target=t.target,b.orientation=null,b.end=!1,u=!1,c=!1,v=setTimeout(function(){c=!0,r(t,"press")},w.pressDuration),e.event.add(T,y+"."+D,i),e.event.add(T,x+"."+D,d),w.preventDefault&&(t.preventDefault(),e.event.add(T,"click",a)))}function i(t){if(b.x=n("x",t),b.y=n("y",t),b.dx=b.x-k.x,b.dy=b.y-k.y,b.adx=Math.abs(b.dx),b.ady=Math.abs(b.dy),u=b.adx>w.motionThreshold||b.ady>w.motionThreshold){for(clearTimeout(v),b.orientation||(b.adx>b.ady?(b.orientation="horizontal",b.direction=b.dx>0?1:-1):(b.orientation="vertical",b.direction=b.dy>0?1:-1));t.target&&t.target!==k.target;)t.target=t.target.parentNode;return t.target!==k.target?(t.target=k.target,void d.call(this,e.Event(x+"."+D,t))):void r(t,"drag")}}function d(e){var t,a=e.timeStamp||+new Date,n=a-k.time;if(clearTimeout(v),u||c||e.target!==k.target)e.target=k.target,n<w.flickDuration&&r(e,"flick"),b.end=!0,t="drag";else{var o=g===e.target&&a-s<w.doubleTapInterval;t=o?"doubletap":"tap",g=o?null:k.target,s=a}r(e,t,!0)}var u,c,l,v,g,s,f=/chrome/i.exec(t),m=/android/i.exec(t),p="ontouchstart"in window&&!(f&&!m),h=p?"touchstart":"mousedown",x=p?"touchend touchcancel":"mouseup mouseleave",y=p?"touchmove":"mousemove",D="finger",T=e("html")[0],k={},b={},w=e.Finger={pressDuration:300,doubleTapInterval:300,flickDuration:150,motionThreshold:5};e.event.add(T,h+"."+D,o),e.each("tap doubletap press drag flick".split(" "),function(t,a){e.fn[a]=function(e){return e?this.on(a,e):this.trigger(a)}})}(jQuery,navigator.userAgent);

/* jQuery Storage API Plugin 1.7.4 https://github.com/julien-maurel/jQuery-Storage-API */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e("object"==typeof exports?require("jquery"):jQuery)}(function(e){function t(t){var r,i,n,o=arguments.length,s=window[t],a=arguments,u=a[1];if(2>o)throw Error("Minimum 2 arguments must be given");if(e.isArray(u)){i={};for(var f in u){r=u[f];try{i[r]=JSON.parse(s.getItem(r))}catch(c){i[r]=s.getItem(r)}}return i}if(2!=o){try{i=JSON.parse(s.getItem(u))}catch(c){throw new ReferenceError(u+" is not defined in this storage")}for(var f=2;o-1>f;f++)if(i=i[a[f]],void 0===i)throw new ReferenceError([].slice.call(a,1,f+1).join(".")+" is not defined in this storage");if(e.isArray(a[f])){n=i,i={};for(var m in a[f])i[a[f][m]]=n[a[f][m]];return i}return i[a[f]]}try{return JSON.parse(s.getItem(u))}catch(c){return s.getItem(u)}}function r(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1],u=s[2],f={};if(2>n||!e.isPlainObject(a)&&3>n)throw Error("Minimum 3 arguments must be given or second parameter must be an object");if(e.isPlainObject(a)){for(var c in a)r=a[c],e.isPlainObject(r)?o.setItem(c,JSON.stringify(r)):o.setItem(c,r);return a}if(3==n)return"object"==typeof u?o.setItem(a,JSON.stringify(u)):o.setItem(a,u),u;try{i=o.getItem(a),null!=i&&(f=JSON.parse(i))}catch(m){}i=f;for(var c=2;n-2>c;c++)r=s[c],i[r]&&e.isPlainObject(i[r])||(i[r]={}),i=i[r];return i[s[c]]=s[c+1],o.setItem(a,JSON.stringify(f)),f}function i(t){var r,i,n=arguments.length,o=window[t],s=arguments,a=s[1];if(2>n)throw Error("Minimum 2 arguments must be given");if(e.isArray(a)){for(var u in a)o.removeItem(a[u]);return!0}if(2==n)return o.removeItem(a),!0;try{r=i=JSON.parse(o.getItem(a))}catch(f){throw new ReferenceError(a+" is not defined in this storage")}for(var u=2;n-1>u;u++)if(i=i[s[u]],void 0===i)throw new ReferenceError([].slice.call(s,1,u).join(".")+" is not defined in this storage");if(e.isArray(s[u]))for(var c in s[u])delete i[s[u][c]];else delete i[s[u]];return o.setItem(a,JSON.stringify(r)),!0}function n(t,r){var n=a(t);for(var o in n)i(t,n[o]);if(r)for(var o in e.namespaceStorages)u(o)}function o(r){var i=arguments.length,n=arguments,s=(window[r],n[1]);if(1==i)return 0==a(r).length;if(e.isArray(s)){for(var u=0;u<s.length;u++)if(!o(r,s[u]))return!1;return!0}try{var f=t.apply(this,arguments);e.isArray(n[i-1])||(f={totest:f});for(var u in f)if(!(e.isPlainObject(f[u])&&e.isEmptyObject(f[u])||e.isArray(f[u])&&!f[u].length)&&f[u])return!1;return!0}catch(c){return!0}}function s(r){var i=arguments.length,n=arguments,o=(window[r],n[1]);if(2>i)throw Error("Minimum 2 arguments must be given");if(e.isArray(o)){for(var a=0;a<o.length;a++)if(!s(r,o[a]))return!1;return!0}try{var u=t.apply(this,arguments);e.isArray(n[i-1])||(u={totest:u});for(var a in u)if(void 0===u[a]||null===u[a])return!1;return!0}catch(f){return!1}}function a(r){var i=arguments.length,n=window[r],o=arguments,s=(o[1],[]),a={};if(a=i>1?t.apply(this,o):n,a._cookie)for(var u in e.cookie())""!=u&&s.push(u.replace(a._prefix,""));else for(var f in a)s.push(f);return s}function u(t){if(!t||"string"!=typeof t)throw Error("First parameter must be a string");g?(window.localStorage.getItem(t)||window.localStorage.setItem(t,"{}"),window.sessionStorage.getItem(t)||window.sessionStorage.setItem(t,"{}")):(window.localCookieStorage.getItem(t)||window.localCookieStorage.setItem(t,"{}"),window.sessionCookieStorage.getItem(t)||window.sessionCookieStorage.setItem(t,"{}"));var r={localStorage:e.extend({},e.localStorage,{_ns:t}),sessionStorage:e.extend({},e.sessionStorage,{_ns:t})};return e.cookie&&(window.cookieStorage.getItem(t)||window.cookieStorage.setItem(t,"{}"),r.cookieStorage=e.extend({},e.cookieStorage,{_ns:t})),e.namespaceStorages[t]=r,r}function f(e){var t="jsapi";try{return window[e]?(window[e].setItem(t,t),window[e].removeItem(t),!0):!1}catch(r){return!1}}var c="ls_",m="ss_",g=f("localStorage"),l={_type:"",_ns:"",_callMethod:function(e,t){var r=[this._type],t=Array.prototype.slice.call(t),i=t[0];return this._ns&&r.push(this._ns),"string"==typeof i&&-1!==i.indexOf(".")&&(t.shift(),[].unshift.apply(t,i.split("."))),[].push.apply(r,t),e.apply(this,r)},get:function(){return this._callMethod(t,arguments)},set:function(){var t=arguments.length,i=arguments,n=i[0];if(1>t||!e.isPlainObject(n)&&2>t)throw Error("Minimum 2 arguments must be given or first parameter must be an object");if(e.isPlainObject(n)&&this._ns){for(var o in n)r(this._type,this._ns,o,n[o]);return n}var s=this._callMethod(r,i);return this._ns?s[n.split(".")[0]]:s},remove:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(i,arguments)},removeAll:function(e){return this._ns?(r(this._type,this._ns,{}),!0):n(this._type,e)},isEmpty:function(){return this._callMethod(o,arguments)},isSet:function(){if(arguments.length<1)throw Error("Minimum 1 argument must be given");return this._callMethod(s,arguments)},keys:function(){return this._callMethod(a,arguments)}};if(e.cookie){window.name||(window.name=Math.floor(1e8*Math.random()));var h={_cookie:!0,_prefix:"",_expires:null,_path:null,_domain:null,setItem:function(t,r){e.cookie(this._prefix+t,r,{expires:this._expires,path:this._path,domain:this._domain})},getItem:function(t){return e.cookie(this._prefix+t)},removeItem:function(t){return e.removeCookie(this._prefix+t)},clear:function(){for(var t in e.cookie())""!=t&&(!this._prefix&&-1===t.indexOf(c)&&-1===t.indexOf(m)||this._prefix&&0===t.indexOf(this._prefix))&&e.removeCookie(t)},setExpires:function(e){return this._expires=e,this},setPath:function(e){return this._path=e,this},setDomain:function(e){return this._domain=e,this},setConf:function(e){return e.path&&(this._path=e.path),e.domain&&(this._domain=e.domain),e.expires&&(this._expires=e.expires),this},setDefaultConf:function(){this._path=this._domain=this._expires=null}};g||(window.localCookieStorage=e.extend({},h,{_prefix:c,_expires:3650}),window.sessionCookieStorage=e.extend({},h,{_prefix:m+window.name+"_"})),window.cookieStorage=e.extend({},h),e.cookieStorage=e.extend({},l,{_type:"cookieStorage",setExpires:function(e){return window.cookieStorage.setExpires(e),this},setPath:function(e){return window.cookieStorage.setPath(e),this},setDomain:function(e){return window.cookieStorage.setDomain(e),this},setConf:function(e){return window.cookieStorage.setConf(e),this},setDefaultConf:function(){return window.cookieStorage.setDefaultConf(),this}})}e.initNamespaceStorage=function(e){return u(e)},g?(e.localStorage=e.extend({},l,{_type:"localStorage"}),e.sessionStorage=e.extend({},l,{_type:"sessionStorage"})):(e.localStorage=e.extend({},l,{_type:"localCookieStorage"}),e.sessionStorage=e.extend({},l,{_type:"sessionCookieStorage"})),e.namespaceStorages={},e.removeAllStorages=function(t){e.localStorage.removeAll(t),e.sessionStorage.removeAll(t),e.cookieStorage&&e.cookieStorage.removeAll(t),t||(e.namespaceStorages={})}});

/* countdown */
(function(e){e.backward_timer=function(t){var n={seconds:5,format:"h%:m%:s%",on_exhausted:function(e){},on_tick:function(e){}},r=this;r.seconds_left=0;r.target=e(t);r.timeout=undefined;r.settings={};r.methods={init:function(t){r.settings=e.extend({},n,t);r.methods.reset()},start:function(){if(r.timeout==undefined){var e=r.seconds_left==r.settings.seconds?0:1e3;setTimeout(r.methods._on_tick,e,e)}},cancel:function(){if(r.timeout!=undefined){clearTimeout(r.timeout);r.timeout=undefined}},reset:function(){r.seconds_left=r.settings.seconds;r.methods._render_seconds()},_on_tick:function(e){if(e!=0){r.settings.on_tick(r)}r.methods._render_seconds();if(r.seconds_left>0){r.seconds_left--;var t=1e3;r.timeout=setTimeout(r.methods._on_tick,t,t)}else{r.timeout=undefined;r.settings.on_exhausted(r)}},_render_seconds:function(){var e=r.methods._seconds_to_dhms(r.seconds_left),t=r.settings.format;if(t.indexOf("d%")!==-1){t=t.replace("d%",e.d).replace("h%",r.methods._check_leading_zero(e.h))}else{t=t.replace("h%",e.d*24+e.h)}t=t.replace("m%",r.methods._check_leading_zero(e.m)).replace("s%",r.methods._check_leading_zero(e.s));r.target.text(t)},_seconds_to_dhms:function(e){var t=Math.floor(e/(24*3600)),e=e-t*24*3600,n=Math.floor(e/3600),e=e-n*3600,r=Math.floor(e/60),i=Math.floor(e-r*60);return{d:t,h:n,m:r,s:i}},_check_leading_zero:function(e){return e<10?"0"+e:""+e}}};e.fn.backward_timer=function(t){var n=arguments;return this.each(function(){var r=e(this).data("backward_timer");if(r==undefined){r=new e.backward_timer(this);e(this).data("backward_timer",r)}if(r.methods[t]){return r.methods[t].apply(this,Array.prototype.slice.call(n,1))}else if(typeof t==="object"||!t){return r.methods.init.apply(this,n)}else{e.error("Method "+t+" does not exist on jQuery.backward_timer")}})}})(jQuery)

/*

 * Author - Harshen Amarnath Pandey
 * Version - 1.0.8
 * Release - 18th April 2015
 * Copyright (c) 2014 - 2018 Harshen Pandey
 */

!function(n){function t(t,c){var S=n.extend({},n.fn.countdowntimer.defaults,c),t=t;t.addClass("style");var m="",M="",h="",v="";if(m=S.size,M=S.borderColor,h=S.fontColor,v=S.backgroundColor,void 0!=c.regexpMatchFormat&&void 0!=c.regexpReplaceWith&&void 0==c.timeSeparator&&(window["regexpMatchFormat_"+t.attr("id")]=c.regexpMatchFormat,window["regexpReplaceWith_"+t.attr("id")]=c.regexpReplaceWith),void 0!=c.borderColor||void 0!=c.fontColor||void 0!=c.backgroundColor){var g={background:v,color:h,"border-color":M};t.css(g)}else t.addClass("colorDefinition");if(void 0!=c.size)switch(m){case"xl":t.addClass("size_xl");break;case"lg":t.addClass("size_lg");break;case"md":t.addClass("size_md");break;case"sm":t.addClass("size_sm");break;case"xs":t.addClass("size_xs")}else"sm"==m&&t.addClass("size_sm");if(void 0!=c.startDate||void 0!=c.dateAndTime||void 0!=c.currentTime||void 0==c.hours&&void 0==c.minutes&&void 0==c.seconds)if(void 0!=c.startDate&&void 0!=c.dateAndTime&&void 0==c.currentTime){startDate="",endDate="",timer_startDate="",window["startDate"+t.attr("id")]=new Date(S.startDate),window["endDate"+t.attr("id")]=new Date(S.dateAndTime);var p="withStart";a(t,S,p),window["timer_startDate"+t.attr("id")]=setInterval(function(){a(t,S,p)},1e3*S.tickInterval)}else if(void 0==c.startDate&&void 0!=c.dateAndTime&&void 0==c.currentTime){startTime="",dateTime="",timer_givenDate="";var I=S.startDate.getHours()<10?"0"+S.startDate.getHours():S.startDate.getHours(),f=S.startDate.getMinutes()<10?"0"+S.startDate.getMinutes():S.startDate.getMinutes(),k=S.startDate.getSeconds()<10?"0"+S.startDate.getSeconds():S.startDate.getSeconds(),D=S.startDate.getMonth()+1<10?"0"+(S.startDate.getMonth()+1):S.startDate.getMonth()+1,T=S.startDate.getDate()<10?"0"+S.startDate.getDate():S.startDate.getDate(),x=S.startDate.getFullYear();window["startTime"+t.attr("id")]=new Date(x+"/"+D+"/"+T+" "+I+":"+f+":"+k),window["dateTime"+t.attr("id")]=new Date(S.dateAndTime);var p="withnoStart";a(t,S,p),window["timer_givenDate"+t.attr("id")]=setInterval(function(){a(t,S,p)},1e3*S.tickInterval)}else void 0!=c.currentTime?(currentTime="",timer_currentDate="",window["currentTime"+t.attr("id")]=S.currentTime,_(t,S),window["timer_currentDate"+t.attr("id")]=setInterval(function(){_(t,S)},1e3*S.tickInterval)):(countSeconds="",timer_secondsTimer="",window["countSeconds"+t.attr("id")]=S.seconds,window["timer_secondsTimer"+t.attr("id")]=setInterval(function(){u(t)},1e3));else void 0!=c.hours&&void 0==c.minutes&&void 0==c.seconds?(hours_H="",minutes_H="",seconds_H="",timer_H="",window["hours_H"+t.attr("id")]=S.hours,window["minutes_H"+t.attr("id")]=S.minutes,window["seconds_H"+t.attr("id")]=S.seconds,void 0!=c.pauseButton&&l(t,"H",S,e),void 0!=c.stopButton&&H(t,"H",S,e),e(t,S),window["timer_H"+t.attr("id")]=setInterval(function(){e(t,S)},1e3*S.tickInterval)):void 0==c.hours&&void 0!=c.minutes&&void 0==c.seconds?(hours_M="",minutes_M="",seconds_M="",timer_M="",window["hours_M"+t.attr("id")]=S.hours,window["minutes_M"+t.attr("id")]=S.minutes,window["seconds_M"+t.attr("id")]=S.seconds,void 0!=c.pauseButton&&l(t,"M",S,o),void 0!=c.stopButton&&H(t,"M",S,o),o(t,S),window["timer_M"+t.attr("id")]=setInterval(function(){o(t,S)},1e3*S.tickInterval)):void 0==c.hours&&void 0==c.minutes&&void 0!=c.seconds?(hours_S="",minutes_S="",seconds_S="",timer_S="",window["hours_S"+t.attr("id")]=S.hours,window["minutes_S"+t.attr("id")]=S.minutes,window["seconds_S"+t.attr("id")]=S.seconds,void 0!=c.pauseButton&&l(t,"S",S,i),void 0!=c.stopButton&&H(t,"S",S,i),i(t,S),window["timer_S"+t.attr("id")]=setInterval(function(){i(t,S)},1e3*S.tickInterval)):void 0!=c.hours&&void 0!=c.minutes&&void 0==c.seconds?(hours_HM="",minutes_HM="",seconds_HM="",timer_HM="",window["hours_HM"+t.attr("id")]=S.hours,window["minutes_HM"+t.attr("id")]=S.minutes,window["seconds_HM"+t.attr("id")]=S.seconds,void 0!=c.pauseButton&&l(t,"HM",S,w),void 0!=c.stopButton&&H(t,"HM",S,w),w(t,S),window["timer_HM"+t.attr("id")]=setInterval(function(){w(t,S)},1e3*S.tickInterval)):void 0==c.hours&&void 0!=c.minutes&&void 0!=c.seconds?(hours_MS="",minutes_MS="",seconds_MS="",timer_MS="",window["hours_MS"+t.attr("id")]=S.hours,window["minutes_MS"+t.attr("id")]=S.minutes,window["seconds_MS"+t.attr("id")]=S.seconds,void 0!=c.pauseButton&&l(t,"MS",S,d),void 0!=c.stopButton&&H(t,"MS",S,d),d(t,S),window["timer_MS"+t.attr("id")]=setInterval(function(){d(t,S)},1e3*S.tickInterval)):void 0!=c.hours&&void 0==c.minutes&&void 0!=c.seconds?(hours_HS="",minutes_HS="",seconds_HS="",timer_HS="",window["hours_HS"+t.attr("id")]=S.hours,window["minutes_HS"+t.attr("id")]=S.minutes,window["seconds_HS"+t.attr("id")]=S.seconds,void 0!=c.pauseButton&&l(t,"HS",S,s),void 0!=c.stopButton&&H(t,"HS",S,s),s(t,S),window["timer_HS"+t.attr("id")]=setInterval(function(){s(t,S)},1e3*S.tickInterval)):void 0!=c.hours&&void 0!=c.minutes&&void 0!=c.seconds&&(hours_HMS="",minutes_HMS="",seconds_HMS="",timer_HMS="",window["hours_HMS"+t.attr("id")]=S.hours,window["minutes_HMS"+t.attr("id")]=S.minutes,window["seconds_HMS"+t.attr("id")]=S.seconds,void 0!=c.pauseButton&&l(t,"HMS",S,r),void 0!=c.stopButton&&H(t,"HMS",S,r),r(t,S),window["timer_HMS"+t.attr("id")]=setInterval(function(){r(t,S)},1e3*S.tickInterval))}function e(n,t){var e=n.attr("id");window["minutes_H"+e]==t.minutes&&window["seconds_H"+e]==t.seconds&&window["hours_H"+e]==t.hours?(window["hours_H"+e].toString().length<2&&(window["hours_H"+e]="0"+window["hours_H"+e]),S(n,window["hours_H"+e]+t.timeSeparator+"00"+t.timeSeparator+"00"),window["seconds_H"+e]=60-t.tickInterval,window["minutes_H"+e]=59,0!=window["hours_H"+e]?window["hours_H"+e]--:(delete window["hours_H"+e],delete window["minutes_H"+e],delete window["seconds_H"+e],clearInterval(window["timer_H"+e]),c(n,t))):(window["hours_H"+e].toString().length<2&&(window["hours_H"+e]="0"+window["hours_H"+e]),window["minutes_H"+e].toString().length<2&&(window["minutes_H"+e]="0"+window["minutes_H"+e]),window["seconds_H"+e].toString().length<2&&(window["seconds_H"+e]="0"+window["seconds_H"+e]),S(n,window["hours_H"+e]+t.timeSeparator+window["minutes_H"+e]+t.timeSeparator+window["seconds_H"+e]),window["seconds_H"+e]-=t.tickInterval,0!=window["minutes_H"+e]&&window["seconds_H"+e]<0&&(window["minutes_H"+e]--,window["seconds_H"+e]=60-t.tickInterval),0==window["minutes_H"+e]&&window["seconds_H"+e]<0&&0!=window["hours_H"+e]&&(window["hours_H"+e]--,window["minutes_H"+e]=59,window["seconds_H"+e]=60-t.tickInterval),0==window["minutes_H"+e]&&window["seconds_H"+e]<0&&0==window["hours_H"+e]&&(delete window["hours_H"+e],delete window["minutes_H"+e],delete window["seconds_H"+e],clearInterval(window["timer_H"+e]),c(n,t))),e=null}function o(n,t){var e=n.attr("id");window["minutes_M"+e]==t.minutes&&window["seconds_M"+e]==t.seconds?(window["minutes_M"+e].toString().length<2&&(window["minutes_M"+e]="0"+window["minutes_M"+e]),S(n,window["minutes_M"+e]+t.timeSeparator+"00"),window["seconds_M"+e]=60-t.tickInterval,0!=window["minutes_M"+e]?window["minutes_M"+e]--:(delete window["hours_M"+e],delete window["minutes_M"+e],delete window["seconds_M"+e],clearInterval(window["timer_M"+e]),c(n,t))):(window["minutes_M"+e].toString().length<2&&(window["minutes_M"+e]="0"+window["minutes_M"+e]),window["seconds_M"+e].toString().length<2&&(window["seconds_M"+e]="0"+window["seconds_M"+e]),S(n,window["minutes_M"+e]+t.timeSeparator+window["seconds_M"+e]),window["seconds_M"+e]-=t.tickInterval,0!=window["minutes_M"+e]&&window["seconds_M"+e]<0&&(window["minutes_M"+e]--,window["seconds_M"+e]=60-t.tickInterval),0==window["minutes_M"+e]&&window["seconds_M"+e]<0&&(delete window["hours_M"+e],delete window["minutes_M"+e],delete window["seconds_M"+e],clearInterval(window["timer_M"+e]),c(n,t))),e=null}function i(n,t){var e=n.attr("id");window["seconds_S"+e].toString().length<2&&(window["seconds_S"+e]="0"+window["seconds_S"+e]),S(n,window["seconds_S"+e]+" sec"),window["seconds_S"+e]-=t.tickInterval,window["seconds_S"+e]<0&&(delete window["hours_S"+e],delete window["minutes_S"+e],delete window["seconds_S"+e],clearInterval(window["timer_S"+e]),c(n,t)),e=null}function w(n,t){var e=n.attr("id");window["minutes_HM"+e]==t.minutes&&window["hours_HM"+e]==t.hours?(window["hours_HM"+e].toString().length<2&&(window["hours_HM"+e]="0"+window["hours_HM"+e]),window["minutes_HM"+e].toString().length<2&&(window["minutes_HM"+e]="0"+window["minutes_HM"+e]),S(n,window["hours_HM"+e]+t.timeSeparator+window["minutes_HM"+e]+t.timeSeparator+"00"),0!=window["hours_HM"+e]&&0==window["minutes_HM"+e]?(window["hours_HM"+e]--,window["minutes_HM"+e]=59,window["seconds_HM"+e]=60-t.tickInterval):0==window["hours_HM"+e]&&0!=window["minutes_HM"+e]?(window["seconds_HM"+e]=60-t.tickInterval,window["minutes_HM"+e]--):(window["seconds_HM"+e]=60-t.tickInterval,window["minutes_HM"+e]--),0==window["hours_HM"+e]&&0==window["minutes_HM"+e]&&60==window["seconds_HM"+e]&&(delete window["hours_HM"+e],delete window["minutes_HM"+e],delete window["seconds_HM"+e],clearInterval(window["timer_HM"+e]),c(n,t))):(window["hours_HM"+e].toString().length<2&&(window["hours_HM"+e]="0"+window["hours_HM"+e]),window["minutes_HM"+e].toString().length<2&&(window["minutes_HM"+e]="0"+window["minutes_HM"+e]),window["seconds_HM"+e].toString().length<2&&(window["seconds_HM"+e]="0"+window["seconds_HM"+e]),S(n,window["hours_HM"+e]+t.timeSeparator+window["minutes_HM"+e]+t.timeSeparator+window["seconds_HM"+e]),window["seconds_HM"+e]-=t.tickInterval,0!=window["minutes_HM"+e]&&window["seconds_HM"+e]<0&&(window["minutes_HM"+e]--,window["seconds_HM"+e]=60-t.tickInterval),0==window["minutes_HM"+e]&&window["seconds_HM"+e]<0&&0!=window["hours_HM"+e]&&(window["hours_HM"+e]--,window["minutes_HM"+e]=59,window["seconds_HM"+e]=60-t.tickInterval),0==window["minutes_HM"+e]&&window["seconds_HM"+e]<0&&0==window["hours_HM"+e]&&(delete window["hours_HM"+e],delete window["minutes_HM"+e],delete window["seconds_HM"+e],clearInterval(window["timer_HM"+e]),c(n,t))),e=null}function d(n,t){var e=n.attr("id");window["minutes_MS"+e]==t.minutes&&window["seconds_MS"+e]==t.seconds?(window["minutes_MS"+e].toString().length<2&&(window["minutes_MS"+e]="0"+window["minutes_MS"+e]),window["seconds_MS"+e].toString().length<2&&(window["seconds_MS"+e]="0"+window["seconds_MS"+e]),S(n,window["minutes_MS"+e]+t.timeSeparator+window["seconds_MS"+e]),0!=window["minutes_MS"+e]&&0==window["seconds_MS"+e]?(window["minutes_MS"+e]--,window["seconds_MS"+e]=60-t.tickInterval):0==window["minutes_MS"+e]&&0==window["seconds_MS"+e]?(delete window["hours_MS"+e],delete window["minutes_MS"+e],delete window["seconds_MS"+e],clearInterval(window["timer_MS"+e]),c(n,t)):window["seconds_MS"+e]-=t.tickInterval):(window["minutes_MS"+e].toString().length<2&&(window["minutes_MS"+e]="0"+window["minutes_MS"+e]),window["seconds_MS"+e].toString().length<2&&(window["seconds_MS"+e]="0"+window["seconds_MS"+e]),S(n,window["minutes_MS"+e]+t.timeSeparator+window["seconds_MS"+e]),window["seconds_MS"+e]-=t.tickInterval,0!=window["minutes_MS"+e]&&window["seconds_MS"+e]<0&&(window["minutes_MS"+e]--,window["seconds_MS"+e]=60-t.tickInterval),0==window["minutes_MS"+e]&&window["seconds_MS"+e]<0&&(delete window["hours_MS"+e],delete window["minutes_MS"+e],delete window["seconds_MS"+e],clearInterval(window["timer_MS"+e]),c(n,t))),e=null}function s(n,t){var e=n.attr("id");window["seconds_HS"+e]==t.seconds&&window["hours_HS"+e]==t.hours?(window["hours_HS"+e].toString().length<2&&(window["hours_HS"+e]="0"+window["hours_HS"+e]),window["seconds_HS"+e].toString().length<2&&(window["seconds_HS"+e]="0"+window["seconds_HS"+e]),S(n,window["hours_HS"+e]+t.timeSeparator+"00"+t.timeSeparator+window["seconds_HS"+e]),0==window["hours_HS"+e]&&0==window["seconds_HS"+e]?(delete window["hours_HS"+e],delete window["minutes_HS"+e],delete window["seconds_HS"+e],clearInterval(window["timer_HS"+e]),c(n,t)):0!=window["hours_HS"+e]&&0==window["seconds_HS"+e]?(window["hours_HS"+e]--,window["minutes_HS"+e]=59,window["seconds_HS"+e]=60-t.tickInterval):window["seconds_HS"+e]-=t.tickInterval):(window["hours_HS"+e].toString().length<2&&(window["hours_HS"+e]="0"+window["hours_HS"+e]),window["minutes_HS"+e].toString().length<2&&(window["minutes_HS"+e]="0"+window["minutes_HS"+e]),window["seconds_HS"+e].toString().length<2&&(window["seconds_HS"+e]="0"+window["seconds_HS"+e]),S(n,window["hours_HS"+e]+t.timeSeparator+window["minutes_HS"+e]+t.timeSeparator+window["seconds_HS"+e]),window["seconds_HS"+e]-=t.tickInterval,0!=window["minutes_HS"+e]&&window["seconds_HS"+e]<0&&(window["minutes_HS"+e]--,window["seconds_HS"+e]=60-t.tickInterval),0==window["minutes_HS"+e]&&window["seconds_HS"+e]<0&&0!=window["hours_HS"+e]&&(window["hours_HS"+e]--,window["minutes_HS"+e]=59,window["seconds_HS"+e]=60-t.tickInterval),0==window["minutes_HS"+e]&&window["seconds_HS"+e]<0&&0==window["hours_HS"+e]&&(delete window["hours_HS"+e],delete window["minutes_HS"+e],delete window["seconds_HS"+e],clearInterval(window["timer_HS"+e]),c(n,t))),e=null}function r(n,t){var e=n.attr("id");window["minutes_HMS"+e]==t.minutes&&window["seconds_HMS"+e]==t.seconds&&window["hours_HMS"+e]==t.hours?(window["hours_HMS"+e].toString().length<2&&(window["hours_HMS"+e]="0"+window["hours_HMS"+e]),window["minutes_HMS"+e].toString().length<2&&(window["minutes_HMS"+e]="0"+window["minutes_HMS"+e]),window["seconds_HMS"+e].toString().length<2&&(window["seconds_HMS"+e]="0"+window["seconds_HMS"+e]),S(n,window["hours_HMS"+e]+t.timeSeparator+window["minutes_HMS"+e]+t.timeSeparator+window["seconds_HMS"+e]),0==window["hours_HMS"+e]&&0==window["minutes_HMS"+e]&&0==window["seconds_HMS"+e]?(delete window["hours_HMS"+e],delete window["minutes_HMS"+e],delete window["seconds_HMS"+e],clearInterval(window["timer_HMS"+e]),c(n,t)):0!=window["hours_HMS"+e]&&0==window["minutes_HMS"+e]&&0==window["seconds_HMS"+e]?(window["hours_HMS"+e]--,window["minutes_HMS"+e]=59,window["seconds_HMS"+e]=60-t.tickInterval):0==window["hours_HMS"+e]&&0!=window["minutes_HMS"+e]&&0==window["seconds_HMS"+e]?(window["minutes_HMS"+e]--,window["seconds_HMS"+e]=60-t.tickInterval):0!=window["hours_HMS"+e]&&0!=window["minutes_HMS"+e]&&0==window["seconds_HMS"+e]?(window["minutes_HMS"+e]--,window["seconds_HMS"+e]=60-t.tickInterval):window["seconds_HMS"+e]-=t.tickInterval):(window["hours_HMS"+e].toString().length<2&&(window["hours_HMS"+e]="0"+window["hours_HMS"+e]),window["minutes_HMS"+e].toString().length<2&&(window["minutes_HMS"+e]="0"+window["minutes_HMS"+e]),window["seconds_HMS"+e].toString().length<2&&(window["seconds_HMS"+e]="0"+window["seconds_HMS"+e]),S(n,window["hours_HMS"+e]+t.timeSeparator+window["minutes_HMS"+e]+t.timeSeparator+window["seconds_HMS"+e]),window["seconds_HMS"+e]-=t.tickInterval,0!=window["minutes_HMS"+e]&&window["seconds_HMS"+e]<0&&(window["minutes_HMS"+e]--,window["seconds_HMS"+e]=60-t.tickInterval),0==window["minutes_HMS"+e]&&window["seconds_HMS"+e]<0&&0!=window["hours_HMS"+e]&&(window["hours_HMS"+e]--,window["minutes_HMS"+e]=59,window["seconds_HMS"+e]=60-t.tickInterval),0==window["minutes_HMS"+e]&&window["seconds_HMS"+e]<0&&0==window["hours_HMS"+e]&&(delete window["hours_HMS"+e],delete window["minutes_HMS"+e],delete window["seconds_HMS"+e],clearInterval(window["timer_HMS"+e]),c(n,t))),e=null}function a(n,t,e){var o=n.attr("id"),i="withnoStart"==e?window["dateTime"+o]:window["endDate"+o],w="withnoStart"==e?window["startTime"+o]:window["startDate"+o],d=Math.floor((i-w)/864e5),s=Math.floor((i-w)%864e5/36e5),r=Math.floor((i-w)%864e5/6e4)%60,a=Math.floor((i-w)%864e5/1e3)%60%60;i-w>0?(d.toString().length<2&&(d="0"+d),s.toString().length<2&&(s="0"+s),r.toString().length<2&&(r="0"+r),a.toString().length<2&&(a="0"+a),S(n,d+t.timeSeparator+s+t.timeSeparator+r+t.timeSeparator+a),"withnoStart"==e?window["startTime"+o].setSeconds(window["startTime"+o].getSeconds()+t.tickInterval):window["startDate"+o].setSeconds(window["startDate"+o].getSeconds()+t.tickInterval)):(S(n,"00"+t.timeSeparator+"00"+t.timeSeparator+"00"+t.timeSeparator+"00"),"withnoStart"==e?(delete window["dateTime"+o],delete window["startTime"+o],clearInterval(window["timer_givenDate"+o])):"withStart"==e&&(delete window["startDate"+o],delete window["endDate"+o],clearInterval(window["timer_startDate"+o])),c(n,t)),o=null}function _(n,t){if(1==window["currentTime"+n.attr("id")]){var e=new Date,o=e.getHours(),i=e.getMinutes(),w=e.getSeconds();o.toString().length<2&&(o="0"+o),i.toString().length<2&&(i="0"+i),w.toString().length<2&&(w="0"+w),S(n,o+t.timeSeparator+i+t.timeSeparator+w)}else alert("Set Current Time option.")}function u(n){var t=n.attr("id");window["countSeconds"+t].toString().length<2&&(window["countSeconds"+t]="0"+window["countSeconds"+t]),S(n,window["countSeconds"+t]+" sec"),window["countSeconds"+t]--,-1==window["countSeconds"+t]&&(delete window["countSeconds"+t],clearInterval(window["timer_secondsTimer"+t])),t=null}function c(t,e){null!=e.timeUp&&1==n.isFunction(e.timeUp)&&e.timeUp.apply(t,[]),null!=e.expiryUrl&&(window.location=e.expiryUrl)}function S(n,t){var e=t;if("undefined"!=typeof window["regexpMatchFormat_"+n.attr("id")]&&"undefined"!=typeof window["regexpReplaceWith_"+n.attr("id")]){var o=new RegExp(window["regexpMatchFormat_"+n.attr("id")]);e=t.replace(o,window["regexpReplaceWith_"+n.attr("id")])}n.html(e)}function l(t,e,o,i){n("#"+o.pauseButton).click(function(){"resume"!=n(this).val()?(n("#"+o.pauseButton).val("resume").text("Resume"),clearInterval(window["timer_"+e+t.attr("id")])):"resume"==n(this).val()&&(n("#"+o.pauseButton).val("pause").text("Pause"),window["timer_"+e+t.attr("id")]=setInterval(function(){i(t,o)},1e3*o.tickInterval))})}function H(t,e,o,i){n("#"+o.stopButton).click(function(){"start"!=n(this).val()?(n("#"+o.stopButton).val("start").text("Start"),clearInterval(window["timer_"+e+t.attr("id")]),window["hours_"+e+t.attr("id")]=o.hours,window["minutes_"+e+t.attr("id")]=o.minutes,window["seconds_"+e+t.attr("id")]=o.seconds,i(t,o)):"start"==n(this).val()&&(n("#"+o.stopButton).val("stop").text("Stop"),window["timer_"+e+t.attr("id")]=setInterval(function(){i(t,o)},1e3*o.tickInterval))})}n.fn.countdowntimer=function(e){return this.each(function(){t(n(this),e)})},n.fn.countdowntimer.defaults={hours:0,minutes:0,seconds:60,startDate:new Date,dateAndTime:new Date("0000/00/00 00:00:00"),currentTime:!1,size:"sm",borderColor:"#F0068E",fontColor:"#FFFFFF",backgroundColor:"#000000",timeSeparator:":",tickInterval:1,timeUp:null,expiryUrl:null,regexpMatchFormat:null,regexpReplaceWith:null,pauseButton:null,stopButton:null}}(jQuery);

/*
 * Check Byte - jQuery plugin for checking for byte v1.1 (2011-11-11)
 * jquery.checkbyte.js
 * code by francis lee depend on jquery.textchange.js with jQuery v1.6.4
 * compressed by http://javascriptcompressor.com/
 */
!function(i){i.fn.checkbyte=function(e){var t={indicator:i("#indicator"),limit:80,twice:!1};e&&i.extend(t,e);var n={chrome:!1,mozilla:!1,opera:!1,msie:!1,safari:!1},r=navigator.userAgent;return r.indexOf("Chrome")>-1?n.chrome=!0:r.indexOf("Safari")>-1?n.safari=!0:r.indexOf("Opera")>-1?n.opera=!0:r.indexOf("Firefox")>-1?n.mozilla=!0:r.indexOf("MSIE")>-1&&(n.msie=!0),this.each(function(){var e=i(this);n.mozilla||n.opera?e.bind("textchange",function(){i.check(e,t.indicator,parseInt(t.limit),t.twice)}):e.bind("keyup",function(){i.check(e,t.indicator,parseInt(t.limit),t.twice)})})},i.limitString=function(i,e){for(var t=new String(i),n=0,r=0;r<i.length;r++){var a=escape(i.charAt(r));if(1==a.length?n++:-1!=a.indexOf("%u")?n+=2:-1!=a.indexOf("%")&&(n+=a.length/3),n>e){t=t.substring(0,r);break}}return t},i.byteString=function(i){for(var e=0,t=0;t<i.length;t++){var n=escape(i.charAt(t));1==n.length?e++:-1!=n.indexOf("%u")?e+=2:-1!=n.indexOf("%")&&(e+=n.length/3)}return e};var e=!1;i.check=function(t,n,r,a){var c=i.byteString(t.val());a?(0==e&&c>r&&(confirm("메세지 내용이 "+r+"byte를 넘으면 문자메세지는 2건으로 전송됩니다. 계속 하시겠습니까?")?e=!0:t.val(i.limitString(t.val(),r))),c>2*r&&(alert("메시지 내용은 "+2*r+"byte를 넘을수 없습니다. 초과된 부분은 자동으로 삭제됩니다."),t.val(i.limitString(t.val(),2*r)))):c>r&&(alert("메시지 내용은 "+r+"byte를 넘을수 없습니다. 초과된 부분은 자동으로 삭제됩니다."),t.val(i.limitString(t.val(),r))),n.html(i.byteString(t.val()))}}(jQuery);

/*
 create namespace device
 navigator.userAgent로 현재 디바이스 환경을 detect
 */

var device = device || {};
device = ( function() {
    return {
        chkDevice: {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPod/i);
            },
            iPAD: function () {
                return navigator.userAgent.match(/iPad/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            Mobile: function () {
                return (chkDevice.Android() || chkDevice.BlackBerry() || chkDevice.iOS() || chkDevice.Opera() || chkDevice.Windows());
            }
        },
        checkDeviceType: function () {
            if (device.chkDevice.Android())
                deviceType = "android";
            else if (device.chkDevice.iOS())
                deviceType = "ios";
            else if (device.chkDevice.iPAD())
                deviceType = "ipad";
            else
                deviceType = "unknown";

            jQuery('html').addClass(deviceType);

            return deviceType;
        }
    }
})();

var mobile = mobile || {};
mobile = ( function() {
    return {
        event : function() {
            _evt='tap';

            return _evt.toString();
        }
    };
})();

var TimeWallet=TimeWallet||{};

var twCommonUi = twCommonUi || {};
twCommonUi = (function() {
    /*********************************************************************************
     * 페이지 : 공통
     * 상단 헤더 이전 버튼
     *********************************************************************************/

    //public
    return {
        curLoc: {lat: '', lng: ''},
        dragCurLoc:{lat:'',lng:''},
        options:{},
        $dcBody: jQuery(document.body),
        mMap:'',
        apiDelayTime:300,
        drugCurLoc:{},
        mapCheckStatus:{
            enable:false,
            data:{
                shop_latitude:'',
                shop_longitude:'',
                shop_name:'',
                shop_idx:''
            }
        },

        findAndRemove:function(array, property, value) {
            //remove json data
            Lazy(array).each(function(result,index) {
                console.log(result);
                if(result[property] == value) {
                    //Remove from array
                    array.splice(index, 1);
                }
            });
        },

        /*********************************************************************************
         * getApiData
         * params
         * reqwest option
         * ex) {
                'url':_url,
                'type':'jsonp',
                'method':'get',
                'data':'' or {'user':userName} or [{'user1':userName1},{'user2':userName2}]
                }
         'url' a fully qualified uri
         'method' http method (default: GET)
         'headers' http headers (default: {})
         'data' entity body for PATCH, POST and PUT requests. Must be a query String or JSON object
         'type' a string enum. html, xml, json, or jsonp. Default is inferred by resource extension. Eg: .json will set type to json. .xml to xml etc.
         'contentType' sets the Content-Type of the request. Eg: application/json
         'crossOrigin' for cross-origin requests for browsers that support this feature.
         'success' A function called when the request successfully completes
         'error' A function called when the request fails.
         'complete' A function called whether the request is a success or failure. Always called when complete.
         'jsonpCallback' Specify the callback function name for a JSONP request. This value will be used instead of the random (but recommended) name automatically generated by reqwest.
         *
         * html insert type : 'html','append','prepend'
         * ReactAddons = push data
         * after getApiData call callback
         *********************************************************************************/
        getApiData:function(params,listType,reactAddons,callback) {
            var _this=this;

            var loading = '<div class="loader" title="2" style="position: absolute;top: 50%;left: 50%;z-index: 999;width: 100px;height: 100px;margin: -50px 0 0 -50px;">' +
                '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 792" style="enable-background:new 0 0 612 792;" xml:space="preserve">'+
                '<style type="text/css">'+
                '.st0{opacity:0.2;fill:#1A1A1A;} .st1{fill:#FFFFFF;} .second {-webkit-transform: rotate(360deg);-webkit-transform-origin:50% 91.5%;-webkit-transition-duration: 1s; -webkit-transition-delay: now; -webkit-animation-timing-function: linear; -webkit-animation-iteration-count: infinite;}'+
                '@-webkit-keyframes second {'+
                'from {-ms-transform: rotate(0deg); -moz-transform: rotate(0deg);-webkit-transform: rotate(0deg); -o-transform: rotate(0deg);transform: rotate(0deg);}'+
                'to {-ms-transform: rotate(360deg); -moz-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); transform: rotate(360deg);}'+
                '}'+
                '@keyframes second {'+
                'from {-ms-transform: rotate(0deg); -moz-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg);transform: rotate(0deg);}'+
                'to {-ms-transform: rotate(360deg); -moz-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg);transform: rotate(360deg);}'+
                '}'+
                '.second {-webkit-animation: second 2s linear infinite; -moz-animation: second 2s linear infinite; -ms-animation: second 2s linear infinite; -o-animation: second 2s linear infinite;animation: second 2s linear infinite;}'+
                '</style>'+
                '<ellipse id="XMLID_820_" class="st0" cx="308.4" cy="604.5" rx="183.8" ry="40.1"/>'+
                '<circle id="XMLID_674_" class="st1" cx="306" cy="361.4" r="230.8"/>'+
                '<path id="XMLID_671_" class="st2" d="M306,602.4c-132.9,0-241-108.1-241-241s108.1-241,241-241s241,108.1,241,241S438.9,602.4,306,602.4z M306,140.8c-121.6,0-220.6,99-220.6,220.6S184.4,582,306,582s220.6-99,220.6-220.6S427.6,140.8,306,140.8z" />'+
                '<path id="XMLID_669_" class="st2" d="M306,198.4c-1.6,0-2.9-1.3-2.9-2.9v-34.2c0-1.6,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v34.2C308.9,197.1,307.6,198.4,306,198.4z"/>'+
                '<path id="XMLID_667_" class="st2" d="M188.7,247c-0.7,0-1.5-0.3-2.1-0.9l-24.2-24.2c-1.1-1.1-1.1-3,0-4.1c1.1-1.1,3-1.1,4.1,0l24.2,24.2c1.1,1.1,1.1,3,0,4.1C190.2,246.7,189.4,247,188.7,247z"/>'+
                '<path id="XMLID_665_" class="st2" d="M140.1,364.3h-34.2c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9h34.2c1.6,0,2.9,1.3,2.9,2.9C143,363,141.7,364.3,140.1,364.3z"/>'+
                '<path id="XMLID_655_" class="st2" d="M164.5,505.8c-0.7,0-1.5-0.3-2.1-0.9c-1.1-1.1-1.1-3,0-4.1l24.2-24.2c1.1-1.1,3-1.1,4.1,0c1.1,1.1,1.1,3,0,4.1L166.5,505C166,505.5,165.2,505.8,164.5,505.8z"/>'+
                '<path id="XMLID_650_" class="st2" d="M306,564.4c-1.6,0-2.9-1.3-2.9-2.9v-34.2c0-1.6,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v34.2C308.9,563.1,307.6,564.4,306,564.4z"/>'+
                '<path id="XMLID_648_" class="st2" d="M447.5,505.8c-0.7,0-1.5-0.3-2.1-0.9l-24.2-24.2c-1.1-1.1-1.1-3,0-4.1c1.1-1.1,3-1.1,4.1,0l24.2,24.2c1.1,1.1,1.1,3,0,4.1C449,505.5,448.3,505.8,447.5,505.8z"/>'+
                '<path id="XMLID_646_" class="st2" d="M506.1,364.3h-34.2c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9h34.2c1.6,0,2.9,1.3,2.9,2.9C509.1,363,507.8,364.3,506.1,364.3z"/>'+
                '<path id="XMLID_632_" class="st2" d="M423.3,247c-0.7,0-1.5-0.3-2.1-0.9c-1.1-1.1-1.1-3,0-4.1l24.2-24.2c1.1-1.1,3-1.1,4.1,0c1.1,1.1,1.1,3,0,4.1l-24.2,24.2C424.8,246.7,424.1,247,423.3,247z"/>'+
                '<path id="XMLID_623_" class="st2 second" d="M309,211.4c-0.3-3.7-5.7-3.7-6,0l-11.7,147.9c0,8.1,6.6,14.7,14.7,14.7s14.7-6.6,14.7-14.7L309,211.4z" />'+
                '</svg>'+
                '</div>';

            if(!params.url.match('zipcode')) {
                jQuery('body').css('pointer-events','none').append(loading);
            }

            setTimeout(function() {
                reqwest(params)
                    .then(function (resp) {
                        if(resp[0].ResultCode=='1') {
                            if (typeof callback === 'function') {
                                callback.call(_this, listType, resp, reactAddons);
                            }
                            twCommonUi.stopLoading();
                        }

                    })
                    .fail(function (err, msg) {
                        console.log(err);
                        jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                    });
            }, twCommonUi.apiDelayTime);
        },
        /*********************************************************************************
         * getApiList
         * params
         * _this=ReactClass
         * listType=html insert type
         * resp get getApiData(api data)
         * ReactAddons = push data
         *********************************************************************************/
        getApiList:function(_this,listType,resp,reactAddons) {
            var _newList={};

            if(listType=='append') {
                _newList = reactAddons.update(_this.state, {

                    list: {
                        $push: resp[0].ResultData
                    }
                });
            } else {
                _newList.list = resp;
            }

            return _newList;
        },
        /*********************************************************************************
         * checkAndroidModal
         * params = true, false
         * function check sidebar status on android
         * if true open sidebar, false close sidebar
         *********************************************************************************/
        checkAndroidModal:function(b) {
            if (device.checkDeviceType() == 'android') {
                if(typeof TimeWallet.setSideBarOpened=='function') {
                    TimeWallet.setSideBarOpened(b);
                }
            }

        },
        closeSidebar : function() {
            jQuery('html').removeClass('overflowHidden');
            this.closeLayer();
            this.checkAndroidModal(false);
        },
        closeLayer:function() {
            /*********************************************************************************
             * 페이지 : 공통
             * sidebar 레이어 닫기
             *********************************************************************************/
            var _$s=jQuery('.sidebar'),
                _$c=jQuery('.container');

            jQuery('.btn-sidebar').removeClass('active');
            _$s.removeClass('active');
            jQuery('.container').removeClass('sidebarActive');
            jQuery('html').removeClass('overflowHidden');
            this.hideBgModal();
        },
        showModal : function(_$m, flag) {
            /*********************************************************************************
             * 페이지 : 공통
             * 모달
             * 키보드 제어(보이기)
             *********************************************************************************/
            var _top=0;

            if(_$m.attr('class').match('modal-location')||_$m.attr('class').match('modal-state-explain')||_$m.attr('class').match('modal-icon-explain')) {
                _$m.css({
                    top: 0,
                    margin:0
                });
            } else {
                _$m.css({
                    top: ((jQuery(window).height() - _$m.height()) / 2) + jQuery(window).scrollTop()
                });
            }

            if(_$m.attr('class').match('modal-state-explain')||_$m.attr('class').match('modal-icon-explain')) {
                _$m.css({
                    height: jQuery(window).height()
                });
            }

            _$m.show();

            /* 키보드 포커스 */
            if(!flag) {
                twCommonUi.keyboardUp(_$m);
                console.log('키보드 포커스');
            }
            if(flag != 'noBg') {
                this.showBgModal();
                jQuery('.shadow').css('height',jQuery(document).height());
            }
            jQuery('html').addClass('overflowHidden');
        },
        hideModal : function(_$m, flag) {
            /*********************************************************************************
             * 페이지 : 공통
             * 모달 숨기기
             *********************************************************************************/
            if(!flag) {
                _$m.hide();
                this.hideBgModal();
                jQuery('html').removeClass('overflowHidden');
                jQuery('body').css('height','auto');
                jQuery('.header').css('position', 'fixed');
            } else if (flag == 'change-location') {
                _$m.hide();
            }
        },
        showBgModal:function() {
            //jQuery('body').css('height',jQuery(window).height());
            /*********************************************************************************
             * 페이지 : 공통
             * 모달 활성화 시 비활성화 백그라운드 및 z-index 조정
             * iOS일 시 컨텐츠 스크롤 영역 비활성화
             *********************************************************************************/

                //jQuery('.sidebar').css('z-index',5);
            jQuery('.header').css('z-index',5);
            jQuery('.shadow').css('z-index',4);

            setTimeout(function() {
                jQuery('.shadow').show();
            },50);

            if(jQuery('.modal.modal-icon-explain').css('display')!='block' && jQuery('.modal.modal-state-explain').css('display')!='block') {
                if (device.checkDeviceType() == 'ios') {
                    if (parseInt(jQuery(window).height()) < parseInt(jQuery('.sidebar .sidebar-inner').outerHeight())) {
                        $(document).on('touchmove', function (e) {
                            if (jQuery(e.target).parents('.sidebar').size() < 1) {
                                e.preventDefault();
                            }
                        });
                    } else {
                        $(document).on('touchmove', function (e) {
                            if (jQuery(e.target).parents('.modal.modal-location').size() < 1) {
                                e.preventDefault();
                            }
                        });
                    }
                }
            }
        },
        hideBgModal:function() {
            /*********************************************************************************
             * 페이지 : 공통
             * 모달 활성화 시 백그라운드 숨기기
             * 키보드 숨기기
             *********************************************************************************/
            jQuery('.sidebar').css('z-index',4);

            if(jQuery('.modal').css('display')!='none') {
                jQuery('.header').css('z-index', 4);
            }

            if(jQuery('.header-category .drag_bar').size()>0&&jQuery('.sidebar').css('display')=='block') {
                jQuery('.header').css('z-index', 0);
            }

            jQuery('.shadow').css('z-index',2);
            jQuery('.modal').hide();
            jQuery('.shadow').hide();
            $(document).off('touchmove');

            //this.checkAndroidModal(false);

            jQuery('input').blur();
        },
        shadowClick:function() {
            /*********************************************************************************
             * 페이지 : 공통
             * 백그라운드 선택시 모달 숨기기
             *********************************************************************************/

            var _this=this,
                _shadow='.shadow';

            jQuery(_shadow).on('tap',function(e) {
                jQuery('html').removeClass('overflowHidden');
                _this.closeLayer();
            });

        },
        keyboardUp : function(_$c) {
            /*********************************************************************************
             * 페이지 : 공통
             * 키보드 보이기
             *********************************************************************************/
            _$c.find('input').first().focus();
            //_$c.find('textarea').first().focus();

            if(jQuery('.modal').css('display')=='block') jQuery('.header').css('position','absolute');

        },
        keyboardDown : function(_c) {
            /*********************************************************************************
             * 페이지 : 공통
             * 키보드 숨기기
             *********************************************************************************/
            jQuery(_c).find('input').focusout();
            jQuery('.header').css('position','fixed');

        },
        preLoad:function(t) {
            var _img = document.createElement('img');
            $(_img).bind('load', function() {
                if(_preLoads[0]) {
                    this.src = _preLoads.shift();
                }
                //insert image
                //jQuery(t).append(_img);
            }).trigger('load');
        },
        scriptLoadNext:function(scripts,template,callback) {
            // Sometimes Chrome was loading the scripts in the wrong order (lolwat)
            // We need to enforce order, so manually chain the loading.
            var nextScript=null,
                script=null;

            if (scripts.length === 0) {
                return;
            }

            if(template==true) {
                jQuery('script[data-template=template]').remove();

                Lazy(scripts).each(function(d,k) {
                    nextScript = d;
                    script = document.createElement('script');
                    script.src = nextScript;
                    script.setAttribute('data-template','template');

                    document.body.appendChild(script);

                    if (typeof callback === 'function') {
                        jQuery(script).load(function () {
                            callback.call(this);
                        })
                    }
                });
            } else {
                Lazy(scripts).each(function(d,k) {
                    nextScript = d;
                    script = document.createElement('script');
                    script.src = nextScript;

                    document.body.appendChild(script);
                });

                if (typeof callback === 'function') {
                    jQuery(script).load(function () {
                        callback.call(this);
                    })
                }
            }

        },
        stopLoading : function() {
            /*********************************************************************************
             * 페이지 : 공통
             * 로딩 숨기기
             *********************************************************************************/
            setTimeout(function() {
                jQuery('.loader').remove();
                jQuery('body').css('pointer-events','auto');
            },100);

        },
        btnBack:function() {
            window.history.back();
        },
        listScrollLoading : function(_c,callback,count) {
            /*********************************************************************************
             * 페이지 : 공통
             * 리스트 스크롤 끝을 확인하여 callback 호출 및 이미지 경로 추가/삭제
             * callback()
             *********************************************************************************/

            var _timer=null,
                _$this=jQuery(_c),
                _allPagingCount=20,
                _pagingCount=10;

            if(count) {
                _$this=jQuery(_c).eq(count);
            }

            _$this.scroll(function(e) {
                e.stopPropagation();
                var _b=(_c===window) ? document.body.scrollHeight : jQuery(this).prop('scrollHeight'),
                    scrollHeight = _b,
                    scrollPosition = (jQuery(this).scrollTop() + jQuery(this).height());

                //scrollTop이 0보다 크면 실행
                if(jQuery(this).scrollTop()>0) {
                    // 스크롤 끝을 만나면 실행
                    if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
                        if (twCommonUi.scrollLoading == true) {

                            twCommonUi.scrollLoading = false;
                            if (typeof callback == 'function') {
                                callback.call(this, jQuery(this));
                            }

                        }
                    }
                }
            });
        },
        tab : function(_$target,_this,callback) {
            if(jQuery(_$target).filter('.active').closest('li').index()!=jQuery(_this).closest('li').index()) {
                jQuery(_$target).removeClass('active');
                jQuery(_this).addClass('active');

                if (typeof callback == 'function') {
                    callback.call(this, jQuery(_this).text(), jQuery(_this));
                }
            }

        },
        getConnectStatus : function(status) {
            /*********************************************************************************
             * 페이지 : 공통(헤더)
             * 비콘 상태에 따라 연결 상태 UI
             *********************************************************************************/

            var _status='';

            switch(status) {
                case 1:
                    _status='checkin';
                    break;
                case 3:
                    _status='find-beacon';
                    break;
                case 2:
                    _status='checkout';
                    break;
            }

            return _status;

        },

        initialGoogleMap : function(currentOption,shopOption,markerOptions, target,flag) {
            /*********************************************************************************
             * 페이지 : 메인/매장상세(매장정보)
             * 구글 지도 초기화
             * 버튼,마커
             * param : 현재위치 위도/경도, 샵 위도/경도, 마커리스트, 이벤트
             *********************************************************************************/
            //google map사용할 시 에만 동작
            /* gmap */
            var _this=this;
            if(jQuery(target).size()>0){

                var _targetUserLocation=(shopOption) ? shopOption : currentOption;

                var _obj={};

                _obj={
                    lat:function() {
                        return _targetUserLocation.lat;
                    },
                    lng:function() {
                        return _targetUserLocation.lng;
                    }

                };

                _this.mMap = new GMaps({
                    div: target,
                    lat: _obj.lat(),
                    lng: _obj.lng(),
                    panControl: false,
                    zoomControl: false,
                    zoomControlOptions:{
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    zoom:16,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    overviewMapControl: false,
                    click:function(e) {
                        //console.log('all click');
                        //show all list
                    },
                    bounds_changed:function(e) {
                        //twCommonUi.setPageTitle(timewalletCommonUi.getAddress(e.center));
                        twCommonUi.dragCurLoc=e.center;
                    },
                    tilesloaded:function(e) {
                        //twCommonUi.setPageTitle(timewalletCommonUi.getAddress(e.center));
                        twCommonUi.dragCurLoc=e.center;
                    },
                    center_changed:function(e) {
                        twCommonUi.dragCurLoc=e.center;
                        //twCommonUi.setPageTitle(timewalletCommonUi.getAddress(e.center));
                    },
                    dragstart:function(e) {
                        _dragging=true;
                        twCommonUi.mapRefresh=true
                    },
                    dragend:function(e) {
                        //twCommonUi.dragCurLoc = e.center;
                        _dragging = false;

                    },
                    zoom_changed:function(e) {
                        _dragging=true;
                    },
                    idle:function(e) {
                        if(flag!='static') {
                            if(twCommonUi.mapRefresh==true) {
                                if (!_dragging) {


                                    var _data = {};

                                    _data = {
                                        'u_idx': (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                                        'latitude': e.center.lat(),
                                        'longitude': e.center.lng(),
                                        'search_latitude': e.center.lat(),
                                        'search_longitude': e.center.lng(),
                                        'shop_category': '',
                                        'searchText': '',
                                        'sort': 1,
                                        'page': 1,
                                        'shop_type': 'all'
                                    };

                                    twCommonUi.getApiData(
                                        {
                                            url: loc[8].api[0],
                                            type: loc[8].type,
                                            method: 'post',
                                            data: _data
                                        },
                                        'html',
                                        React.addons,
                                        function (listType, resp, reactAddons) {
                                            var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                                            _data.list = _newList.list[0].ResultData;
                                            _data.totalPage = _newList.list[0].totalpage;

                                            React.render(React.createElement(ShopState, {
                                                type: 'type2',
                                                data: _newList.list[0].ResultData[0]
                                            }), document.getElementsByClassName('beaconState')[0]);

                                            twCommonUi.initMarker(_data.list);

                                            if(twCommonUi.mapCheckStatus.enable == true) { //체크인 시
                                                var _checkInData = {
                                                    shop_latitude:twCommonUi.mapCheckStatus.data.shop_latitude,
                                                    shop_longitude:twCommonUi.mapCheckStatus.data.shop_longitude,
                                                    shop_name:twCommonUi.mapCheckStatus.data.shop_name
                                                };
                                                twCommonUi.checkInMarker(_checkInData);

                                            } else {
                                                var _checkOutData = {
                                                    shop_latitude:twCommonUi.mapCheckStatus.data.shop_latitude,
                                                    shop_longitude:twCommonUi.mapCheckStatus.data.shop_longitude,
                                                    shop_name:twCommonUi.mapCheckStatus.data.shop_name
                                                };
                                                twCommonUi.checkOutMarker(_checkOutData);

                                            }
                                        }
                                    );
                                    _webBridge.dragGe = {lat: e.center.lat(), lng: e.center.lng()};

                                    _dragging = true;
                                } else {
                                    _dragging = false;
                                }
                            }
                        }
                        //
                    }


                });

                //지도 custom 버튼 초기화

                twCommonUi.addMapControl(this.mMap,
                    [
                        {
                            position:'right_top',
                            content:'',
                            style:{
                                width:'40px',
                                height:'40px',
                                margin:'20px 10px 0 8px',
                                padding:'16px',
                                background:'url("/front-src/release/images/disable_zoom_in.png") no-repeat 100% 100%',
                                backgroundSize:'40px 40px',
                                boxShadow:'none',
                                border:0
                            },
                            events:{
                                mouseup:function(e) {
                                    jQuery(e).css({
                                        'background':'url("/front-src/release/images/enable_zoom_in.png") no-repeat 100% 100%',
                                        'background-size':'40px'
                                    });
                                    setTimeout(function(){
                                        jQuery(e).css({
                                            'background':'url("/front-src/release/images/disable_zoom_in.png") no-repeat 100% 100%',
                                            'background-size':'40px'
                                        });
                                    },100);

                                    _this.mMap.setZoom(_this.mMap.getZoom()+1)
                                }
                            }
                        },
                        {
                            position:'right_top',
                            content:'',
                            style:{
                                width:'40px',
                                height:'40px',
                                margin:'10px 10px 0 8px',
                                padding:'16px',
                                background:'url("/front-src/release/images/disable_zoom_out.png") no-repeat 100% 100%',
                                backgroundSize:'40px 40px',
                                boxShadow:'none',
                                border:0

                            },
                            events:{
                                mouseup:function(e) {
                                    jQuery(e).css({
                                        'background':'url("/front-src/release/images/enable_zoom_out.png") no-repeat 100% 100%',
                                        'background-size':'40px'
                                    });
                                    setTimeout(function(){
                                        jQuery(e).css({
                                            'background':'url("/front-src/release/images/disable_zoom_out.png") no-repeat 100% 100%',
                                            'background-size':'40px'
                                        });
                                    },100);

                                    _this.mMap.setZoom(_this.mMap.getZoom()-1)
                                }
                            }
                        }
                    ]
                );


                //지도 현재 위치
                //if(flag!='static') twCommonUi.myLocation(_obj);

                this.mMap.removeMarkers();

            }
        },
        checkInMarker : function(post) {
            console.log('체크인 post값', post);

            console.log('checkInMarker 호출');
            var _icon=_domain+'/front-src/release/images/check_pin.png';

            var _shop = {
                lat: post.shop_latitude,
                lng: post.shop_longitude,
                title: post.shop_name,
                icon: _icon,
                infoWindow: {
                    content: '<p>' + post.shop_name + '</p>'
                },
                click: function (e) {
                    //post.shop_idx
                    var currentUrl = location.hash;
                    if (currentUrl.match('#/shop-map')) {

                        //마커 클릭시 스테이트 리스트 변경
                        if (jQuery('.item-list').size() > 0) {
                            var _data = {};

                            _data = {
                                'u_idx': (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                                'latitude': e.position.lat(),
                                'longitude': e.position.lng(),
                                'search_latitude': e.position.lat(),
                                'search_longitude': e.position.lng(),
                                'shop_category': '',
                                'searchText': '',
                                'sort': 1,
                                'page': 1,
                                'shop_type': 'all'
                            };

                            twCommonUi.getApiData(
                                {
                                    url: loc[8].api[0],
                                    type: loc[8].type,
                                    method: 'post',
                                    data: _data
                                },
                                'html',
                                React.addons,
                                function (listType, resp, reactAddons) {
                                    var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                                    _data.list = _newList.list[0].ResultData;
                                    _data.totalPage = _newList.list[0].totalpage;

                                    React.render(React.createElement(ShopState, {
                                        type: 'type2',
                                        data: _newList.list[0].ResultData[0]
                                    }), document.getElementsByClassName('beaconState')[0]);

                                }
                            );
                        }
                    }
                }
            };
            console.log('checkInMarker_shop',_shop);
            if(this.mMap) {
                this.mMap.addMarker(_shop);
            }
        },
        checkOutMarker : function(post) {
            console.log('체크아웃 post값', post);

            console.log('checkOutMarker 호출');
            var _icon=_domain+'/front-src/release/images/enable_category_pin.png';

            var _shop = {
                lat: post.shop_latitude,
                lng: post.shop_longitude,
                title: post.shop_name,
                icon: _icon,
                infoWindow: {
                    content: '<p>' + post.shop_name + '</p>'
                },
                click: function (e) {
                    //post.shop_idx
                    var currentUrl = location.hash;
                    if (currentUrl.match('#/shop-map')) {

                        //마커 클릭시 스테이트 리스트 변경
                        if (jQuery('.item-list').size() > 0) {
                            var _data = {};

                            _data = {
                                'u_idx': (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                                'latitude': e.position.lat(),
                                'longitude': e.position.lng(),
                                'search_latitude': e.position.lat(),
                                'search_longitude': e.position.lng(),
                                'shop_category': '',
                                'searchText': '',
                                'sort': 1,
                                'page': 1,
                                'shop_type': 'all'
                            };

                            twCommonUi.getApiData(
                                {
                                    url: loc[8].api[0],
                                    type: loc[8].type,
                                    method: 'post',
                                    data: _data
                                },
                                'html',
                                React.addons,
                                function (listType, resp, reactAddons) {
                                    var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                                    _data.list = _newList.list[0].ResultData;
                                    _data.totalPage = _newList.list[0].totalpage;

                                    React.render(React.createElement(ShopState, {
                                        type: 'type2',
                                        data: _newList.list[0].ResultData[0]
                                    }), document.getElementsByClassName('beaconState')[0]);

                                }
                            );
                        }
                    }
                }
            };

            if(this.mMap) {
                this.mMap.addMarker(_shop);
            }
        },
        initMarker : function(mapData,flag) {
            var _this=this,
                _mapData=[],
                _$category = jQuery('.category li a.active'),
                _icon=null,
                _select_pin=_domain+'/front-src/release/images/enable_category_pin.png',
                _deselect_pin=_domain+'/front-src/release/images/disable_category_pin.png',
                _my_pin=_domain+'/front-src/release/images/my_pin.png';

            Lazy(mapData).each(function(post) {
                //선택한 카테고리랑 맞는 아이콘
                if(_$category.size()>0) {
                    if(_$category.text()!='모두') {
                        if (post.shop_category == _$category.text()) {
                            _icon = _select_pin;
                        } else {
                            //선택하지 않은 카테고리 아이콘
                            _icon = _deselect_pin;
                        }
                    } else {
                        _icon = _select_pin;
                    }
                } else {
                    _icon = _select_pin;
                }

                var _shop = {
                    lat: post.shop_latitude,
                    lng: post.shop_longitude,
                    title: post.shop_name,
                    infoWindow: {
                        content: '<p>' + post.shop_name+'</p>'
                    },
                    icon:_icon,
                    click:function(e) {
                        //post.shop_idx
                        var currentUrl = location.hash;
                        if(currentUrl.match('#/shop-map')) {

                            //마커 클릭시 스테이트 리스트 변경
                            if(jQuery('.item-list').size()>0) {
                                var _data={};

                                _data= {
                                    'u_idx': (jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
                                    'latitude': e.position.lat(),
                                    'longitude': e.position.lng(),
                                    'search_latitude': e.position.lat(),
                                    'search_longitude': e.position.lng(),
                                    'shop_category': '',
                                    'searchText': '',
                                    'sort': 1,
                                    'page': 1,
                                    'shop_type': 'all'
                                };

                                twCommonUi.getApiData(
                                    {
                                        url:loc[8].api[0],
                                        type:loc[8].type,
                                        method:'post',
                                        data:_data
                                    },
                                    'html',
                                    React.addons,
                                    function(listType,resp,reactAddons) {
                                        var _newList = twCommonUi.getApiList(_this, listType, resp, reactAddons);
                                        _data.list= _newList.list[0].ResultData;
                                        _data.totalPage=_newList.list[0].totalpage;

                                        React.render(React.createElement(ShopState, {type:'type2',data:_newList.list[0].ResultData[0]}), document.getElementsByClassName('beaconState')[0]);

                                    }
                                );
                            }
                        }
                    }
                };

                _mapData.push(_shop);
            });


            twCommonUi.setGoogleMarker(_mapData,
                {
                    lat: _webBridge.curGe.lat==0?'37.493036':_webBridge.curGe.lat,
                    lng: _webBridge.curGe.lng==0?'127.029645':_webBridge.curGe.lng
                },flag);
        },
        setGoogleMarker : function(_data,currentOption,flag) {
            /*********************************************************************************
             * 페이지 : 메인/매장상세(매장정보)
             * 전체 마커를 삭제하고 위도, 경도 데이터를 가져와 마커를 그린다.
             *********************************************************************************/
            var _this=this,
                _obj=null,
                _curLoc={lat:'',lng:''};
            //set initial marker
            if(twCommonUi.mMap) {
                twCommonUi.mMap.removeMarkers();
            }

            if(twCommonUi.dragCurLoc.lat) {
                _curLoc={lat:twCommonUi.dragCurLoc.lat(),lng:twCommonUi.dragCurLoc.lng()};
            } else {
                /* GPS위치에 따라서 내 마커를 찍음 */
                BRIDGE.getUserLocation(function (loc) {

                    _obj={
                        lat:function() {
                            return loc.LATI;
                        },
                        lng:function() {
                            return loc.LONGI;
                        }

                    };

                    _curLoc={lat:_obj.lat(),lng:_obj.lng()};
                });
            }

            if(flag!='static') {
                BRIDGE.getUserLocation(function (loc) {
                    console.log(loc);
                    if(twCommonUi.mMap) {
                        _this.mMap.addMarker({
                            lat: loc.LATI,
                            lng: loc.LONGI,
                            icon: _domain + '/front-src/release/images/my_pin.png',
                            title: "내 위치",
                            infoWindow: {
                                content: '<p>내 위치</p>'
                            }
                        });
                    }
                });
            }

            if(_this.mMap) {
                Lazy(_data).each(function(i,k) {
                    if(i.lat && i.lng) _this.mMap.addMarker(i);
                });
            }

        },
        getAddressTxt : function(txt) {
            twCommonUi.setPageTitle(txt);
        },
        getAddress : function(_cur,_all) {
            /*********************************************************************************
             * 페이지 : 공통
             * 위도,경도 값에 따라 주소를 가지고 옴
             *********************************************************************************/
            var geocoder = new google.maps.Geocoder(),
                latlng={lat:parseFloat(_cur.lat()),lng:parseFloat(_cur.lng())},
                _findIdx=0;

            geocoder.geocode({'location':latlng},function(r,s) {
                if (s == google.maps.GeocoderStatus.OK) {
                    if (r[1]) {
                        twCommonUi.setPageTitle(r[0].address_components[1].short_name);
                    }
                }
            });

        },
        getLatLng : function(addr) {
            /*********************************************************************************
             * 페이지 : 공통
             * 위도,경도 값에 따라 주소를 가지고 옴
             *********************************************************************************/
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({'address':addr},function(r,s) {
                if (s == google.maps.GeocoderStatus.OK) {
                }
            });

        },
        addMapControl : function(_map,options) {
            /*********************************************************************************
             * 페이지 : 메인/매장상세(매장정보)
             * 현재위치, 확대, 축소 버튼
             *********************************************************************************/

            for(var i = 0;i < options.length;i++) {
                this.mMap.addControl(options[i]);
            };

        },
        myLocation : function(_l,bFlag) {
            /*********************************************************************************
             * 페이지 : 메인/매장상세(매장정보)
             * 위도, 경도에 따른 지도 위치 이동
             *********************************************************************************/
            if(bFlag) this.mMap.setCenter(_l.lat(), _l.lng());

            //twCommonUi.getAddress(_l);

            var _data = {};

            BRIDGE.getUserInfo(function (userInfo) {
                _data = {
                    'u_idx': userInfo.INDEX,
                    'latitude': _l.lat(),
                    'longitude': _l.lng(),
                    'search_latitude': _l.lat(),
                    'search_longitude': _l.lng(),
                    'shop_category': '',
                    'searchText': '',
                    'sort': 1,
                    'page': 1,
                    'shop_type': 'all'
                }
            });

            _webBridge.dragGe = {lat: _l.lat(), lng: _l.lng()}

            twCommonUi.getApiData(
                {
                    url: loc[8].api[0],
                    type: loc[8].type,
                    method: 'post',
                    data: _data
                },
                'html',
                React.addons,
                function (listType, resp, reactAddons) {
                    var _newList = twCommonUi.getApiList(this, listType, resp, reactAddons);
                    _data.list = _newList.list[0].ResultData;
                    _data.totalPage = _newList.list[0].totalpage;

                    React.render(React.createElement(ShopState, {type:'type2',data:_newList.list[0].ResultData[0]}), document.getElementsByClassName('beaconState')[0]);

                    if(bFlag) twCommonUi.initMarker(_newList.list[0].ResultData, '');

                }
            );
        },
        setPageTitle : function(_title) {
            /*********************************************************************************
             * 페이지 : 공통(헤더)
             * 상단 타이틀 영역 설정
             *********************************************************************************/

            var _$container=jQuery('.container'),
                _$ht=jQuery('.header .title a'),
                _location=window.location.pathname.split('/'),
                _this=this;
            _$ht.text(_title);
        },
        commonAccordion:function(target,callback, flag) {
            var _this=this,
                _t=target;

            jQuery(target+' a').on('tap',function(e) {

                var _$t=jQuery(this);
                console.log(_$t.attr('class'));

                //시 선택
                if(_$t.parents('li').find('.sub li').size()>0) {
                    if (!_$t.attr('class').match('state')) {
                        if (_$t.closest('li').attr('class').match('active')) {
                            _$t.closest('li').removeClass('active')
                                .find('ul').height(0);
                        } else {
                            if(_$t.text()!='세종특별자치시') {
                                jQuery(target).find('.active')
                                    .find('ul').height(0)
                                    .end()
                                    .removeClass('active');

                                var numli = _$t.closest('li').find('li').size();
                                if (numli % 2 == 0) {
                                    numli = numli / 2;
                                } else {
                                    numli = Math.floor(numli / 2) + 1;
                                }

                                _$t.closest('li').find('ul')
                                    .height((_$t.closest('li').find('li').outerHeight()) * numli);

                                _$t.closest('li').addClass('active');
                            } else {
                                console.log('세종');
                                //구 선택
                                if(jQuery('.member-contents .region input').size()>0) {
                                    jQuery('.member-contents .region input').val(_$t.closest('.siList').find('.city').text());
                                    twCommonUi.closeRegionAccordion(flag);
                                }

                                if(jQuery('.header-shop .title .my-location').size()>0) {
                                    jQuery('.header-shop .title .my-location').text(_$t.closest('.siList').find('.city').text());
                                    twCommonUi.closeRegionAccordion(flag);
                                }

                                if(jQuery('.header-shopmap .title .my-location').size()>0) {
                                    jQuery('.header-shopmap .title .my-location').text(_$t.closest('.siList').find('.city').text());
                                    twCommonUi.closeRegionAccordion(flag);
                                }

                                if(jQuery('.place .btn-location').size()>0) {
                                    jQuery('.place .btn-location').text(_$t.closest('.siList').find('.city').text());
                                    twCommonUi.closeRegionAccordion();
                                }

                                if (typeof callback == 'function') {
                                    callback.call(this, jQuery('.header-shopmap .title .my-location').text());
                                }
                            }

                            /*
                             _$t.closest('li').find('ul')
                             .end()
                             .addClass('active');
                             */

                        }
                    } else {
                        //구 선택
                        if(jQuery('.member-contents .region input').size()>0) {
                            jQuery('.member-contents .region input').val(_$t.closest('.siList').find('.city').text() + ' ' + _$t.text());
                            twCommonUi.closeRegionAccordion(flag);
                        }

                        if(jQuery('.header-shop .title .my-location').size()>0) {
                            jQuery('.header-shop .title .my-location').text(_$t.closest('.siList').find('.city').text() + ' ' + _$t.text());
                            twCommonUi.closeRegionAccordion(flag);
                        }

                        if(jQuery('.header-shopmap .title .my-location').size()>0) {
                            jQuery('.header-shopmap .title .my-location').text(_$t.closest('.siList').find('.city').text() + ' ' + _$t.text());
                            twCommonUi.closeRegionAccordion(flag);
                        }

                        if(jQuery('.place .btn-location').size()>0) {
                            jQuery('.place .btn-location').text(_$t.closest('.siList').find('.city').text() + ' ' + _$t.text());
                            twCommonUi.closeRegionAccordion();
                        }

                        if (typeof callback == 'function') {
                            callback.call(this, jQuery('.header-shopmap .title .my-location').text());
                        }
                    }
                } else {
                    //구 선택
                    if(jQuery('.member-contents .region input').size()>0) {
                        jQuery('.member-contents .region input').val(_$t.closest('.siList').find('.city').text());
                        twCommonUi.closeRegionAccordion();
                    }

                    if(jQuery('.header-shop .title .my-location').size()>0) {
                        jQuery('.header-shop .title .my-location').text(_$t.closest('.siList').find('.city').text());
                        twCommonUi.closeRegionAccordion();
                    }

                    if(jQuery('.header-shopmap .title .my-location').size()>0) {
                        jQuery('.header-shopmap .title .my-location').text(_$t.closest('.siList').find('.city').text());
                        twCommonUi.closeRegionAccordion();
                    }

                    if(jQuery('.place .btn-location').size()>0) {
                        jQuery('.place .btn-location').text(_$t.closest('.siList').find('.city').text());
                        twCommonUi.closeRegionAccordion();
                    }

                    if (typeof callback == 'function') {
                        callback.call(this, jQuery('.header-shopmap .title .my-location').text());
                    }
                }
                e.stopPropagation();
                e.preventDefault();


            });
        },
        checkEnableJoinButton : function(params,_$enableButton,flag) {
            var _bSaveMember=twMember.checkMemberField(params,flag);
            console.log(_bSaveMember.status);
            twMember.checkMemberFieldFocus(_bSaveMember.status,_$enableButton,flag);
            return _bSaveMember;
        },
        closeRegionAccordion:function(flag) {
            jQuery('.list-location .siList').removeClass('active')
                .find('ul').height(0);
            twCommonUi.hideModal(jQuery('.modal.modal-location'), flag);
        },
        /*****************************************************
         * set count = use sms certification
         * @param _c = target class name
         * @param _m = time
         * @param callback = callback
         */
        setValidTime : function(_c,_m,callback) {//'.valid .time'(target), 5(minute)
            /*********************************************************************************
             * 페이지 : 공통
             * 인증 번호 유효시간 스크립트 설정
             *********************************************************************************/
            // countdown timer
            var _this=this,
                _minutes=60,
                _$t=jQuery(_c);

            _$t.backward_timer({
                seconds:_m*_minutes,
                format:'m%:s%',
                on_exhausted:function(timer) {
                    callback.call();
                }
            }).backward_timer('start');

        },
        /*****************************************************
         * reset count = use sms certification
         * @param _t = target class name
         */
        resetValidTime : function(_t) {
            /*********************************************************************************
             * 페이지 : 공통
             * 인증 번호 유효시간 재 시작
             *********************************************************************************/
            jQuery(_t).backward_timer('restart');
        },
        /*****************************************************
         * stop count = use sms certification
         * @param _t = target class name
         */
        stopValidTime : function(_t) {
            /*********************************************************************************
             * 페이지 : 공통
             * 인증 번호 유효시간 취소
             *********************************************************************************/
            jQuery(_t).backward_timer('cancel');
        },
        setContentsHeight:function() {
            var _pt=0;
            /*if(jQuery('.member .member-reg').size()>0) {
                _pt=parseInt(jQuery('.member .member-reg').css('padding-top'))+1;
            }*/
            jQuery('.contents').css('height',jQuery(window).height()-jQuery('.header').height()-_pt);
        },
        /******************************
         * 리뷰 별평점
         * //20151027 park add -start
         ******************************/
        reviewScore : function(_c,callback) {
            //jQuery(this.$dcBody).on('tap',_c,function(e) {
            jQuery(_c).on('click', function(e) {
                e.stopImmediatePropagation();

                var _score=parseInt(Math.ceil(e.offsetX)),
                    _level=0;

                if(_score<30) {
                    jQuery(this).find('.rate').css('width','21%');
                    _level=1;
                } else if(_score<59) {
                    jQuery(this).find('.rate').css('width','41%');
                    _level=2;
                } else if(_score<88) {
                    jQuery(this).find('.rate').css('width','61%');
                    _level=3;
                } else if(_score<117) {
                    jQuery(this).find('.rate').css('width','81%');
                    _level=4;
                } else {
                    jQuery(this).find('.rate').css('width','100%');
                    _level=5;
                }
                if(typeof callback==='function') {
                    callback.call(this,_level);
                }
            });
        },
        setFile : function(fileCls,quality,callback) {
            /* 이미지 클라이언트 추가 */
            jQuery(fileCls).change(function (evt) {
                jQuery('.source-img').remove();
                var full_path= evt.target.value,
                    file = evt.target.files[0],
                    id = jQuery('.source-img').size(),
                    reader = new FileReader();

                if (file.type != 'image/jpeg' && file.type != 'image/png') {
                    alert('이미지 파일만 업로드 가능합니다.');
                    return false;
                } else {

                }

                reader.onload = function (e) {
                    var i = document.createElement('img');
                    i.src = e.target.result;
                    i.setAttribute('class', 'source-img');
                    i.id = 'img' + id;
                    i.onload = function () {
                        image_width = jQuery(i).width(),
                            image_height = jQuery(i).height();
                    }

                    jQuery('.result-img').attr('src','').hide();
                    jQuery(evt.currentTarget).closest('.pic').addClass('active').find('.upload-pic').append(i);
                    //timewalletCommonUi.fileCompress(quality,i);

                }

                reader.onerror = function (event) {
                    alert("파일을 읽어들이지 못했습니다. code " + event.target.error.code);
                }
                reader.readAsDataURL(file);

                // This code is only for demo ...
                console.group("File " + 1);
                console.log("name : " + file.name);
                console.log("size : " + file.size);
                console.log("type : " + file.type);
                console.log("date : " + file.lastModified);
                console.groupEnd();

                callback(file,full_path);

                jQuery(fileCls).off('change');
            });
            /*///// 이미지 클라이언트 추가 */
            if(jQuery('.result-img').size()>0) {
                if(jQuery('.result-img').attr('src').length>1) {
                    jQuery(fileCls).trigger('change');
                }
            }


        },
        //20151027 park add -end

        // 1,000,000 천단위 콤마 세팅.
        setComma : function(num) {
            console.log(num.toString());
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
})();

/* member */
var twMember = twMember || {};
twMember = (function() {
    return {
        /* set function */
        setSelectYear: function (nowYear, $selectYear) {
            /***************
             * 년 세팅
             ***************/
            var _max = 90,
                _lastYear = nowYear - _max;

            for (var i = nowYear; i >= _lastYear; i--) {
                //_startYear = _startYear + 1;
                $selectYear.append("<option value=" + i + ">" + i + "</option>")
            }
            $selectYear.prepend("<option value=''></option>").attr('selected', 'selected');
        },
        setSelectMonth: function (month, $selectMonth) {
            var j=0;

            for (var i = 1; i < 13; i++) {
                if(i.toString().length<2) j='0'+i;
                else j=i;
                $selectMonth.append("<option value=" + j + ">" + j + "</option>")
            }
            $selectMonth.prepend("<option value=''></option>").attr('selected', 'selected');
        },
        setSelectDay: function (year, month, day, $selectDay) {
            var arrayMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                j=0;

            /*******************************************
             * 윤달 체크 부분
             * 윤달이면 2월 마지막 일자를 29일로 변경
             *******************************************/
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                arrayMonth[1] = 29;
            }

            $selectDay.empty();

            for (var i = 1; i <= arrayMonth[month - 1]; i++) {
                if(i.toString().length<2) j='0'+i;
                else j=i;
                $selectDay.append("<option value=" + j + ">" + j + "</option>")
            }

            $selectDay.prepend("<option value=''></option>").attr('selected', 'selected');

        },
        /* get function */
        /****************************
         *
         * @returns {{nowDate: Date, nowYear: number, nowMonth: number, nowDay: Object}}
         * @ return nowDate : current Date
         * @ return nowYear : current Year
         * @ return nowMonth : current Month
         * @ return nowYear : current day
         *
         */
        getCurrentDate: function () {
            var nowDate = new Date(),
                nowYear = nowDate.getFullYear(),
                nowMonth = eval(nowDate.getMonth()) + 1,
                nowDay = eval(nowDate.getDate());

            return {
                'nowDate': nowDate,
                'nowYear': nowYear,
                'nowMonth': nowMonth,
                'nowDay': nowDay
            }
        },
        /****************************
         *
         * @returns string
         * @ return
         * '000' : valid password
         * '001' : invalid password(length)
         * '002' : invalid password(mix number, string)
         *
         */

        getValidPassword : function(password) {
            if(password) {
                if(password.length>0) {
                    var bPass = /^[a-zA-Z0-9]{8,15}$/.test(password);
                    if (!bPass) {
                        return '001';
                        //비밀번호 입력은 8~15자리로 입력하셔야 합니다.
                    } else {
                        var chk_num = password.search(/[0-9]/g);
                        var chk_eng = password.search(/[a-z]/ig);
                        if (chk_num < 0 || chk_eng < 0) {
                            return '002';
                            //비밀번호는 숫자와 영문자를 혼용하셔야 합니다.
                        } else {
                            return '000';
                        }
                    }
                } else {
                    return '001';
                }
            }
        },
        /****************************
         *
         * @returns boolean
         * @ return true, false
         *
         */
        getSamePassword : function(password,rePassword) {
            if(password&&rePassword) {
                if(password==rePassword) return true;
                else return false;
            }
        },
        /****************************
         *
         * @returns boolean
         * @ return true, false
         *
         */
        getValidEmail : function(email) {
            var reg=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

            if(reg.test(email)) return true;
            else return false;
        },
        /****************************
         *
         * @returns boolean
         * @ return true, false
         *
         */
        getValidPhone : function(phone) {
            var reg=/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/; //한국
            return reg.test(phone);
        },
        checkMemberField : function(validData,flag) {
            /*********************************
             *
             * @param : {phone, rePhone, auth_num, password, loginPassword, rePassword,sex,year,month,day,area}
             *
             *********************************/
            if(!flag) {
                if(!twMember.getValidPhone(validData.phone)) {
                    return {
                        bResult:false,
                        status:'phone'
                    };
                }

                if(twMember.getValidPassword(validData.password)!='000') {
                    return {
                        bResult:false,
                        status:'password'
                    };
                }

                if(twMember.getValidPassword(validData.rePassword)!='000') {
                    return {
                        bResult:false,
                        status:'rePassword'
                    };
                }

                if(!twMember.getSamePassword(validData.password,validData.rePassword)) {
                    return {
                        bResult:false,
                        status:'nSamePassword'
                    };
                }

                if(!validData.sex) {
                    return {
                        bResult:false,
                        status:'sex'
                    };
                }

                if(!validData.year) {
                    return {
                        bResult:false,
                        status:'year'
                    };
                }

                if(!validData.month) {
                    return {
                        bResult:false,
                        status:'month'
                    };
                }

                if(!validData.day) {
                    return {
                        bResult:false,
                        status:'day'
                    };
                }

                if(!validData.area) {
                    return {
                        bResult:false,
                        status:'area'
                    };
                }

                if(validData.auth_num) {
                    if (validData.auth_num.length < 5) {
                        return {
                            bResult: false,
                            status: 'auth_num'
                        };
                    }
                }

                return {
                    bResult:true,
                    status:'success'
                };

            } else if(flag == 'login') {
                if(!twMember.getValidPhone(validData.phone)) {
                    return {
                        bResult:false,
                        status:'phone'
                    };
                }

                if(!twMember.getValidPhone(validData.rePhone)) {
                    return {
                        bResult:false,
                        status:'rePhone'
                    };
                }

                if(!twMember.getValidPassword(validData.loginPassword)) {
                    return {
                        bResult:false,
                        status:'loginPassword'
                    };
                }

                if(validData.auth_num) {
                    if (validData.auth_num.length < 5) {
                        return {
                            bResult: false,
                            status: 'auth_num'
                        };
                    }
                }

                return {
                    bResult:true,
                    status:'success'
                };

            } else if (flag == 'findPW') {
                if(!twMember.getValidPhone(validData.phone)) {
                    return {
                        bResult:false,
                        status:'phone'
                    };
                }

                if(!twMember.getValidEmail(validData.mail)) {
                    return {
                        bResult:false,
                        status:'mail'
                    };
                }

                if(validData.auth_num) {
                    if (validData.auth_num.length < 5) {
                        return {
                            bResult: false,
                            status: 'auth_num'
                        };
                    }
                }

                return {
                    bResult:true,
                    status:'success'
                };
            } else if (flag=='dropout') {
                if(!twMember.getValidPassword(validData.password)) {
                    return {
                        bResult:false,
                        status:'password'
                    };
                }

                return {
                    bResult:true,
                    status:'success'
                };
            } else if (flag == 'pw-change') {
                if(twMember.getValidPassword(validData.pwd)!='000') {
                    return {
                        bResult:false,
                        status:'password'
                    };
                }

                if(twMember.getValidPassword(validData.newPwd)!='000') {
                    return {
                        bResult:false,
                        status:'newPassword'
                    };
                }

                if(twMember.getValidPassword(validData.newPwd2)!='000') {
                    return {
                        bResult:false,
                        status:'newPassword2'
                    };
                }

                if(!twMember.getSamePassword(validData.newPwd,validData.newPwd2)) {
                    return {
                        bResult:false,
                        status:'nSamePassword'
                    };
                }

                if(twMember.getSamePassword(validData.pwd,validData.newPwd)) {
                    return {
                        bResult:false,
                        status:'oldSamePassword'
                    };
                }

                return {
                    bResult:true,
                    status:'success'
                };
            } else if (flag=='change-info') {
                if(!validData.sex) {
                    return {
                        bResult:false,
                        status:'sex'
                    };
                }

                if(!validData.year) {
                    return {
                        bResult:false,
                        status:'year'
                    };
                }

                if(!validData.month) {
                    return {
                        bResult:false,
                        status:'month'
                    };
                }

                if(!validData.day) {
                    return {
                        bResult:false,
                        status:'day'
                    };
                }

                if(!validData.area) {
                    return {
                        bResult:false,
                        status:'area'
                    };
                }

                return {
                    bResult:true,
                    status:'success'
                };
            }
        },
        checkMemberFieldFocus:function(status,$enableBtn,flag) {
            var _msg='';

            if(!flag) {
                switch(status) {
                    case 'phone':
                        jQuery('.phone').val('').focus();
                        _msg="휴대폰 번호를 확인해주세요.";
                        break;
                    case 'auth_num':
                        jQuery('.btn-modal-cert').focus();
                        _msg="인증번호를 확인해주세요.";
                        break;
                    case 'password':
                        jQuery('.password').val('').focus();
                        _msg="비밀번호를 확인해주세요.";
                        break;
                    case 'rePassword':
                        jQuery('.re-password').val('').focus();
                        _msg="재입력 비밀번호를 확인해주세요.";
                        break;
                    case 'nSamePassword':
                        jQuery('.password').val('').focus();
                        _msg="비밀번호와 재입력 비밀번호가 맞아야 합니다.";
                        break;
                    case 'sex':
                        jQuery('input[name=sex]').focus();
                        _msg="성별을 확인해주세요.";
                        break;
                    case 'year':
                        jQuery('#sel1').val('').focus();
                        _msg="년도를 선택해주세요.";
                        break;
                    case 'month':
                        jQuery('#sel2').val('').focus();
                        _msg="월을 선택해주세요.";
                        break;
                    case 'day':
                        jQuery('#sel3').val('').focus();
                        _msg="일 선택해주세요.";
                        break;
                    case 'area':
                        jQuery('.region input').val('').focus();
                        _msg="지역을 선택해주세요.";
                        break;
                    case 'success':
                        _msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            } else if(flag == 'login') {
                switch(status) {
                    case 'phone':
                        jQuery('.phone').val('').focus();
                        _msg="휴대폰 번호를 확인해주세요.";
                        break;
                    case 'rePhone':
                        jQuery('.re-phone').val('').focus();
                        _msg="기존 휴대폰 번호를 확인해주세요.";
                        break;
                    case 'auth_num':
                        jQuery('.btn-modal-cert').focus();
                        _msg="인증번호를 확인해주세요.";
                        break;
                    case 'loginPassword':
                        jQuery('.password').val('').focus();
                        _msg="비밀번호를 확인해주세요.";
                        break;
                    case 'success':
                        msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            } else if (flag == 'findPW') {
                switch(status) {
                    case 'phone' :
                        jQuery('.phone').val('').focus();
                        _msg="휴대폰 번호를 확인해주세요.";
                        break;
                    case 'mail' :
                        jQuery('.e-mail').val('').focus();
                        _msg="이메일 형식이 잘못되었습니다.";
                        break;
                    case 'auth_num':
                        jQuery('.btn-modal-cert').focus();
                        _msg="인증번호를 확인해주세요.";
                        break;
                    case 'success':
                        msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            } else if (flag == 'dropout') {
                switch(status) {
                    case 'password' :
                        jQuery('.password').val('').focus();
                        _msg="비밀번호 형식이 잘못되었습니다.";
                        break;
                    case 'success':
                        msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            } else if (flag == 'pw-change') {
                switch(status) {
                    case 'password' :
                        jQuery('.origin-pw').val('').focus();
                        _msg="비밀번호를 확인해주세요.";
                        break;
                    case 'newPassword' :
                        jQuery('.new-pw').val('').focus();
                        _msg="새로운 비밀번호를 확인해주세요.";
                        break;
                    case 'newPassword2' :
                        jQuery('.new-pw-check').val('').focus();
                        _msg="새로운 비밀번호를 확인해주세요.";
                        break;
                    case 'nSamePassword' :
                        jQuery('.new-pw').val('').focus();
                        _msg="새로 입력하신 비밀번호가 일치하지 않습니다.";
                        break;
                    case 'oldSamePassword' :
                        jQuery('.new-pw').val('').focus();
                        jQuery('.new-pw-check').val('');
                        _msg="새로 입력하신 비밀번호는 기존 비밀번호와 다르게 입력해주세요.";
                        break;
                    case 'success' :
                        msg="";
                        break;
                    default :
                        return false;
                        break;
                }
            } else if (flag=='change-info') {
                switch(status) {
                    case 'sex':
                        jQuery('input[name=sex]').focus();
                        _msg="성별을 확인해주세요.";
                        break;
                    case 'year':
                        jQuery('#sel1').val('').focus();
                        _msg="년도를 선택해주세요.";
                        break;
                    case 'month':
                        jQuery('#sel2').val('').focus();
                        _msg="월을 선택해주세요.";
                        break;
                    case 'day':
                        jQuery('#sel3').val('').focus();
                        _msg="일 선택해주세요.";
                        break;
                    case 'area':
                        jQuery('.region input').val('').focus();
                        _msg="지역을 선택해주세요.";
                        break;
                    case 'success':
                        _msg="";
                        break;
                    default:
                        return false;
                        break;
                }
            }

            jQuery('.member-contents .comment.notice, .error-log .comment.notice').remove();
            if (_msg!='' && flag=='dropout') {
                jQuery('.error-log').append('<p class="text-type4 left">* '+_msg+'</p>');
            } else if(_msg!='') {
                jQuery('.error-log').append('<p class="comment notice">* '+_msg+'</p>');
            }
            return true;
        },
        getUserInfo:function(userIndex,callback) {
            reqwest({
                url: loc[0].api[4], //회원 정보 조회
                method: loc[0].method,
                type: loc[0].type,
                data: {
                    'u_idx':userIndex
                }
            })
            .then(function (resp) {
                console.log(resp);
                /*************************
                 resp.ResultCode
                 '1'=success
                 '-1'=fail
                 *************************/
                if (resp[0].ResultCode == '1') {
                    callback(resp[0].ResultData[0]);
                } else if (resp.ResultCode == '-1') { //실패
                }
            })
            .fail(function (err, msg) {
                console.log(err);
                jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
            });
        }
    }
})();

/*
 create namespace timewalletUI
 timewalletSearch 검색gulp
 */
/*********************************************************************************
 * 페이지 : sidebar
 * 검색 부분 localstorage 사용
 *********************************************************************************/
var twSearch = twSearch || {};

twSearch = (function() {
    //private
    jQuery(function() {
    });

    //public
    return {
        dcBody:jQuery(document.body),
        storage:jQuery.localStorage,
        rData:[],
        initList : function(_$j,data,callback) {
            var _this=this,
                _j2Data=JSON.stringify(data);

            //save search json data
            if(!_this.storage.get('history')) {
                _this.storage.set('history',_j2Data);
                jQuery('.search-result').show();
            } else {
                jQuery('.search-result').hide();
            }

            _this.rData=_this.storage.get('history');

            callback(_this.rData);

            return this;
        },
        searchEnter : function(_$j,callback) {
            var _this=this,
                _$s=jQuery('.search-history');

            _$j.find('input[type=search]').on('focus',function(e) {
                jQuery('.search-result').show();

                e.stopPropagation();
            })
                .on('focusout',function(e) {
                    e.stopPropagation();
                });

            _$j.find('input[type=search]').on('keyup',function(e) {
                e.stopPropagation();
                var _that=this,
                    _bCompare=true;

                if(e.which==13) { // enter일 시
                    if(jQuery(this).val().length>0) { //검색어를 입력했을 시
                        if(_this.rData.length>0) {
                            Lazy(_this.rData).each(function(i,k) {
                                if(i.search!=jQuery(_that).val()) {
                                    _bCompare=false;
                                    return false;
                                } else {
                                    _bCompare=true;
                                    return false;
                                    //findAndRemove(_this.rData,'search',jQuery(_that).val());
                                }
                            });

                            if(_bCompare==false) {
                                _this.rData.push({'search': jQuery(_that).val()});
                                _this.storage.set('history', _this.rData);
                                _$s.find('ul').append(
                                    '<li><a class="search-word" href="javascript:void(0);">' + jQuery(_that).val() + '</a><a class="btn-del" href="javascript:void(0);">삭제</a></li>'
                                );
                            }

                        } else {
                            _this.rData.push({'search': jQuery(this).val()});
                            _this.storage.set('history', _this.rData);
                            _$s.find('ul').append(
                                '<li><a class="search-word" href="javascript:void(0);">' + jQuery(_that).val() + '</a><a class="btn-del" href="javascript:void(0);">삭제</a></li>'
                            );
                        }

                        if (typeof callback === 'function') {
                            callback.call(_this, jQuery(this).val());
                        }
                        jQuery(this).val('').blur(); //인풋 텍스트 삭제 및 키보드 숨기기(blur());
                    }
                }

            });

            _$j.find('.btn-shop-search').on('tap',function(e) {
                e.stopPropagation();
                if(_$j.find('input[type=search]').val().length>0) { //검색어를 입력했을 시
                    var _that=this,
                        _bCompare=true;

                    if(_this.rData.length>0) {
                        Lazy(_this.rData).each(function(i,k) {
                            if(i.search!=_$j.find('input[type=search]').val()) {
                                _bCompare=false;
                                return false;
                            } else {
                                _bCompare=true;
                                return false;
                                //findAndRemove(_this.rData,'search',jQuery(_that).val());
                            }
                        });

                        if(_bCompare==false) {
                            _this.rData.push({'search': _$j.find('input[type=search]').val()});
                            _this.storage.set('history', _this.rData);
                            _$s.find('ul').append(
                                '<li><a class="search-word" href="javascript:void(0);">' + _$j.find('input[type=search]').val() + '</a><a class="btn-del" href="javascript:void(0);">삭제</a></li>'
                            );

                        }
                    } else {
                        _this.rData.push({'search': jQuery(this).val()});
                        _this.storage.set('history', _this.rData);
                        _$s.find('ul').append(
                            '<li><a class="search-word" href="javascript:void(0);">' + _$j.find('input[type=search]').val() + '</a><a class="btn-del" href="javascript:void(0);">삭제</a></li>'
                        );
                    }

                    if (typeof callback === 'function') {
                        callback.call(_this, _$j.find('input[type=search]').val());
                    }
                    _$j.find('input[type=search]').val('').blur(); //인풋 텍스트 삭제 및 키보드 숨기기(blur());
                }

            });

            return this;
        },
        selectItem : function(_j,callback) {
            var _this=this;
            jQuery(document.body).on('tap',_j,function(e) {

                if(typeof callback==='function') {
                    callback.call(_this,jQuery(this).text());
                }
                e.stopImmediatePropagation();
            });

            return this;
        },
        eachDel : function(_j,callback) {
            var _this=this;

            jQuery(document.body).on('tap',_j,function(e) {
                e.preventDefault();

                if(typeof callback==='function') {
                    callback.call(_this,$(this).closest('li'));
                }

                _this.rData.splice($(this).closest('li').index(),1);
                _this.storage.set('history',_this.rData);
                $(this).closest('li').remove();
                e.stopImmediatePropagation();
            });

            return this;
        },
        clear : function(_$j,callback) {
            var _this=this;

            _$j.on('tap',function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                jQuery(this).closest('.search-result').find('li').remove();

                // remove localstroage data
                _this.rData=[];
                jQuery.localStorage.remove('history');

                if(typeof callback==='function') {
                    callback.call(_this);
                }
                e.stopPropagation();

            });

            return this;
        }

    };
})();

/* window.load */
jQuery(window).load(function() {
    //@set language in html
    //jQuery('html').attr('lang',_webLang);

    //@preload image
    //@param : target = append target
    //twCommonUi.preLoad(target);
});

/* document.ready */
jQuery(document).ready(function() {
    device.checkDeviceType();
    //historyback
    jQuery('.header .btn-prev').on('tap',function(e) {
        e.stopPropagation();
        e.preventDefault();

        if( window.location.hash == '#/member-join' || window.location.hash == '#/member-login' ) {
            console.log( '약관동의로 돌아가기' );
            BRIDGE.openAgreementPage(); //약관동의로 돌아가기
        } else if(window.location.hash.match('#/shop-detail')) {
            location.href='#/shop-list';
            //jQuery('.page').removeClass('twShop_detail center transition').addClass('twShop_list center transition');
            console.log('샵리스트로 히스토리 백');
        } else {
            console.log('그냥 히스토리 백');
            window.history.back();
        }
        twCommonUi.hideModal(jQuery('.modal'));
        jQuery('header').data('coin','');

    });

    jQuery('.header .btn-menu').on('tap',function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        location.href='#/menu-main';
    });


    // radio alter 20151021
    jQuery(document.body).off('tap');
    jQuery(document.body).on('tap','.inputbox-group .inp-radio label',function(e) {
        jQuery(this).closest('.inputbox-group').find('.inp-radio').removeClass('active');
        jQuery(this).closest('.inputbox-group').find('input[type=radio]').prop('checked',false).attr('checked',false);
        jQuery(this).closest('.inp-radio').addClass('active');
        jQuery(this).prev('input[type=radio]').prop('checked',true).attr('checked',true);
        e.stopImmediatePropagation();
    });

    // checkbox
    //jQuery(document.body).off('tap');
    jQuery(document.body).on('tap','.inp-check label',function(e) {
        var _$chbox=jQuery(this).closest('.inp-check');

        if(!_$chbox.attr('class').match('active')) {
            _$chbox.addClass('active');
            _$chbox.find('input').attr('checked',true);
        } else {
            _$chbox.removeClass('active');
            _$chbox.find('input').attr('checked',false);
        }
        e.stopImmediatePropagation();
    });

    // locationAccodion and height
    //twCommonUi.commonAccordion('.list-location',function(_txt) {

    //});
    jQuery('.list-location').height(jQuery(window).height());

    //jQuery('.member-complete').height(jQuery(window).height() - jQuery('.header').height());


    // sort-sidebar
    //jQuery(document.body).off('tap');
    jQuery(document.body).on('tap','.btn-sort',function(e) {
        // 20151216 addscript start
        if(!jQuery(this).attr('class').match('active')){
            jQuery(this).addClass('active');
        } else {
            jQuery('.btn-sort').removeClass('active');
        }
        // 20151216 end

        var _$sort=jQuery(this).next('.sort-sidebar'),
            _$shadow=null;

        if(!_$sort.attr('class').match('active')) {
            _$sort.addClass('active');
            if(jQuery('.innerShadow').size()>0) {
                _$shadow=jQuery('.innerShadow');

                if (device.checkDeviceType() == 'ios') {
                    jQuery(document).on('touchmove', function (e) {
                        if(parseInt(jQuery(window).height()) < parseInt(jQuery('.sort-sidebar').outerHeight())) {
                            if (jQuery(e.target).parents('.sort-sidebar').size() < 1) {
                                e.preventDefault();
                            }
                        }
                    });
                }
            } else {
                _$shadow=jQuery('.shadow');
            }

            _$shadow.css({
                'display':'block'
            });

            jQuery('.container').addClass('overflowHidden');
            // 20151026 추가
            jQuery('.category').addClass('disable');
            jQuery('.shadow-category').css('display','block');

            var _sort_height=jQuery(window).height()-jQuery('.header').height()-jQuery('.category').height();

            if(_$sort.height()>_sort_height) {
                _$sort.height(_sort_height).addClass('contentsScroll');
            }

        } else {
            _$sort.removeClass('active');
            if(jQuery('.innerShadow').size()>0) {
                _$shadow=jQuery('.innerShadow');
            } else {
                _$shadow=jQuery('.shadow');
            }

            _$shadow.css({
                'display':'none'
            });

            jQuery('.container').removeClass('overflowHidden');
            // 20151026 추가
            jQuery('.category').removeClass('disable');
            jQuery('.shadow-category').css('display','none');
            jQuery(document).off('touchmove');
            _$sort.removeClass('contentsScroll');

        }
        e.stopImmediatePropagation();
    });

    // bookmark
    //jQuery(document.body).off('tap');
    jQuery(document.body).on('tap','.bookmark a',function(e) {
        console.log('북마크');
        var _$bookmark=jQuery(this).closest('.bookmark'),
            num=parseInt(_$bookmark.find('.num').html()),
            _data={};

        _data={
            'u_idx':(jQuery.localStorage.get('userIdx')) ? jQuery.localStorage.get('userIdx') : 1,
            'shop_idx':jQuery(this).closest('.item-list-box').attr('data-shop-idx')
        };

        var loading = '<div class="loader" title="2" style="position: absolute;top: 50%;left: 50%;z-index: 999;width: 100px;height: 100px;margin: -50px 0 0 -50px;">' +
            '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 612 792" style="enable-background:new 0 0 612 792;" xml:space="preserve">'+
            '<style type="text/css">'+
            '.st0{opacity:0.2;fill:#1A1A1A;} .st1{fill:#FFFFFF;} .second {-webkit-transform: rotate(360deg);-webkit-transform-origin:50% 91.5%;-webkit-transition-duration: 1s; -webkit-transition-delay: now; -webkit-animation-timing-function: linear; -webkit-animation-iteration-count: infinite;}'+
            '@-webkit-keyframes second {'+
            'from {-ms-transform: rotate(0deg); -moz-transform: rotate(0deg);-webkit-transform: rotate(0deg); -o-transform: rotate(0deg);transform: rotate(0deg);}'+
            'to {-ms-transform: rotate(360deg); -moz-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg); transform: rotate(360deg);}'+
            '}'+
            '@keyframes second {'+
            'from {-ms-transform: rotate(0deg); -moz-transform: rotate(0deg); -webkit-transform: rotate(0deg); -o-transform: rotate(0deg);transform: rotate(0deg);}'+
            'to {-ms-transform: rotate(360deg); -moz-transform: rotate(360deg); -webkit-transform: rotate(360deg); -o-transform: rotate(360deg);transform: rotate(360deg);}'+
            '}'+
            '.second {-webkit-animation: second 2s linear infinite; -moz-animation: second 2s linear infinite; -ms-animation: second 2s linear infinite; -o-animation: second 2s linear infinite;animation: second 2s linear infinite;}'+
            '</style>'+
            '<ellipse id="XMLID_820_" class="st0" cx="308.4" cy="604.5" rx="183.8" ry="40.1"/>'+
            '<circle id="XMLID_674_" class="st1" cx="306" cy="361.4" r="230.8"/>'+
            '<path id="XMLID_671_" class="st2" d="M306,602.4c-132.9,0-241-108.1-241-241s108.1-241,241-241s241,108.1,241,241S438.9,602.4,306,602.4z M306,140.8c-121.6,0-220.6,99-220.6,220.6S184.4,582,306,582s220.6-99,220.6-220.6S427.6,140.8,306,140.8z" />'+
            '<path id="XMLID_669_" class="st2" d="M306,198.4c-1.6,0-2.9-1.3-2.9-2.9v-34.2c0-1.6,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v34.2C308.9,197.1,307.6,198.4,306,198.4z"/>'+
            '<path id="XMLID_667_" class="st2" d="M188.7,247c-0.7,0-1.5-0.3-2.1-0.9l-24.2-24.2c-1.1-1.1-1.1-3,0-4.1c1.1-1.1,3-1.1,4.1,0l24.2,24.2c1.1,1.1,1.1,3,0,4.1C190.2,246.7,189.4,247,188.7,247z"/>'+
            '<path id="XMLID_665_" class="st2" d="M140.1,364.3h-34.2c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9h34.2c1.6,0,2.9,1.3,2.9,2.9C143,363,141.7,364.3,140.1,364.3z"/>'+
            '<path id="XMLID_655_" class="st2" d="M164.5,505.8c-0.7,0-1.5-0.3-2.1-0.9c-1.1-1.1-1.1-3,0-4.1l24.2-24.2c1.1-1.1,3-1.1,4.1,0c1.1,1.1,1.1,3,0,4.1L166.5,505C166,505.5,165.2,505.8,164.5,505.8z"/>'+
            '<path id="XMLID_650_" class="st2" d="M306,564.4c-1.6,0-2.9-1.3-2.9-2.9v-34.2c0-1.6,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v34.2C308.9,563.1,307.6,564.4,306,564.4z"/>'+
            '<path id="XMLID_648_" class="st2" d="M447.5,505.8c-0.7,0-1.5-0.3-2.1-0.9l-24.2-24.2c-1.1-1.1-1.1-3,0-4.1c1.1-1.1,3-1.1,4.1,0l24.2,24.2c1.1,1.1,1.1,3,0,4.1C449,505.5,448.3,505.8,447.5,505.8z"/>'+
            '<path id="XMLID_646_" class="st2" d="M506.1,364.3h-34.2c-1.6,0-2.9-1.3-2.9-2.9c0-1.6,1.3-2.9,2.9-2.9h34.2c1.6,0,2.9,1.3,2.9,2.9C509.1,363,507.8,364.3,506.1,364.3z"/>'+
            '<path id="XMLID_632_" class="st2" d="M423.3,247c-0.7,0-1.5-0.3-2.1-0.9c-1.1-1.1-1.1-3,0-4.1l24.2-24.2c1.1-1.1,3-1.1,4.1,0c1.1,1.1,1.1,3,0,4.1l-24.2,24.2C424.8,246.7,424.1,247,423.3,247z"/>'+
            '<path id="XMLID_623_" class="st2 second" d="M309,211.4c-0.3-3.7-5.7-3.7-6,0l-11.7,147.9c0,8.1,6.6,14.7,14.7,14.7s14.7-6.6,14.7-14.7L309,211.4z" />'+
            '</svg>'+
            '</div>';

        jQuery('body').css('pointer-events','none').append(loading);

        setTimeout(function() {
            if (!_$bookmark.attr('class').match('active')) {
                _$bookmark.addClass('active');
                num = num + 1;
                _$bookmark.find('.num').html(num);

                reqwest({
                    url: loc[5].api[2], //북마크 등록
                    method: loc[5].method,
                    type: loc[5].type,
                    data: _data
                })
                .then(function (resp) {
                    /*************************
                     resp.ResultCode
                     '1'=success
                     '-1'=fail
                     *************************/
                    if (resp[0].ResultCode == '1') { // 북마크 등록 성공
                        twCommonUi.stopLoading();
                    } else if (resp[0].ResultCode == '-1') { // 실패 : 북마크 등록
                    }
                })
                .fail(function (err, msg) {
                    console.log(err);
                    jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                });
            } else {
                if(window.location.hash.match('#/bookmark')){
                    console.log('북마크페이지에서 호출함');
                    var bookmarkWrap = _$bookmark.closest('.item-list-box');
                    _$bookmark.removeClass('active');
                    num = num - 1;
                    _$bookmark.find('.num').html(num);

                    reqwest({
                        url: loc[5].api[3], //북마크 삭제
                        method: loc[5].method,
                        type: loc[5].type,
                        data: _data
                    })
                    .then(function (resp) {
                        /*************************
                         resp.ResultCode
                         '1'=success
                         '-1'=fail
                         *************************/
                        if (resp[0].ResultCode == '1') { // 북마크 삭제 성공
                            twCommonUi.stopLoading();
                            bookmarkWrap.remove(); // or bookmarkWrap.hide(); 입맛에 맞게 사용.
                        } else if (resp[0].ResultCode == '-1') { // 실패 : 북마크 삭제
                        }
                    })
                    .fail(function (err, msg) {
                        console.log(err);
                        jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                    });
                } else {
                    _$bookmark.removeClass('active');
                    num = num - 1;
                    _$bookmark.find('.num').html(num);

                    reqwest({
                        url: loc[5].api[3], //북마크 삭제
                        method: loc[5].method,
                        type: loc[5].type,
                        data: _data
                    })
                    .then(function (resp) {
                        /*************************
                         resp.ResultCode
                         '1'=success
                         '-1'=fail
                         *************************/
                        if (resp[0].ResultCode == '1') { // 북마크 삭제 성공
                            twCommonUi.stopLoading();
                        } else if (resp[0].ResultCode == '-1') { // 실패 : 북마크 삭제
                        }
                    })
                    .fail(function (err, msg) {
                        console.log(err);
                        jQuery('#errors').html('response::::' + err.response + '<br />status::::' + err.status + '<br />statusText::::' + err.statusText)
                    });
                }
            }

        },1500);
        e.stopImmediatePropagation();
    });

    // search-list height
    /*
     jQuery('.search-list').height(
     jQuery(window).height() - jQuery('.header').height() - jQuery('.category').height()
     );
     */
    //console.log(jQuery('.search-list').height());
    //jQuery(document.body).off('tap');
    jQuery(document.body).on('tap','.state-area .btn-state-view img',function(e) {
        var _$this=jQuery(this).closest('.state-area');
        if(!_$this.attr('class').match('active')) {
            _$this.addClass('active');
        } else {
            _$this.removeClass('active');
        }
        e.stopImmediatePropagation();
    });
    // map height
    jQuery('.map-area').height(
        jQuery(window).height() - jQuery('.header').height() - jQuery('.category').height()
    );

    // search-complete height
    jQuery('.search-complete').height(
        jQuery(window).height() - jQuery('.header').height() - jQuery('.search-wordbox').height()
    );
    // search-history height
    jQuery('.search-history').height(
        jQuery(window).height() - jQuery('.header').height() - jQuery('.search-wordbox').height()  - jQuery('.delet-all').height()
    );
    // 모달 지도 지도영역 height
    jQuery('.modal-map-area').height(
        jQuery(window).height() - jQuery('.map-header').height()
    );

    // 매장상세에서 아이콘 및 상태설명 모달 height
    jQuery('.modal-full').height(
        jQuery(window).height()
    );

    // 매장상세에서 아이콘 및 상태설명 모달 height
    jQuery('.contentsScroll').height(
        jQuery(window).height() - jQuery('.header').height()
    );

    // 쿠폰교환 쿠폰리스트 height
    jQuery('.coupon-list').height(
        jQuery(window).height() - jQuery('.header').height() - jQuery('.category').height() - jQuery('.place').height() - jQuery('.sort-coupon').height()
    );

    // 코인교환 관련 height
    jQuery('.coin-exchange-list-wrap').height(
        jQuery(window).height() - jQuery('.header').height() - jQuery('.common-tab').height() - jQuery('.coin-exchange-notice').height()
    );


    // shop-detail에서 탭 상단에 위치
    jQuery('.contentsScroll').scroll(function(e){
        console.log('dd');
        var shopTabFixedHeight = jQuery('.shop-imgbox').height();
        if(jQuery('.contentsScroll').scrollTop() > shopTabFixedHeight ){
            jQuery('.shop-tab').addClass('fixed-top');
        }else{
            jQuery('.shop-tab').removeClass('fixed-top');
        }
        e.stopImmediatePropagation();
    });

    // 매장상세 탭클릭시 해당 컨텐츠로 이동
    jQuery('.shop-tab a').off('tap');
    jQuery(document.body).on('tap','.shop-tab a',function(e) {
    //jQuery('.shop-tab a').on('tap', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var _$this=jQuery(this);
        var curPos = jQuery('.contentsScroll').scrollTop();
        var shopTabFixedHeight = jQuery('.shop-imgbox').height();

        if(jQuery('.contentsScroll').scrollTop() > shopTabFixedHeight ){
            curPos = jQuery('.contentsScroll').scrollTop() - 30;
        } else {
            curPos = jQuery('.contentsScroll').scrollTop() - 60;
        }
        var shopFocusCoupon = curPos + jQuery('.coupon-info').position().top;
        var shopFocusShop =  curPos + jQuery('.shop-info').position().top;
        var shopFocusReview =  curPos + jQuery('.review-info').position().top;

        jQuery('.shop-tab a').removeClass('active');

        if (_$this.attr('class').match("tab-coupon")) {
            jQuery('.contentsScroll').scrollTop(shopFocusCoupon);
            _$this.addClass('active');
        }   else if (_$this.attr('class').match("tab-shop")) {
            jQuery('.contentsScroll').scrollTop(shopFocusShop);
            _$this.addClass('active');
        } else{
            jQuery('.contentsScroll').scrollTop(shopFocusReview);
            _$this.addClass('active');
        }
    });

    // 동전 클릭시 효과
    jQuery(document.body).on('tap','.btn-coin-useful',function(e) {
        var _$this=jQuery(this);
        var linkval = _$this.attr('href');
        var hrefval = "location.href = '" +  linkval + "'";

        e.preventDefault();

        if(!_$this.attr('class').match('active')) {
            _$this.addClass('active');
            setTimeout(hrefval,500);
        } else {
            _$this.removeClass('active');
        }
        e.stopImmediatePropagation();
    });

    //매장 상세 갤러리 모달 보기
    var slideLength = 1,
        $thumb = jQuery('.slider-shop-gallery-nav .thumb');
    var windowWidth = jQuery(window).width();
    var thumbWidth = $thumb.width()+4;
    var slideNumber = windowWidth /thumbWidth;
    var paging = Math.ceil($thumb.size()/slideNumber);
    //console.log('paging:::',paging)
    //console.log( 'wtf : ', slideNumber );
    //console.log(slideNumber);
    if(slideNumber.toString().split('.')[1]<5) {
        slideNumber=Math.ceil(slideNumber);
    } else {
        slideNumber=parseInt(slideNumber);
    }

    var $imageSlider = jQuery('.slider-shop-gallery');
    var $thumbSlider = jQuery('.slider-shop-gallery-nav');
    if($imageSlider.size()>0) {
        $imageSlider.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: false,
            infinite: false
        });
    }
    //console.log(slideNumber);
    if($thumbSlider.size()>0) {
        $thumbSlider.slick({
            slidesToShow: slideNumber,
            slidesToScroll: slideNumber,
            dots: false,
            arrows: false,
            centerMode: false,
            variableWidth: true,
            infinite: false
        });
    }
    jQuery(".gallery-thumb .thumb").eq(0).addClass('slick-focus');
    $imageSlider.on( 'afterChange', function( event, slick, currentSlide )
    {
        $thumbSlider.slick( 'slickGoTo', currentSlide );
        //console.log( 'currentSlide : ', currentSlide );
        jQuery(".gallery-thumb .thumb").removeClass('slick-focus').eq(currentSlide).addClass('slick-focus');
    });

    $thumbSlider.find('.thumb').on( 'tap', function( e )
    {
        $imageSlider[0].slick.slickGoTo(jQuery(e.currentTarget).index());
    });

    var slideHeight = jQuery(window).height() - 118;
    var slideWidth = jQuery(window).width();
    //console.log(slideWidth);
    //이미지 세로 가운데 맞추기
    jQuery('.modal-gallery .shop-gallery .thumb').css({
        'height':slideHeight,
        'line-height':slideHeight+'px'
    });
    jQuery('.modal-gallery .modal-inner .gallery-thumb').css({
        'width':slideWidth
    });

    //매장 상세 갤러리 모달 보기
    if(jQuery('.slider-other-shop').size()>0) {
        jQuery('.slider-other-shop').slick({
            slidesToShow:3
        });
    }

    //리뷰 글자 수 체크 최대 140글자 제한
    /*jQuery('.modal-review textarea,.modal-report textarea').append('<span style="display:none;"></span>');
    jQuery('.modal-review textarea,.modal-report textarea ').checkbyte({
        indicator:jQuery('.modal-review .textarea span,.modal-report .textarea span'),
        limit:280,
        twice:false
    });*/

    jQuery('.btn-shop-list').on('tap',function(e) {
        e.stopPropagation();
        location.href='#/shop-list';
    });

    //fileUpload
    //twCommonUi.setFile('.btn-upload','.filename',30);

    // 쿠폰교환 정렬순 클릭시
    /*
    jQuery(document.body).on('tap','.order .list a',function(e) {
        var _$this=jQuery(this).closest('.order');
        if(!_$this.attr('class').match('active')) {
            _$this.addClass('active');
            jQuery('.shadow').show();
        } else {
            _$this.removeClass('active');
            jQuery('.shadow').hide();
        }
        e.stopImmediatePropagation();
    });

    // 쿠폰교환 정렬 종류 탭시
    jQuery(document.body).on('tap','.key-list a',function(e) {
        var _$this=jQuery(this);
        var _$alignText=jQuery(this).text();
        var _$dest=jQuery('.list').find('.title');
        _$dest.text(_$alignText);

        jQuery('.order').removeClass('active');
        jQuery('.shadow').hide();

        e.stopImmediatePropagation();
    });

    // 쿠폰 교환가능 쿠폰만 보기 탭시
    jQuery(document.body).on('tap','.btn-coupon-view',function(e) {
        var _$this=jQuery(this);
        var _$sortViewText=jQuery(this).text();
        var _$dest=jQuery('.sort-coupon').find('.btn-coupon-view');

        if(!_$this.attr('class').match('active')) {
            _$dest.text('모든 쿠폰 보기');
            _$this.addClass('active');
        } else {
            _$dest.text('교환가능 쿠폰만 보기');
            _$this.removeClass('active');
        }

        e.stopImmediatePropagation();
    });
    */

    //메인 메뉴에서 링크 클릭시 효과
    jQuery(document.body).on('tap','.menu-link-box a',function(e) {
        var _$this=jQuery(this);
        jQuery('.menu-link-box a').removeClass('active');
        _$this.addClass('active');
        e.stopImmediatePropagation();
    });

    // 모래시계 클릭시 효과
    jQuery(document.body).on('tap','.btn-coin-exchange',function(e) {
        var _$this=jQuery(this);
        var linkval = _$this.attr('href');
        var hrefval = "location.href = '" +  linkval + "'";

        e.preventDefault();

        if(!_$this.attr('class').match('active')) {
            _$this.closest('.min').addClass('active');
            setTimeout(hrefval,500);
        } else {
            _$this.closest('.min').removeClass('active');
        }
        e.stopImmediatePropagation();
    });

    //onoffswitch
    jQuery(document.body).on('tap','.onoffswitch-label',function(e) {
        var _$this=jQuery(this).closest('.onoffswitch').find('.onoffswitch-checkbox');
        if(!_$this.hasClass('on')) {
            _$this.addClass('on');
            _$this.prop("checked",true);
            _$this.attr("checked","checked");
        } else {
            _$this.removeClass('on');
            _$this.prop("checked",false);
            _$this.removeAttr("checked","checked");
        }
        e.stopImmediatePropagation();
    });
    /*
    //common-tab
    jQuery(document.body).on('tap','.common-tab ul li a',function(e) {
        var _$this=jQuery(this);
        jQuery('.common-tab a').removeClass('active');
        _$this.addClass('active');
        e.stopImmediatePropagation();
    });
    //코인교환 히스토리
    jQuery(document.body).on('tap','.accordion-title .btn-open-view',function(e) {
        var _$this=jQuery(this);
        var _$accordionInfoView = _$this.closest('.accordion-title').next('.accordion-info-view');
        var _$accordionHeight = _$accordionInfoView.children('.validity').height() * _$accordionInfoView.children('.validity').size();

        if( _$accordionInfoView.height() == 0){
            _$this.addClass('active');
            _$accordionInfoView.css({
                'height' : _$accordionHeight
            });
        } else{
            _$this.removeClass('active');
            _$accordionInfoView.css({
                'height' : 0
            });
        }
        e.stopImmediatePropagation();
    });
    */
});

