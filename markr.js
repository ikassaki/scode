// https://gist.github.com/pmeenan/5902672; https://github.com/nicjansma/usertiming.js/blob/master/src/usertiming.js
try
{
window.marks || (window.marks = []);
window.performance || (window.performance = {});
window._perfRefForUserTimingPolyfill = window.performance;
window.performance.now || (window.performance.now = performance.now || performance.webkitNow || performance.msNow || performance.mozNow);
if (!window.performance.now)
  {
    var s = Date.now ? Date.now() : +(new Date());
    if (performance.timing && performance.timing.navigationStart)
      s = performance.timing.navigationStart;
    window.performance.now = (function(){
      	var n = Date.now ? Date.now() : +(new Date());
      	return n-s;  // will this "s" be captured in closure throughout the web page ?
      });
  }
} catch(e) {;}

function markR(label) {
	try { marks.push( { name:label, time:window.performance.now() } ); } catch(e) {alert("<<"+e.message);;}
}
markR("markR init");

