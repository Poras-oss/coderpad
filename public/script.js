"use strict";(()=>{var j,Y,w=function(){var t=self.performance&&performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(t&&t.responseStart>0&&t.responseStart<performance.now())return t},R=function(t){if(document.readyState==="loading")return"loading";var e=w();if(e){if(t<e.domInteractive)return"loading";if(e.domContentLoadedEventStart===0||t<e.domContentLoadedEventStart)return"dom-interactive";if(e.domComplete===0||t<e.domComplete)return"dom-content-loaded"}return"complete"},It=function(t){var e=t.nodeName;return t.nodeType===1?e.toLowerCase():e.toUpperCase().replace(/^#/,"")},J=function(t,e){var r="";try{for(;t&&t.nodeType!==9;){var a=t,i=a.id?"#"+a.id:It(a)+(a.classList&&a.classList.value&&a.classList.value.trim()&&a.classList.value.trim().length?"."+a.classList.value.trim().replace(/\s+/g,"."):"");if(r.length+i.length>(e||100)-1)return r||i;if(r=r?i+">"+r:i,a.id)break;t=a.parentNode}}catch{}return r},ot=-1,st=function(){return ot},M=function(t){addEventListener("pageshow",function(e){e.persisted&&(ot=e.timeStamp,t(e))},!0)},N=function(){var t=w();return t&&t.activationStart||0},g=function(t,e){var r=w(),a="navigate";return st()>=0?a="back-forward-cache":r&&(document.prerendering||N()>0?a="prerender":document.wasDiscarded?a="restore":r.type&&(a=r.type.replace(/_/g,"-"))),{name:t,value:e===void 0?-1:e,rating:"good",delta:0,entries:[],id:"v4-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12),navigationType:a}},P=function(t,e,r){try{if(PerformanceObserver.supportedEntryTypes.includes(t)){var a=new PerformanceObserver(function(i){Promise.resolve().then(function(){e(i.getEntries())})});return a.observe(Object.assign({type:t,buffered:!0},r||{})),a}}catch{}},v=function(t,e,r,a){var i,n;return function(o){e.value>=0&&(o||a)&&((n=e.value-(i||0))||i===void 0)&&(i=e.value,e.delta=n,e.rating=function(s,c){return s>c[1]?"poor":s>c[0]?"needs-improvement":"good"}(e.value,r),t(e))}},G=function(t){requestAnimationFrame(function(){return requestAnimationFrame(function(){return t()})})},_=function(t){document.addEventListener("visibilitychange",function(){document.visibilityState==="hidden"&&t()})},Z=function(t){var e=!1;return function(){e||(t(),e=!0)}},E=-1,$=function(){return document.visibilityState!=="hidden"||document.prerendering?1/0:0},B=function(t){document.visibilityState==="hidden"&&E>-1&&(E=t.type==="visibilitychange"?t.timeStamp:0,At())},tt=function(){addEventListener("visibilitychange",B,!0),addEventListener("prerenderingchange",B,!0)},At=function(){removeEventListener("visibilitychange",B,!0),removeEventListener("prerenderingchange",B,!0)},ct=function(){return E<0&&(E=$(),tt(),M(function(){setTimeout(function(){E=$(),tt()},0)})),{get firstHiddenTime(){return E}}},W=function(t){document.prerendering?addEventListener("prerenderingchange",function(){return t()},!0):t()},et=[1800,3e3],ut=function(t,e){e=e||{},W(function(){var r,a=ct(),i=g("FCP"),n=P("paint",function(o){o.forEach(function(s){s.name==="first-contentful-paint"&&(n.disconnect(),s.startTime<a.firstHiddenTime&&(i.value=Math.max(s.startTime-N(),0),i.entries.push(s),r(!0)))})});n&&(r=v(t,i,et,e.reportAllChanges),M(function(o){i=g("FCP"),r=v(t,i,et,e.reportAllChanges),G(function(){i.value=performance.now()-o.timeStamp,r(!0)})}))})},nt=[.1,.25],dt=function(t,e){(function(r,a){a=a||{},ut(Z(function(){var i,n=g("CLS",0),o=0,s=[],c=function(m){m.forEach(function(u){if(!u.hadRecentInput){var l=s[0],k=s[s.length-1];o&&u.startTime-k.startTime<1e3&&u.startTime-l.startTime<5e3?(o+=u.value,s.push(u)):(o=u.value,s=[u])}}),o>n.value&&(n.value=o,n.entries=s,i())},d=P("layout-shift",c);d&&(i=v(r,n,nt,a.reportAllChanges),_(function(){c(d.takeRecords()),i(!0)}),M(function(){o=0,n=g("CLS",0),i=v(r,n,nt,a.reportAllChanges),G(function(){return i()})}),setTimeout(i,0))}))})(function(r){var a=function(i){var n,o={};if(i.entries.length){var s=i.entries.reduce(function(d,m){return d&&d.value>m.value?d:m});if(s&&s.sources&&s.sources.length){var c=(n=s.sources).find(function(d){return d.node&&d.node.nodeType===1})||n[0];c&&(o={largestShiftTarget:J(c.node),largestShiftTime:s.startTime,largestShiftValue:s.value,largestShiftSource:c,largestShiftEntry:s,loadState:R(s.startTime)})}}return Object.assign(i,{attribution:o})}(r);t(a)},e)},mt=function(t,e){ut(function(r){var a=function(i){var n={timeToFirstByte:0,firstByteToFCP:i.value,loadState:R(st())};if(i.entries.length){var o=w(),s=i.entries[i.entries.length-1];if(o){var c=o.activationStart||0,d=Math.max(0,o.responseStart-c);n={timeToFirstByte:d,firstByteToFCP:i.value-d,loadState:R(i.entries[0].startTime),navigationEntry:o,fcpEntry:s}}}return Object.assign(i,{attribution:n})}(r);t(a)},e)},lt=0,H=1/0,F=0,xt=function(t){t.forEach(function(e){e.interactionId&&(H=Math.min(H,e.interactionId),F=Math.max(F,e.interactionId),lt=F?(F-H)/7+1:0)})},ft=function(){return j?lt:performance.interactionCount||0},Ft=function(){"interactionCount"in performance||j||(j=P("event",xt,{type:"event",buffered:!0,durationThreshold:0}))},p=[],D=new Map,pt=0,Rt=function(){var t=Math.min(p.length-1,Math.floor((ft()-pt)/50));return p[t]},gt=[],Bt=function(t){if(gt.forEach(function(i){return i(t)}),t.interactionId||t.entryType==="first-input"){var e=p[p.length-1],r=D.get(t.interactionId);if(r||p.length<10||t.duration>e.latency){if(r)t.duration>r.latency?(r.entries=[t],r.latency=t.duration):t.duration===r.latency&&t.startTime===r.entries[0].startTime&&r.entries.push(t);else{var a={id:t.interactionId,latency:t.duration,entries:[t]};D.set(a.id,a),p.push(a)}p.sort(function(i,n){return n.latency-i.latency}),p.length>10&&p.splice(10).forEach(function(i){return D.delete(i.id)})}}},Q=function(t){var e=self.requestIdleCallback||self.setTimeout,r=-1;return t=Z(t),document.visibilityState==="hidden"?t():(r=e(t),_(t)),r},it=[200,500],Nt=function(t,e){"PerformanceEventTiming"in self&&"interactionId"in PerformanceEventTiming.prototype&&(e=e||{},W(function(){var r;Ft();var a,i=g("INP"),n=function(s){Q(function(){s.forEach(Bt);var c=Rt();c&&c.latency!==i.value&&(i.value=c.latency,i.entries=c.entries,a())})},o=P("event",n,{durationThreshold:(r=e.durationThreshold)!==null&&r!==void 0?r:40});a=v(t,i,it,e.reportAllChanges),o&&(o.observe({type:"first-input",buffered:!0}),_(function(){n(o.takeRecords()),a(!0)}),M(function(){pt=ft(),p.length=0,D.clear(),i=g("INP"),a=v(t,i,it,e.reportAllChanges)}))}))},b=[],h=[],V=0,K=new WeakMap,C=new Map,U=-1,_t=function(t){b=b.concat(t),vt()},vt=function(){U<0&&(U=Q(Wt))},Wt=function(){C.size>10&&C.forEach(function(o,s){D.has(s)||C.delete(s)});var t=p.map(function(o){return K.get(o.entries[0])}),e=h.length-50;h=h.filter(function(o,s){return s>=e||t.includes(o)});for(var r=new Set,a=0;a<h.length;a++){var i=h[a];ht(i.startTime,i.processingEnd).forEach(function(o){r.add(o)})}var n=b.length-1-50;b=b.filter(function(o,s){return o.startTime>V&&s>n||r.has(o)}),U=-1};gt.push(function(t){t.interactionId&&t.target&&!C.has(t.interactionId)&&C.set(t.interactionId,t.target)},function(t){var e,r=t.startTime+t.duration;V=Math.max(V,t.processingEnd);for(var a=h.length-1;a>=0;a--){var i=h[a];if(Math.abs(r-i.renderTime)<=8){(e=i).startTime=Math.min(t.startTime,e.startTime),e.processingStart=Math.min(t.processingStart,e.processingStart),e.processingEnd=Math.max(t.processingEnd,e.processingEnd),e.entries.push(t);break}}e||(e={startTime:t.startTime,processingStart:t.processingStart,processingEnd:t.processingEnd,renderTime:r,entries:[t]},h.push(e)),(t.interactionId||t.entryType==="first-input")&&K.set(t,e),vt()});var ht=function(t,e){for(var r,a=[],i=0;r=b[i];i++)if(!(r.startTime+r.duration<t)){if(r.startTime>e)break;a.push(r)}return a},Tt=function(t,e){Y||(Y=P("long-animation-frame",_t)),Nt(function(r){var a=function(i){var n=i.entries[0],o=K.get(n),s=n.processingStart,c=o.processingEnd,d=o.entries.sort(function(S,Dt){return S.processingStart-Dt.processingStart}),m=ht(n.startTime,c),u=i.entries.find(function(S){return S.target}),l=u&&u.target||C.get(n.interactionId),k=[n.startTime+n.duration,c].concat(m.map(function(S){return S.startTime+S.duration})),x=Math.max.apply(Math,k),kt={interactionTarget:J(l),interactionTargetElement:l,interactionType:n.name.startsWith("key")?"keyboard":"pointer",interactionTime:n.startTime,nextPaintTime:x,processedEventEntries:d,longAnimationFrameEntries:m,inputDelay:s-n.startTime,processingDuration:c-s,presentationDelay:Math.max(x-c,0),loadState:R(n.startTime)};return Object.assign(i,{attribution:kt})}(r);t(a)},e)},rt=[2500,4e3],q={},yt=function(t,e){(function(r,a){a=a||{},W(function(){var i,n=ct(),o=g("LCP"),s=function(m){a.reportAllChanges||(m=m.slice(-1)),m.forEach(function(u){u.startTime<n.firstHiddenTime&&(o.value=Math.max(u.startTime-N(),0),o.entries=[u],i())})},c=P("largest-contentful-paint",s);if(c){i=v(r,o,rt,a.reportAllChanges);var d=Z(function(){q[o.id]||(s(c.takeRecords()),c.disconnect(),q[o.id]=!0,i(!0))});["keydown","click"].forEach(function(m){addEventListener(m,function(){return Q(d)},!0)}),_(d),M(function(m){o=g("LCP"),i=v(r,o,rt,a.reportAllChanges),G(function(){o.value=performance.now()-m.timeStamp,q[o.id]=!0,i(!0)})})}})})(function(r){var a=function(i){var n={timeToFirstByte:0,resourceLoadDelay:0,resourceLoadDuration:0,elementRenderDelay:i.value};if(i.entries.length){var o=w();if(o){var s=o.activationStart||0,c=i.entries[i.entries.length-1],d=c.url&&performance.getEntriesByType("resource").filter(function(x){return x.name===c.url})[0],m=Math.max(0,o.responseStart-s),u=Math.max(m,d?(d.requestStart||d.startTime)-s:0),l=Math.max(u,d?d.responseEnd-s:0),k=Math.max(l,c.startTime-s);n={element:J(c.element),timeToFirstByte:m,resourceLoadDelay:u-m,resourceLoadDuration:l-u,elementRenderDelay:k-l,navigationEntry:o,lcpEntry:c},c.url&&(n.url=c.url),d&&(n.lcpResourceEntry=d)}}return Object.assign(i,{attribution:n})}(r);t(a)},e)},at=[800,1800],zt=function t(e){document.prerendering?W(function(){return t(e)}):document.readyState!=="complete"?addEventListener("load",function(){return t(e)},!0):setTimeout(e,0)},Ot=function(t,e){e=e||{};var r=g("TTFB"),a=v(t,r,at,e.reportAllChanges);zt(function(){var i=w();i&&(r.value=Math.max(i.responseStart-N(),0),r.entries=[i],a(!0),M(function(){r=g("TTFB",0),(a=v(t,r,at,e.reportAllChanges))(!0)}))})},St=function(t,e){Ot(function(r){var a=function(i){var n={waitingDuration:0,cacheDuration:0,dnsDuration:0,connectionDuration:0,requestDuration:0};if(i.entries.length){var o=i.entries[0],s=o.activationStart||0,c=Math.max((o.workerStart||o.fetchStart)-s,0),d=Math.max(o.domainLookupStart-s,0),m=Math.max(o.connectStart-s,0),u=Math.max(o.connectEnd-s,0);n={waitingDuration:c,cacheDuration:d-c,dnsDuration:m-d,connectionDuration:u-m,requestDuration:i.value-u,navigationEntry:o}}return Object.assign(i,{attribution:n})}(r);t(a)},e)};function Ht(t){for(let e in t)if(t[e]!==void 0)return!0;return!1}function y(t){return Ht(t)?t:void 0}function T(){return Math.floor((1+Math.random())*65536).toString(16).substring(1)}function qt(){return""+T()+T()+"-"+T()+"-"+T()+"-"+T()+"-"+T()+T()+T()}var f=class{constructor(e,r){this.event=e;this.data=r}serialize(){return{source:"framer.site",timestamp:Date.now(),data:{type:"track",uuid:qt(),event:this.event,...this.data}}}};function Ct(t){let e=new Set;yt(n=>e.add(n)),mt(n=>e.add(n)),dt(({delta:n,...o})=>{e.add({...o,delta:n*1e3})}),Tt(n=>e.add(n)),St(n=>e.add(n));let r=["route-change","framer-appear","framer-hydration-time-to-first-paint","framer-cookie-open"];r.forEach(n=>performance.getEntriesByName(n).length!==0&&e.add({name:"custom",id:n})),new PerformanceObserver(n=>{let o=n.getEntries();for(let s=0;s<o.length;s++){let c=o[s],d=c==null?void 0:c.name;r.includes(d)&&e.add({name:"custom",id:d})}}).observe({entryTypes:["measure","mark"]});let a=document.getElementById("main").dataset,i={pageOptimizedAt:a.framerPageOptimizedAt?new Date(a.framerPageOptimizedAt).getTime():null,ssrReleasedAt:a.framerSsrReleasedAt?new Date(a.framerSsrReleasedAt).getTime():null,origin:document.location.origin,pathname:document.location.pathname,search:document.location.search};addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&Et(e,i,t)}),addEventListener("pagehide",()=>Et(e,i,t))}function Et(t,e,r){if(t.size===0)return;let a=[jt(e),...Vt(t,e)],i=Ut(t);i&&a.push(i),t.clear(),r(a)}function jt({pageOptimizedAt:t,ssrReleasedAt:e,origin:r,pathname:a,search:i}){var c;let n=performance.getEntriesByType("navigation")[0],o=document.querySelector("[data-framer-css-ssr-minified]");return new f("published_site_performance",{domNodes:document.getElementsByTagName("*").length,pageLoadDurationMs:(n==null?void 0:n.domContentLoadedEventEnd)!==void 0&&n.domContentLoadedEventStart!==void 0?Math.round(n.domContentLoadedEventEnd-n.domContentLoadedEventStart):null,timeToFirstByteMs:n?Math.round(n.responseStart):null,resourcesCount:performance.getEntriesByType("resource").length,framerCSSSize:(c=o==null?void 0:o.textContent)==null?void 0:c.length,headSize:document.head.innerHTML.length,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,hydrationDurationMs:null,pageOptimizedAt:t,ssrReleasedAt:e,devicePixelRatio:window.devicePixelRatio,navigationTiming:n?{activationStart:n.activationStart,connectEnd:n.connectEnd,connectStart:n.connectStart,criticalCHRestart:n.criticalCHRestart,decodedBodySize:n.decodedBodySize,deliveryType:n.deliveryType,domComplete:n.domComplete,domContentLoadedEventEnd:n.domContentLoadedEventEnd,domContentLoadedEventStart:n.domContentLoadedEventStart,domInteractive:n.domInteractive,domainLookupEnd:n.domainLookupEnd,domainLookupStart:n.domainLookupStart,duration:n.duration,encodedBodySize:n.encodedBodySize,fetchStart:n.fetchStart,firstInterimResponseStart:n.firstInterimResponseStart,loadEventEnd:n.loadEventEnd,loadEventStart:n.loadEventStart,nextHopProtocol:n.nextHopProtocol,redirectCount:n.redirectCount,redirectEnd:n.redirectEnd,redirectStart:n.redirectStart,requestStart:n.requestStart,responseEnd:n.responseEnd,responseStart:n.responseStart,responseStatus:n.responseStatus,secureConnectionStart:n.secureConnectionStart,serverTiming:n.serverTiming?JSON.stringify(n.serverTiming):null,startTime:n.startTime,transferSize:n.transferSize,type:n.type,unloadEventEnd:n.unloadEventEnd,unloadEventStart:n.unloadEventStart,workerStart:n.workerStart}:void 0,connection:navigator.connection?y({downlink:navigator.connection.downlink,downlinkMax:navigator.connection.downlinkMax,rtt:navigator.connection.rtt,saveData:navigator.connection.saveData,type:navigator.connection.type}):void 0,context:{origin:r,pathname:a,search:i}})}function Vt(t,{pageOptimizedAt:e,ssrReleasedAt:r,origin:a,pathname:i,search:n}){let o=[];return t.forEach(s=>{if(s.name==="custom")return;t.delete(s);let{name:c,delta:d,id:m,attribution:u}=s,l={metric:c,label:m,value:Math.round(d),pageOptimizedAt:e,ssrReleasedAt:r,context:{origin:a,pathname:i,search:n},attributionLcp:void 0,attributionCls:void 0,attributionInp:void 0,attributionFcp:void 0,attributionTtfb:void 0};c==="LCP"?l.attributionLcp=y({element:u.element,timeToFirstByte:u.timeToFirstByte,resourceLoadDelay:u.resourceLoadDelay,resourceLoadTime:u.resourceLoadDuration,elementRenderDelay:u.elementRenderDelay,url:u.url}):c==="CLS"?l.attributionCls=y({largestShiftTarget:u.largestShiftTarget,largestShiftTime:u.largestShiftTime,largestShiftValue:u.largestShiftValue,loadState:u.loadState}):c==="INP"?l.attributionInp=y({eventTarget:u.interactionTarget,eventType:u.interactionType,eventTime:u.interactionTime?Math.round(u.interactionTime):void 0,loadState:u.loadState,inputDelay:u.inputDelay,processingDuration:u.processingDuration,presentationDelay:u.presentationDelay,nextPaintTime:u.nextPaintTime}):c==="FCP"?l.attributionFcp=y({timeToFirstByte:u.timeToFirstByte,firstByteToFCP:u.firstByteToFCP,loadState:u.loadState}):c==="TTFB"&&(l.attributionTtfb=y({waitingTime:u.waitingDuration,dnsTime:u.dnsDuration,connectionTime:u.connectionDuration,requestTime:u.requestDuration,cacheDuration:u.cacheDuration})),o.push(new f("published_site_performance_web_vitals",l))}),o}function Ut(t){let e=[];if(t.forEach(r=>{let{name:a,id:i}=r;if(a!=="custom")return;t.delete(r);let n=Jt(i);n&&(e=e.concat(n))}),e.length!==0)return new f("published_site_performance_user_timings",{timings:JSON.stringify(e)})}var bt=0;function Jt(t){if(t==="route-change"){let a=performance.getEntriesByName(t),i=a.length>0?a.filter(n=>n.startTime>bt).map(n=>({name:"route-change",startTime:n.startTime,duration:n.duration})):void 0;return i!=null&&i.length?(bt=i[i.length-1].startTime,i):void 0}let e=performance.getEntriesByName(t)[0];return e?{name:t.replace("framer-","").split("-",1)[0],startTime:e.startTime,duration:e.duration}:void 0}var X=null;function z(){if(!X){let t=document.currentScript;X={src:(t==null?void 0:t.src)??"https://events.framer.com/",framerSiteId:t?t.getAttribute("data-fid"):null}}return X}var Gt=z();function I(t,e){let r=[new f("published_site_pageview",{referrer:(e==null?void 0:e.initialReferrer)||null,url:location.href,hostname:location.hostname||null,pathname:location.pathname||null,hash:location.hash||null,search:location.search||null,framerSiteId:Gt.framerSiteId})];t(r)}async function O(t={priority:"background"}){if(window.scheduler){if(window.scheduler.yield)return window.scheduler.yield(t);if(window.scheduler.postTask)return window.scheduler.postTask(()=>{},t)}return Promise.resolve()}function wt(t){addEventListener("popstate",()=>I(t));let e=history.pushState;history.pushState=function(...r){e.apply(history,r),(async()=>(await O(),I(t)))()}}function Mt(t){window.__send_framer_event=(e,r)=>{let a=new f(e,r);t([a])}}var L="__framer_events";function Pt(t){if(window[L]||(window[L]=[]),window[L].length>0){let e=window[L].map(r=>new f(r[0],r[1]));t(e),window[L].length=0}window[L].push=function(...e){let r=e.map(a=>new f(a[0],a[1]));return t(r),-1}}var Lt=z(),Zt=new URL(Lt.src),Qt=Zt.origin+"/anonymous";function Kt(t){if(!location.protocol.startsWith("http"))return;let e={framerSiteId:Lt.framerSiteId,origin:document.location.origin,pathname:document.location.pathname,search:document.location.search,visitTimeOrigin:performance.timeOrigin};fetch(Qt,{body:JSON.stringify(t.map(r=>({...r,data:{...r.data,context:{...e,...r.data.context}}}))),method:"POST",keepalive:!0,headers:{"Content-Type":"application/json"}})}function A(t){let e=t.map(r=>r.serialize());Kt(e)}var Xt=async()=>{await O(),Ct(A),wt(A),Mt(A),Pt(A);let t=typeof document.referrer=="string";I(A,{initialReferrer:t&&document.referrer||null})};Xt();})();