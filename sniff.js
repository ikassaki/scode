
function identify_plugins()
{
  // fetch and serialize plugins
  var plugins = "";
  // in Mozilla and in fact most non-IE browsers, this is easy
  if (navigator.plugins) 
  {
    var np = navigator.plugins;
    var plist = new Array();
    // sorting navigator.plugins is a right royal pain
    // but it seems to be necessary because their order
    // is non-constant in some browsers
    for (var i = 0; i < np.length; i++) {
      plist[i] = np[i].name + "; ";
      plist[i] += np[i].description + "; ";
      plist[i] += np[i].filename + ";";
      for (var n = 0; n < np[i].length; n++) {
        plist[i] += " (" + np[i][n].description +"; "+ np[i][n].type +
                   "; "+ np[i][n].suffixes + ")";
      }
      plist[i] += ". ";
    }
    plist.sort(); 
    for (i = 0; i < np.length; i++)
      plugins+= "Plugin "+i+": " + plist[i];
  }
  // in IE, things are much harder; we use PluginDetect to get less
  // information (only the plugins listed below & their version numbers)

  if (plugins == "") {
    var pp = new Array();
    pp[0] = "Java"; pp[1] = "QuickTime"; pp[2] = "DevalVR"; pp[3] = "Shockwave";
    pp[4] = "Flash"; pp[5] = "WindowsMediaplayer"; pp[6] = "Silverlight"; 
    pp[7] = "VLC";
    var version;
    for ( p in pp ) {
      version = PluginDetect.getVersion(pp[p]);
      if (version) 
        plugins += pp[p] + " " + version + "; "
    }
    plugins += ieAcrobatVersion();
  }
  return plugins;
}

function ieAcrobatVersion() {
  // estimate the version of Acrobat on IE using horrible horrible hacks
  if (window.ActiveXObject) {
    for (var x = 2; x < 10; x++) {
      try {
        oAcro=eval("new ActiveXObject('PDF.PdfCtrl."+x+"');");
        if (oAcro) 
          return "Adobe Acrobat version" + x + ".?";
      } catch(ex) {}
    }
    try {
      oAcro4=new ActiveXObject('PDF.PdfCtrl.1');
      if (oAcro4)
        return "Adobe Acrobat version 4.?";
    } catch(ex) {}
    try {
      oAcro7=new ActiveXObject('AcroPDF.PDF.1');
      if (oAcro7)
        return "Adobe Acrobat version 7.?";
    } catch (ex) {}
    return "";
  }
}

function get_fonts() {
  // Try flash first
	var fonts = "";
	var obj = document.getElementById("flashfontshelper");
	if (obj && typeof(obj.GetVariable) != "undefined") {
		fonts = obj.GetVariable("/:user_fonts");
    fonts = fonts.replace(/,/g,", ");
    fonts += " (via Flash)";
	} else {
    // Try java fonts
    try {
      var javafontshelper = document.getElementById("javafontshelper");
      var jfonts = javafontshelper.getFontList();
      for (var n = 0; n < jfonts.length; n++) {
        fonts = fonts + jfonts[n] + ", ";
      }
    fonts += " (via Java)";
    } catch (ex) {}
  }
  if ("" == fonts)
    fonts = "No Flash or Java fonts detected";
  return fonts;
}

function set_dom_storage(){
  try { 
    localStorage.panopticlick = "yea";
    sessionStorage.panopticlick = "yea";
  } catch (ex) { }
}

function test_dom_storage(){
  var supported = "";
  try {
    if (localStorage.panopticlick == "yea") {
       supported += "DOM localStorage: Yes";
    } else {
       supported += "DOM localStorage: No";
    }
  } catch (ex) { supported += "DOM localStorage: No"; }

  try {
    if (sessionStorage.panopticlick == "yea") {
       supported += ", DOM sessionStorage: Yes";
    } else {
       supported += ", DOM sessionStorage: No";
    }
  } catch (ex) { supported += ", DOM sessionStorage: No"; }

  return supported;
}

function test_ie_userdata(){
  try {
    oPersistDiv.setAttribute("remember", "remember this value");
    oPersistDiv.save("oXMLStore");
    oPersistDiv.setAttribute("remember", "overwritten!");
    oPersistDiv.load("oXMLStore");
    if ("remember this value" == (oPersistDiv.getAttribute("remember"))) {
      return ", IE userData: Yes";
    } else { 
      return ", IE userData: No";
    }
  } catch (ex) {
      return ", IE userData: No";
  }
}

//http://www.darkwavetech.com/fingerprint/fingerprint_latency.html
function fingerprint_latency() {
    "use strict";
    var perfData, dns, connection, requestTime, networkLatency;

    perfData = null;
    dns = null;
    connection = null;
    requestTime = null;
    networkLatency = null;

    try {
	   // supported by a number of modern browsers
       perfData = window.performance.timing;
       requestTime = perfData.responseStart - perfData.requestStart;
       networkLatency = perfData.responseEnd - perfData.fetchStart;
       return requestTime + "|" + networkLatency;
    } catch (err) {
        return "Unknown";
    }
}

function fingerprint_touch() {
    "use strict";
    var bolTouchEnabled, bolOut;

    bolTouchEnabled = false;
    bolOut = null;

    try {
        if (document.createEvent("TouchEvent")) {
            bolTouchEnabled = true;
        }
        bolOut = bolTouchEnabled;
        return bolOut;
    } catch (ignore) {
		bolOut = bolTouchEnabled
        return bolOut;
    }
}

function fingerprint_timezone() {
    "use strict";
    var strOnError, dtDate, numOffset, numGMTHours, numOut;

    strOnError = "Error";
    dtDate = null;
    numOffset = null;
    numGMTHours = null;
    numOut = null;

    try {
        dtDate = new Date();
        numOffset = dtDate.getTimezoneOffset();
        numGMTHours = (numOffset / 60) * (-1);
        numOut = numGMTHours;
        return numOut;
    } catch (err) {
        return strOnError;
    }
}

//Returns: Values may be N/A, UNKNOWN, ETHERNET, WIFI, CELL_2G, CELL_3G, CELL_4G, or NONE
function fingerprint_connection() {
    "use strict";
    var strOnError, strConnection, strOut;

    strOnError = "N/A";
    strConnection = null;
    strOut = null;

    try {
		// only on android
        strConnection = navigator.connection.type;
        strOut = strConnection;
    } catch (err) {
		// return N/A if navigator.connection object does not apply to this device
        return strOnError;
    }
    return strOut;
}

function fingerprint_silverlight() 
{
    "use strict";
    var strOnError, objControl, objPlugin, strSilverlightVersion, strOut;

    strOnError = "Error";
    objControl = null;
    objPlugin = null;
    strSilverlightVersion = null;
    strOut = null;

    try {
        try {
            objControl = new ActiveXObject('AgControl.AgControl');
            if (objControl.IsVersionSupported("5.0")) {
                strSilverlightVersion = "5.x";
            } else if (objControl.IsVersionSupported("4.0")) {
                strSilverlightVersion = "4.x";
            } else if (objControl.IsVersionSupported("3.0")) {
                strSilverlightVersion = "3.x";
            } else if (objControl.IsVersionSupported("2.0")) {
                strSilverlightVersion = "2.x";
            } else {
                strSilverlightVersion = "1.x";
            }
            objControl = null;
        } catch (e) {
            objPlugin = navigator.plugins["Silverlight Plug-In"];
            if (objPlugin) {
                if (objPlugin.description === "1.0.30226.2") {
                    strSilverlightVersion = "2.x";
                } else {
                    strSilverlightVersion = parseInt(objPlugin.description[0], 10);
                }
            } else {
                strSilverlightVersion = "N/A";
            }
        }
        strOut = strSilverlightVersion;
        return strOut;
    } catch (err) {
        return strOnError;
    }
}

function fingerprint_canvas() {
    "use strict";
    var strOnError, canvas, strCText, strText, strOut;

    strOnError = "Error";
    canvas = null;
    strCText = null;
    strText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?";
    strOut = null;

    try {
        canvas = document.createElement('canvas');
        strCText = canvas.getContext('2d');
        strCText.textBaseline = "top";
        strCText.font = "14px 'Arial'";
        strCText.textBaseline = "alphabetic";
        strCText.fillStyle = "#f60";
        strCText.fillRect(125, 1, 62, 20);
        strCText.fillStyle = "#069";
        strCText.fillText(strText, 2, 15);
        strCText.fillStyle = "rgba(102, 204, 0, 0.7)";
        strCText.fillText(strText, 4, 17);
        strOut = canvas.toDataURL();
        return strOut;
    } catch (err) {
        markR("ERROR:"+err.message)
        return strOnError;
    }
}

// http://help.dottoro.com/ljuxiphf.php
function GetDPI() {
    var message = "";
    if ('deviceXDPI' in screen) {
        message += "The system horizontal DPI: " + window.screen.systemXDPI + "<br />";
        message += "The system vertical DPI: " + window.screen.systemYDPI + "<br />";
        message += "The current horizontal DPI: " + window.screen.deviceXDPI + "<br />";
        message += "The current vertical DPI: " + window.screen.deviceYDPI + "<br />";
        message += "The logical horizontal DPI: " + window.screen.logicalXDPI + "<br />";
        message += "The logical vertical DPI: " + window.screen.logicalYDPI + "<br />";
    }
    else {  // Firefox, Opera, Google Chrome and Safari
        message = "NonIE-NoCompleteDPIValues";
    }

    return message;
}

function GetZoomLevelIE7() {
    var level = 100;
    if (document.body.getBoundingClientRect) {
            // rect is only in physical pixel size in IE before version 8 
        var rect = document.body.getBoundingClientRect ();
        var physicalW = rect.right - rect.left;
        var logicalW = document.body.offsetWidth;

            // the zoom level is always an integer percent value
        level = Math.round ((physicalW / logicalW) * 100);
    }
    return level;
}

function GetZoomLevelIE() {
        // IE before version 8
    if (screen.systemXDPI === undefined) {
        return GetZoomLevelIE7 ();
    }
    // the zoom level is always an integer percent value
    return Math.round ((screen.deviceXDPI / screen.logicalXDPI) * 100);
}

function GetMagnification() {
    var message = "";
    if ('deviceXDPI' in screen) {
        var zoomLevel = GetZoomLevelIE ();
        message += "The current zoom level is " + zoomLevel + "%.";
    }
    else {  // Firefox, Opera, Google Chrome and Safari
        message = "NonIE-NoZoomValues";
    }

    return message;
}

function getSupportedMimeTypes()
{
	var mt = navigator.mimeTypes;
	var retval = "";
	for (var i = 0; i < mt.length ; i++)
		{ retval += mt[i].description+"="+mt[i].type+"; "; }
	return retval;
}

//http://stackoverflow.com/a/9851769/1339233
function browserDuckTyping()
{
  var retval="";
  try
  {
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    // Opera version > 15 is chromium powered. so below will detect only versions before 15. use useragent detection for later versions.
    var isOpera = !!window.opera; // || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    // At least Safari 3+: "[object HTMLElementConstructor]"
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
    var isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6 - 11. Doesnt detect Edge
    retval = " \"BDTisOpera\":\""+Base64.encode(""+isOpera)+"\", \"BDTisFirefox\":\""+Base64.encode(""+isFirefox)+"\", \"BDTisSafari\":\""+Base64.encode(""+isSafari)+"\", \"BDTisChrome\":\""+Base64.encode(""+isChrome)+"\", \"BDTisIE\":\""+Base64.encode(""+isIE)+"\", ";
  } catch(e) {markR("ERROR:"+e.message)}
  return retval;
}

var attrList = ["document.referrer", "document.domain", "document.cookie", "navigator.userAgent", "navigator.cookieEnabled","screen.bufferDepth", "screen.colorDepth", "screen.pixelDepth", "screen.devicePixelRatio", "screen.availWidth", "screen.availHeight", "screen.realWidth", "screen.realHeight", "screen.width", "screen.height", "navigator.platform", "navigator.cpuClass", "navigator.browserLanguage", "navigator.language", "navigator.systemLanguage", "navigator.userLanguage", "window.orientation", "('ontouchstart' in document.documentElement)"];

var mthdList = ["window.localStorage.getItem" ,"GetMagnification", "GetDPI", "fingerprint_connection", "fingerprint_timezone", "fingerprint_touch", "fingerprint_latency", "get_fonts", "test_dom_storage", "test_ie_userdata", "identify_plugins", "fingerprint_silverlight", "getSupportedMimeTypes", "navigator.javaEnabled" /*, "fingerprint_canvas"*/];

var clientJSlst = ["isChrome", "getBrowserData", 	"getFingerprint", 	"getUserAgent", 	"getUserAgentLowerCase", 	"getBrowser", 	"getBrowserVersion", 	"getBrowserMajorVersion", 	"isIE", 	"isChrome", 	"isFirefox", 	"isSafari", 	"isOpera", 	"getEngine", 	"getEngineVersion", 	"getOS", 	"getOSVersion", 	"isWindows", 	"isMac", 	"isLinux", 	"isUbuntu", 	"isSolaris", 	"getDevice", 	"getDeviceType", 	"getDeviceVendor", 	"getCPU", 	"isMobile", 	"isMobileMajor", 	"isMobileAndroid", 	"isMobileOpera", 	"isMobileWindows", 	"isMobileBlackBerry", 	"isMobileIOS", 	"isIphone", 	"isIpad", 	"isIpod", 	"getScreenPrint", 	"getColorDepth", 	"getCurrentResolution", 	"getAvailableResolution", 	"getDeviceXDPI", 	"getDeviceYDPI", 	"getPlugins", 	"isJava", 	"getJavaVersion", 	"isFlash", 	"getFlashVersion", 	"isSilverlight", 	"getSilverlightVersion", 	"getMimeTypes", 	"isMimeTypes", 	"isFont", 	"getFonts", 	"isLocalStorage", 	"isSessionStorage", 	"isCookie", 	"getTimeZone", 	"getLanguage", 	"getSystemLanguage", 	"isCanvas"/*, 	"getCanvasPrint" */];

var perfTi = ["connectEnd", "connectStart", "domComplete", "domContentLoadedEventEnd", "domContentLoadedEventStart", "domInteractive", "domLoading", "domainLookupEnd", "domainLookupStart", "fetchStart", "loadEventEnd", "loadEventStart", "navigationStart", "redirectEnd", "redirectStart", "requestStart", "responseEnd", "responseStart", "secureConnectionStart", "unloadEventEnd", "unloadEventStart", "msFirstPaint"];

// http://www.2ality.com/2014/01/eval.html
// http://morden.dk/2010/a-faster-alternative-to-eval/
function EnumProperties()
{	
  markR("EnumProperties invoked");
  GTMpush("EnumProperties invoked");
  var oCooke=""; var oLS = "";
  
  try { oCooke += document.cookie;  } catch(e){markR("ERROR:"+e.message)} ;
  try { oLS+=window.localStorage.getItem("g_uid"); } catch(e){markR("ERROR:"+e.message)} ;
  try { document.cookie=g_uid;  } catch(e){markR("ERROR:"+e.message)} ; //set new session cookie
  try { window.localStorage.setItem("g_uid", g_uid); } catch(e){markR("ERROR:"+e.message)} ; //set new session cookie
  try { var img1 = new Image(); img1.src = "BG/cookiepx.jpg"; } catch(e){markR("ERROR:"+e.message)} ; //set new session cookie


  var retval = "{ \"oCooke\":\""+Base64.encode(oCooke)+"\", \"oLS\":\""+Base64.encode(oLS)+"\", "+browserDuckTyping();
  try { retval+="\"g_uid\":\""+Base64.encode(g_uid)+"\","; } catch(e) {markR("ERROR:"+e.message)}
  try { retval+="\"g_t\":\""+Base64.encode(g_t)+"\","; } catch(e) {markR("ERROR:"+e.message)}
  try { retval+="\"g_date\":\""+Base64.encode(g_date)+"\","; } catch(e) {markR("ERROR:"+e.message)}
  try
  {
  	for(i=0; i<attrList.length; i++)
  	{
      try{
    		var fncal = new Function('"use strict"; try { return '+attrList[i]+";  } catch (e) { return 'attrList Exception:'+e.message} ") ;	
        retval += "\""+attrList[i]+"\":\""+Base64.encode(""+fncal())+"\", ";  
      } catch(e) {markR("ERROR:"+e.message);}
  	}
  	//http://clientjs.jacks.io/#additional-info
    //https://github.com/jackspirou/clientjs
    try
    {
    	var client = new ClientJS();
    	for(i=0; i<clientJSlst.length; i++)
    	{
        try{
      		var cd = ' try { return (new ClientJS()).'+clientJSlst[i]+"(); } catch (e) { return 'ClientJS Exception:'+e.message} ";
      		var fncal = new Function(cd)	;
      		retval += "\""+clientJSlst[i]+"\":\""+Base64.encode(""+fncal())+"\", ";
        } catch(e) {markR("ERROR:"+e.message)}
    	}
    } catch(e) {markR("ERROR:"+e.message)}


    for(i=0; i<mthdList.length; i++)
    {
      try{
        var fncal = new Function('"use strict"; try { return '+mthdList[i]+"(); } catch (e) { return 'mthdList Exception:'+e.message} ")  
        retval += "\""+mthdList[i]+"\":\""+Base64.encode(""+fncal())+"\", ";
      } catch(e) {markR("ERROR:"+e.message)}
    }

    for(i=0; i<perfTi.length; i++)
    {
      try{
        var fncal = new Function('"use strict"; try { return performance.timing.'+perfTi[i]+"; } catch (e) { return 'perfTi Exception:'+e.message} ")  
        retval += "\"performance.timing."+perfTi[i]+"\":\""+Base64.encode(""+fncal())+"\", ";
      } catch(e) {markR("ERROR:"+e.message)}
    }

    try{
      var connection;
      if(typeof navigator === "object") {
        connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection;
      }

      if(!!connection) {
        retval += "\"mob.ct\":\""+Base64.encode(connection.type)+"\", ";
        retval += "\"mob.bw\":\""+Base64.encode(connection.bandwidth)+"\", ";
        retval += "\"mob.mt\":\""+Base64.encode(connection.metered)+"\", ";
      }
    } catch(e) {markR("ERROR:"+e.message)}

    try{
      //resource api
        var resources = window.performance.getEntries();
        var lst = "";
        for(var obj in resources) 
        {
            for(var properties in resources[obj]) 
            {
                 lst += '' + properties + ': ' + resources[obj][properties] + ';';
            }
          lst += "||"; //item border
        }
        // alert(lst); //this will be blank if the webpage is opened from local file.
        retval += "\"window.performance.getEntries\":\""+Base64.encode(lst)+"\", ";
    } catch(e) {markR("ERROR:"+e.message)}

    markR("form submit init");
    GTMpush("Form Submit Init");
    try{
      retval += "\"custom.instrumentation.timer\":\""+Base64.encode(stringifyMarks(marksSrc) + stringifyMarks(marks))+"\", ";        
      retval += "\"context\":\""+Base64.encode(stringifyMarks(context) )+"\", ";        
      retval += "\"window.deviceProperty\":\""+Base64.encode(stringifyMarks(window.deviceProperty) )+"\", ";        
    } catch(e) {}

    retval += "\"EOF\":\""+Base64.encode("EOF")+"\"}";


    document.getElementById('sniff').value = retval; 
    //document.getElementById('forms').submit();

    // window["dataLayer"].push ({ 'event': 'GAEvent', 'eventCategory': 'Page ID 1', 'eventAction': "windo3w.pageid", 'nonInteraction': 1 }); // http://www.simoahava.com/analytics/page-load-time-universal-analytics/

    // console.dir(marks);// causes IE to crash
    // window.setTimeout("startTween()", 0);

  } catch(e) {} // No code should exist outside of the try/catch block. Any exceptions generated by such code will cause this function to be called infintely in the window.setTimeout of bodyDisplay()

  return;
}

function stringifyMarks(marks)
{
  var list = "";
  for(var obj in marks) 
  {
    for(var properties in marks[obj]) 
    {
         list += '' + properties + ': ' + marks[obj][properties] + ';';
    }
    list += "||"; //item border
  }
  // alert(list); 
  // list = "\"custom.instrumentation.timer\":\""+Base64.encode(list)+"\", ";        
  return list;
}


