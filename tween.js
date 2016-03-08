///////////////////////////////////////////////////////////////////////////
///////////////////////TWEEN HELPER DEBUG//////////////////////////////////
///////////////////////////////////////////////////////////////////////////


window._LogDbgTweenOverwritten = false;
function TweenLite_onOverwrite(overwritten, overwriting, target, overwrittenProperties) 
{
  if ( _LogDbgTweenOverwritten )
  {
    console.log("Tween overwritten: "+window.performance.now())
    console.log("\toverwritten: " + overwritten.vars.data);
    console.log("\toverwriting: " + overwriting.vars.data);
    console.log("\ttarget: " + target.outerHTML);
    console.log("\tprops: " + overwrittenProperties);
    
    label = "None";
    try{    label = overwrittenProperties;  } catch(e){}
    try{    label = target.id+" : "+label;  } catch(e){}
    window["dataLayer"]=window["dataLayer"]||[];
    window["dataLayer"].push ({ 
      'event': 'CEvent', 
      'ceLabel':label, 
      'ceValue':window.performance.now(), 
      'ceCategory': "Dbg.TweenOverwritten", 
      'ceAction': window.pageid+" : "+overwritten.vars.data+" : "+overwriting.vars.data,
      'isInteractive': 0
    }); 
  }
}

window._LogTweenExecutionSeq = true;
function TweenStartOrComplete(twnobj, isStart, cback)
{
  if (cback)
    { cback(); }


  if ( _LogTweenExecutionSeq )
  {
    tweentgt = "None";
    if (twnobj && twnobj.target && twnobj.target.length>0)
    {
      tweentgt = "";
        for(var i=0; i<twnobj.target.length; i++)
        {
          tweentgt += twnobj.target[i].id+" ";
        }
    }

    console.log("Tween "+twnobj.data+" of Timeline "+twnobj.timeline.data+(isStart?" started":" completed")+" : "+window.performance.now()+" Tween: "+twnobj.data[0]+" TweenTarget(s): "+tweentgt);
    markR("Tween "+twnobj.data+" of Timeline "+twnobj.timeline.data+(isStart?" started":" completed")+" : "+window.performance.now()+" Tween: "+twnobj.data[0]+" TweenTarget(s): "+tweentgt);

    window["dataLayer"]=window["dataLayer"]||[];
    window["dataLayer"].push ({ 
      'event': 'CEvent', 
      'ceLabel':twnobj.timeline.data+" : "+twnobj.data+" : "+(isStart?"START":"FINISH"), 
      'ceValue':window.performance.now().toFixed(2), 
      'ceCategory': "TweenExecutionSeq", 
      'ceAction': window.pageid+" : "+tweentgt,
      'isInteractive': 0
    }); 
  }

}

window._LogTimelineExecutionSeq = true;
function TlineStartOrComplete(tmaxobj, isStart, cback, cbackParams)
{
  if (cback)
    { cback(cbackParams); }

  var logevent = function()  
  {
    tweenlbl = "None";
    var atweens = tmaxobj.getActive();
    if (atweens && atweens.length>0)
    {
      tweenlbl = "";
        for(var i=0; i<atweens.length; i++)
        {
          if (atweens[i].data && atweens[i].data.length>0)
            tweenlbl += atweens[i].data[0]+" ";
        }
    }

    console.log("Timeline "+tmaxobj.data+(isStart?" started":" completed")+" : "+window.performance.now()+"; Progress:"+tmaxobj.progress()+" TotalProgress:"+tmaxobj.totalProgress()+" atLabel: "+tmaxobj.currentLabel()+" atTime: "+tmaxobj.time()+" TotalTime(sofar): "+tmaxobj.totalTime()+" TotalDuration: "+tmaxobj.totalDuration()+" ActiveTweenLabels: "+tweenlbl);
    markR("Timeline "+tmaxobj.data+(isStart?" started":" completed")+" : "+window.performance.now()+"; Progress:"+tmaxobj.progress()+" TotalProgress:"+tmaxobj.totalProgress()+" atLabel: "+tmaxobj.currentLabel()+" atTime: "+tmaxobj.time()+" TotalTime(sofar): "+tmaxobj.totalTime()+" TotalDuration: "+tmaxobj.totalDuration()+" ActiveTweenLabels: "+tweenlbl);

    window["dataLayer"]=window["dataLayer"]||[];
    window["dataLayer"].push ({ 
      'event': 'CEvent', 
      'ceLabel':"", 
      'ceValue':window.performance.now(), 
      'ceCategory': "TimelineExecutionSeq", 
      'ceAction': window.pageid+" : "+tmaxobj.data+" : "+(isStart?"START":"FINISH"),
      'isInteractive': 0
    }); 
  }

  if ( _LogTimelineExecutionSeq )
    logevent();

  

}


function _LogPauseResume(isPause, tweenortimelineid)
{
    window["dataLayer"]=window["dataLayer"]||[];
    window["dataLayer"].push ({ 
      'event': 'CEvent', 
      'ceLabel':tweenortimelineid, 
      'ceValue':window.performance.now(), 
      'ceCategory': "TweenExecutionSeq", 
      'ceAction': window.pageid+" : "+(isPause?"PAUSE":"RESUME"),
      'isInteractive': 0
    }); 
}


///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////



var tweenclickActive = false;

window._clickCallbacks = null;
window._loadingImg = new Image();    
function startTween()
{
  try
  {
    if ((new ClientJS()).isIE() && (new ClientJS()).getBrowserMajorVersion() < 9)  {return;}

    try { if (TweenMax || TweenLite) {};  } 
    catch(e) 
    {
      markR("Tween not ready"); GTMpush("TweenNotReady");
      window.setTimeout("startTween()", 300);
      return;
    }

    TweenLite.onOverwrite = TweenLite_onOverwrite; //setup ONLY if TweenMax.js has been loaded.

    markR("Init tween");GTMpush("InitTween");    
    
    document.body.style.backgroundImage = "none"; //disable loading progress image.
    
    document.body.style.display='block';
    document.body.style.visibility='visible';

    document.body.onclick = function(e)
                            {
                              var eve = e || window.event;
                              x = eve.pageX || eve.clientX;
                              y = eve.pageY ||  eve.clientY;
                              markR("you clicked"+x + ' ' + y);
                              if (_clickCallbacks)
                                _clickCallbacks();
                              else
                                tweenclick();
                            }
    document.body.onmousemove = function(e)
                            {
                              try {
                              var eve = e || window.event;
                              x = eve.pageX || eve.clientX;
                              y = eve.pageY ||  eve.clientY;
                              if (window.tweenclickActive != true) 
                                animatecircleCall.callm(x,y); 
                            }catch(e){console.log(e);}
                            }
    tween4();

    var animatecircleCall = {
                              coordinates : [],
                              animatecircleCalltimeout : null,
                              callm : function(inx,iny) 
                                          {
                                            this.coordinates.push([x,y]); 
                                            if (this.coordinates.length == 1) 
                                            {
                                              this.animatecircleCalltimeout=window.setTimeout(this.tout.bind(this),500);
                                            } 
                                          },
                              tout : function() 
                                          {
                                            var xy = this.coordinates.pop();
                                            this.coordinates.length=0; 
                                            this.coordinates=[]; 
                                            window.clearTimeout(this.animatecircleCalltimeout);
                                            this.animateCircle(xy[0],xy[1]); 
                                          },
                              animateCircle : function (x,y)
                                          {
                                            centerX = (window.deviceProperty.browserWidth/2);
                                            centerY = (window.deviceProperty.browserHeight/2);

                                            mousedistanceFromCenterX = (Math.floor(x/centerX)?centerX-(x % centerX):(x % centerX));
                                            mousedistanceFromCenterY = (Math.floor(y/centerY)?centerY-(y % centerY):(y % centerY));
                                            var lval = ((mousedistanceFromCenterX<mousedistanceFromCenterY)?mousedistanceFromCenterX:mousedistanceFromCenterY);
                                            var ldval = ((mousedistanceFromCenterX<mousedistanceFromCenterY)?centerX:centerY);
                                            var sca1 = 1 + ((lval/ldval)/7);
                                            var sca2 = 1 + ((lval/ldval)/14);
                                            var yel = document.getElementById("LandingCiY");
                                            var bh = document.getElementById("LandingBH");
                                            var bl = document.getElementById("LandingLog");
                                            var b = document.getElementById("Landing");
                                            var scaleval = 1 + (mousedistanceFromCenterX<mousedistanceFromCenterY)?mousedistanceFromCenterX/centerX:mousedistanceFromCenterY/centerY;

                                            var distx = x/centerX;
                                            var disty = y/centerY;

                                            var offset = 90;
                                            var xoffset = (mousedistanceFromCenterX/centerX)*offset*(Math.floor(x/centerX)?-1:1);
                                            var yoffset = (mousedistanceFromCenterY/centerY)*offset*(Math.floor(y/centerY)?-1:1);
                                            markRed(centerX+","+centerY+" ("+mousedistanceFromCenterX+","+mousedistanceFromCenterY+") : ["+xoffset+","+yoffset+"] "+(lval/ldval) );
                                            
                                            //"inceptionTween"
                                            TweenMax.to([b],2.5,{scale:sca1, rotationX:(10 - (10*disty) ), rotationY:(-10 + (10*distx) ) });
                                          }      
                            };
      tweenclick();

  } catch(e) { markR("Exception:"+e); GTMpush("exception.startTween"); }
}

function highlightCTP()
{
    var svgicocover = document.getElementById("bottomlefticons"); 
    var tHighCTP = new TimelineMax( {data:["tHighCTP"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false], onStart:TlineStartOrComplete, onStartParams:["{self}", true]} );
    tHighCTP.to([svgicocover], 3,{delay:3, opacity:0.7})
            .to([svgicocover], 3,{opacity:0.2}, "+=3");
    // TweenLite.to(boxes, 5, {rotation:360, scale:2, left:"100px", transformOrigin:"50% 50%"});
}

window.tForeverCircleSpin = null;
function tween4()
{
  var yel= document.getElementById("LandingCiY");
  var bh = document.getElementById("LandingBH");

  tForeverCircleSpin = new TimelineMax( {data:["tForeverCircleSpin"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false], onStart:TlineStartOrComplete, onStartParams:["{self}", true]} );
  tForeverCircleSpin
                    .add("startSpin", 0)
                    .to(yel, 30, { rotation:360, ease:Linear.easeNone, repeat:-1 }, "startSpin")
                    .to(bh, 50, { rotation:-360, ease:Linear.easeNone, repeat:-1 }, "startSpin");

  markR("Spinning the world");
}


//window.repeatAdFns = [createKT, ads1, ads12];
window.repeatAdFns = [createKT, ITEvolution, ads1, ads2, ads3, ads4, ads5, ads6, ads7, ads8, ads9, ads10, ads11, ads12];
window.repeatAdCtr = 0;
window.tweenclickToggle = false;
function tweenclick()
{
  GTMpush("PlayTween.LogoClick", 1);



  // tweenclickToggle?MoveUp():_mgunText.createKT(); 
  // tweenclickToggle?MoveUp():StartFocusRectinLandingPgMgun(); 

  
  // tweenclickToggle?MoveUp():ITEvolution(); 
  // tweenclickToggle = !tweenclickToggle;

  if (repeatAdCtr >= repeatAdFns.length)
    {   repeatAdCtr = 0;  }
  repeatAdFns[repeatAdCtr++]();

}

function gettodx()
{
  var reqWd = deviceProperty.browserWidth ; 
  var mod = reqWd % 250;
  var rem = Math.floor(reqWd / 250);
  var todx = (mod>0)?250*(rem+1):reqWd;
  return todx;
}

function ads1()
{
  var focusrects = [[0,0,0,0],[1259,401,3867,2127],[0,0,3920,2613],[0,0,3920,2613]]; //the final element is image size at which the area points were generated.
  StartFocusRectinLandingPg("Ads.rediscoverit", "IMG/rediscoverit_"+gettodx()+".jpg", focusrects);   
}
function ads2()
{
  var focusrects = [[0,0,0,0],[701,213,3869,2487],[0,0,4908,2571],[0,0,4908,2571]]; 
  StartFocusRectinLandingPg("Ads.kickstartit", "IMG/kickstartit_"+gettodx()+".jpg", focusrects);   
}
function ads3()
{
  var focusrects = [[0,0,0,0],[659,281,3647,1847],[0,0,3900,2368],[0,0,3900,2368]]; 
  StartFocusRectinLandingPg("Ads.exploreit", "IMG/exploreit_"+gettodx()+".jpg", focusrects);   
}
function ads4()
{
  var focusrects = [[0,0,0,0],[859,289,2967,1427],[0,0,3008,1544],[0,0,3008,1544]]; 
  StartFocusRectinLandingPg("Ads.gameforit", "IMG/gameforit_"+gettodx()+".jpg", focusrects);   
}
function ads5()
{
  var focusrects = [[0,0,0,0],[129,413,2267,1527],[0,0,2507,1673],[0,0,2507,1673]]; 
  StartFocusRectinLandingPg("Ads.getreadyforit", "IMG/getreadyforit_"+gettodx()+".jpg", focusrects);   
}
function ads6()
{
  var focusrects = [[0,0,0,0],[529,17,2467,887],[0,0,2500,1244],[0,0,2500,1244]]; 
  StartFocusRectinLandingPg("Ads.gettothtopofIT", "IMG/gettothtopofIT_"+gettodx()+".jpg", focusrects);   
}
function ads7()
{
  var focusrects = [[0,0,0,0],[53,493,3067,1577],[0,0,3115,2079],[0,0,3115,2079]]; 
  StartFocusRectinLandingPg("Ads.highwaytakeit", "IMG/highwaytakeit_"+gettodx()+".jpg", focusrects);   
}
function ads8()
{
  var focusrects = [[0,0,0,0],[617,117,4093,2405],[0,0,5500,3273],[0,0,5500,3273]]; 
  StartFocusRectinLandingPg("Ads.itisallaboutyou", "IMG/itisallaboutyou_"+gettodx()+".jpg", focusrects);   
}
function ads9()
{
  var focusrects = [[0,0,0,0],[75,279,2101,1996],[0,0,3000,1996],[0,0,3000,1996]]; 
  StartFocusRectinLandingPg("Ads.launchit", "IMG/launchit_"+gettodx()+".jpg", focusrects);   
}
function ads10()
{
  var focusrects = [[0,0,0,0],[357,601,3413,3456],[0,0,3456,3456],[0,0,3456,3456]]; 
  StartFocusRectinLandingPg("Ads.stepuptoit", "IMG/stepuptoit_"+gettodx()+".jpg", focusrects);   
}
function ads11()
{
  var focusrects = [[0,0,0,0],[509,449,2825,1893],[0,0,2976,1947],[0,0,2976,1947]]; 
  StartFocusRectinLandingPg("Ads.swiminIT", "IMG/swiminIT_"+gettodx()+".jpg", focusrects);   
}
function ads12()
{
  var focusrects = [[0,0,0,0],[0,0,3599,1960],[0,0,3599,1960]]; 
  StartFocusRectinLandingPg("Ads.trainforit", "IMG/trainforit_"+gettodx()+".jpg", focusrects);   
}

function MoveUp()
{
  var focusrectsVert4 = [[0,0,0,0],[137,4744,1130,5382],[0,0,1164,5448],[201,44,1145,616],[0,0,1164,5448],[187,4034,1153,4493],[135,818,1005,1466],[281,3201,1022,3587],[267,1599,1098,2293],[673,2613,857,2728],[0,0,1164,5448]]; //combined4.jpg
  StartFocusRectinLandingPg("MoveUp", "IMG/combined5.jpg", focusrectsVert4);   
}


function ITEvolution()
{
  var reqHt = deviceProperty.browserHeight * 1.6; //approx max zoom required based on the focus rects.
  var mod = reqHt % 250;
  var rem = Math.floor(reqHt / 250);
  var tody = (mod>0)?250*(rem+1):reqHt;

  var focusrects = [[0,0,0,0],[21,17,675,159], [37,329,312,755],[285,233,577,760],[529,199,816,765],[777,18,1092,770],[0,0,1123,810]]; //the final element is image size at which the area points were generated.
  StartFocusRectinLandingPg("ITEvolution", "IMG/itevolution_"+tody+".jpg", focusrects);   
}

function StartFocusRectinLandingPg(imgdbgname, imgfilenamepath, focusrects)
{
  var lroot = document.getElementById("landingroot");
  var pstr = document.getElementById("poster");
  var im = document.getElementById("theim");

  var imgs = new Image();
  imgs.imageLoadTiming = window.performance.now();
  var dualcall =  new function()
                      {
                        this.ctr = 2;
                        this.call = function ()
                        {       
                          if (--this.ctr <= 0) 
                          {        
                            lroot.style.display = "none";
                            tForeverCircleSpin.pause();
                            document.body.style.backgroundImage = "none"; 

                            _focusRectAnimation.displayITrEvolution(backToLanding, imgs, focusrects); // invoke only if image load AND fade animation, BOTH, are completed. For eg on localhost image load completes instantly before the logo fades out.
                          }
                        }
                      };

  var backToLanding = function()
                      {
                        lroot.style.display = "block";
                        pstr.style.display = "none";                        
                        tForeverCircleSpin.resume();
                        tweenclickActive=true;
                        var tmx2 = GetFadeInFadeOut(false);
                        tmx2.play();
                        _clickCallbacks = null;
                      }

  imgs.onload = function()
                      {
                        var height = imgs.height;
                        var width = imgs.width;
                        dbgGTMpush('ImgTiming.'+imgdbgname,(window.performance.now() - imgs.imageLoadTiming)); 
                        dualcall.call();
                      }

  imgs.onerror = backToLanding; 

  imgs.src = imgfilenamepath; 
  im.src = imgs.src;
  dbgGTMpush('Dbg.ImageToLoad',extractFileName(imgs.src)); 
  tweenclickActive=true;
  var tmx1 = GetFadeInFadeOut(true);
  tmx1.tweenFromTo( "start",
                    "finish", 
                    { onComplete:function()
                                  {
                                    document.body.style.backgroundImage = "url('IMG/loading.gif')"; 
                                    dualcall.call();
                                  }
                    }
                  );
}


function GetFadeInFadeOut(boolFadeIn)
{
  var yel = document.getElementById("LandingCiY");
  var bl = document.getElementById("LandingLog");
  var bh = document.getElementById("LandingBH");
  var bt = document.getElementById("LandingTag");
  var b = document.getElementById("Landing");
  // var b0 = document.getElementById("Landing0");  
  var tp01 = document.getElementById("LandingTagPane01");
  var mt01 = document.getElementById("LandingBackgroundMsg01");
  var m01 = document.getElementById("LandingMsgPane01");
  var svgicos = document.getElementById("svgTechIcons_Layer_1"); 
  var blctp = document.getElementById("svgclickplaypauseContainer"); //dont use DIV id to avoid tween overwrite errors

  var tbigbangClick = new TimelineMax( { 
                          data:["FadeInFadeOut-"+boolFadeIn], 
                          onComplete:TlineStartOrComplete, 
                          onCompleteParams:["{self}", false, function(){tweenclickActive=false;}], 
                          onStart:TlineStartOrComplete, 
                          onStartParams:["{self}", true, function(){tweenclickActive=true;}], 
                          paused:true
                        } );
  var induration = 0.25; outduration = .25;
  
  if (boolFadeIn)
  {
    tbigbangClick
      .addLabel("start")
      .to([tp01, mt01, m01], 0, { opacity:0, force3D:true})
      .to(b, induration, { scale:1.4,  ease: Back.easeIn.config(1.4) }, 0)
      .to([yel, bl], induration, { scale:1.4, ease: Back.easeIn.config(1.4) }, 0)
      .addLabel("end")
      .to(b, outduration, { scale:1, ease: Back.easeOut.config(1.4) }, "end")
      .to([yel, bl], outduration, { scale:1, ease: Linear.easeNone }, "end")
      .addLabel("vanishLogo")
      .to([yel, bl, bt, bh, svgicos, blctp], 1, { opacity:0, force3D:true, ease: Linear.easeNone }, "vanishLogo")
      // .to(b0, 0.1, { scale:0.2, opacity:0, force3D:true, ease: Linear.easeNone }, "vanishLogo")
      .to(b, 1.5, { scale:1.5, opacity:0, force3D:true,  ease: Linear.easeNone }, "vanishLogo+=1.05")
      .addLabel("loadingblack2")
      .addLabel("finish")
  }
  else
  {
    tbigbangClick
      .addLabel("loadingblack")
      .to([b], 0, { scale:1, opacity:0, force3D:true,  ease: Linear.easeNone }, "loadingblack")
      // .to(b0, 1.0, { scale:1.5, opacity:0.3, force3D:true,  ease: Linear.easeNone }, "loadingblack+=.55")
      .to([yel, bh, bl, bt, svgicos, blctp], 0.9, { opacity:1, ease: Back.easeIn.config(1.4) }, "loadingblack+=1.5")
      .to(b, .1, { scale:1, ease: Linear.easeOut }, "loadingblack+=2.101")
      .to(b, 1.4, { opacity:1, ease: Linear.easeOut }, "loadingblack+=2.301")

    // tbigbangClick
    //   .addLabel("loadingblack")
    //   // .to([b], 0, { scale:1, opacity:0, force3D:true,  ease: Linear.easeNone }, "loadingblack")
    //   // .to(b0, 1.0, { scale:1.5, opacity:0.3, force3D:true,  ease: Linear.easeNone }, "loadingblack+=.55")
    //   // .to([yel, bh, bl, bt], .9, { opacity:1, ease: Back.easeIn.config(1.4) }, "loadingblack+=1.5")
    //   .fromTo([yel, bh, bl, bt], 0.9, {opacity:0}, {opacity:1}, "loadingblack+=1.5");

    // tbigbangClick
    //   .addLabel("loadingblack")
    //   .fromTo([b], 0, { scale:1.5, opacity:0, force3D:true,  ease: Linear.easeNone }, { scale:1, opacity:0, force3D:true,  ease: Linear.easeNone }, "loadingblack")
    //   .fromTo([yel, bh, bl, bt], 0.9, { opacity:0, ease: Back.easeIn.config(1.4), { opacity:1, ease: Back.easeIn.config(1.4) }, "loadingblack+=1.5")
    //   .fromTo(b, .1, { scale:1.5, ease: Linear.easeOut }, { scale:1, ease: Linear.easeOut }, "loadingblack+=2.101")
    //   .to(b, 1.4, { opacity:1, ease: Linear.easeOut }, "loadingblack+=2.301")
  }
  return tbigbangClick;
}


window._enableStepByStepNavigation = false;

window._focusRectAnimation = 
        {
          displayITrEvolution : function(cback, imgs, focusrects)
                {
                  var im = document.getElementById("theim");
                  var pstr = document.getElementById("poster");

                  pstr.style.display = "block";

                  tweenclickActive=true;                

                  // var focusrects = [[0,0,0,0],[21,17,675,159], [37,329,312,755],[285,233,577,760],[529,199,816,765],[777,18,1092,770],[0,0,1123,810]]; //the final element is image size at which the area points were generated.
                  var imgwidth=imgs.width; imageheight=imgs.height;

                  //recalculate for higher or lower resolution of actual image.
                  var ratiox = imgwidth/focusrects[focusrects.length-1][2]; ratioy = imageheight/focusrects[focusrects.length-1][3];
                  for(var iii=1; iii<focusrects.length; iii++) // assuming first is not required
                  {
                    focusrects[iii][0] = focusrects[iii][0]*ratiox;
                    focusrects[iii][2] = focusrects[iii][2]*ratiox;
                    focusrects[iii][1] = focusrects[iii][1]*ratioy;
                    focusrects[iii][3] = focusrects[iii][3]*ratioy;
                  }

                  var recti = focusrects.length-1; 
                  var focusrectxleft=focusrects[recti][0], focusrectyleft=focusrects[recti][1], focusrectxright=focusrects[recti][2], focusrectyright=focusrects[recti][3];
                  var frx=focusrectxleft+Math.round((focusrectxright-focusrectxleft)/2); fry=focusrectyleft+Math.round((focusrectyright-focusrectyleft)/2);
                  var wc=Math.round(deviceProperty.browserWidth/2); hc=Math.round(deviceProperty.browserHeight/2);
                  var designedfor = focusrectyright-focusrectyleft;
                  var widthOfViewport = deviceProperty.browserHeight; 
                  var scaleto1 = widthOfViewport/designedfor;
                        designedfor = focusrectxright-focusrectxleft;
                        widthOfViewport = deviceProperty.browserWidth; 
                  var scaleto2 = widthOfViewport/designedfor;
                  var scaleto = (scaleto1<scaleto2)?scaleto1:scaleto2;

                  var tbigbangClick = new TimelineMax( {  data:["tbigbangClick"], 
                                                          onComplete:TlineStartOrComplete, 
                                                          onCompleteParams:["{self}", false, function(){hideimage.play();}], 
                                                          onStart:TlineStartOrComplete, 
                                                          onStartParams:["{self}", true], 
                                                          paused:true 
                                                        } );

                  var showimage = new TimelineMax( {  data:["showimage"], 
                                                      onComplete:TlineStartOrComplete, 
                                                      onCompleteParams:["{self}", false], 
                                                      onStart:TlineStartOrComplete, 
                                                      onStartParams:["{self}", true], 
                                                      paused:true 
                                                    } );

                  var hideimage = new TimelineMax( {  data:["hideimage"], 
                                                      onComplete:TlineStartOrComplete, 
                                                      onCompleteParams:["{self}", false, cback], 
                                                      onStart:TlineStartOrComplete, 
                                                      onStartParams:["{self}", true], 
                                                      paused:true 
                                                    } );

                  showimage
                      .add(this.getDummyTween(1))
                      .to( [im], 0, { data:["first1","1"], 
                                      onComplete:TweenStartOrComplete, 
                                      onCompleteParams:["{self}", false], 
                                      onStart:TweenStartOrComplete, 
                                      onStartParams:["{self}", true], 
                                      scale:1, 
                                      transformOrigin:"top left" 
                                    })

                      .to( [im], 3, { data:["scalechanger"], 
                                      onComplete:TweenStartOrComplete, 
                                      onCompleteParams:["{self}", false], 
                                      onStart:TweenStartOrComplete, 
                                      onStartParams:["{self}", true], 
                                      scale:scaleto, 
                                      x:-(frx*scaleto-wc), 
                                      y:-(fry*scaleto-hc)
                                    }, 
                          "step1")

                      .to( [im], 5, { data:["opacitychanger"], 
                                      onComplete:TweenStartOrComplete, 
                                      onCompleteParams:["{self}", false, function(){ tbigbangClick.play(); }], 
                                      onStart:TweenStartOrComplete, 
                                      onStartParams:["{self}", true, function(){}], 
                                      opacity:1, 
                                      force3D:true
                                    }, 
                          "step1+=0");

                  hideimage
                      .to([im],5, { data:["opacitychanger"], 
                                    onComplete:TweenStartOrComplete, 
                                    onCompleteParams:["{self}", false, function(){/*tbigbangClick.play();*/}], 
                                    onStart:TweenStartOrComplete, 
                                    onStartParams:["{self}", true, function(){}], 
                                    opacity:0, 
                                    force3D:true
                                  });

                  var pauseInbetween, resumeInbetween, toggle;
                  if (_enableStepByStepNavigation)
                  {
                    pauseInbetween = function () {
                                                    tbigbangClick.pause();
                                                    _LogPauseResume(true, tbigbangClick.data);
                                                  }
                    resumeInbetween = function () {
                                                    tbigbangClick.play();
                                                    _LogPauseResume(false, tbigbangClick.data);
                                                  }
                  }
                  else
                  {                        
                    toggle = false;
                    resumeInbetween = function () {
                                                    if (toggle)
                                                    {
                                                      tbigbangClick.play();
                                                      _LogPauseResume(false, tbigbangClick.data);
                                                    }
                                                    else
                                                    {
                                                      tbigbangClick.pause();
                                                      _LogPauseResume(true, tbigbangClick.data);
                                                    }                            
                                                    toggle = !toggle;
                                                  }
                    pauseInbetween = null;
                  }
  
                  _clickCallbacks = resumeInbetween; 

                  for(var recti=1; recti<focusrects.length; recti++)
                      { tbigbangClick.add(this.getTimeline(focusrects, recti, pauseInbetween, im)); }
                  tbigbangClick.add(this.getDummyTween(1));

                  showimage.play();
                },

          getDummyTween : function(seconds)
                {
                  var ctr = {val:0};
                  var thetimeline = new TimelineMax( {data:["dummytween"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false], onStart:TlineStartOrComplete, onStartParams:["{self}", true]} );
                  thetimeline.to(ctr, seconds, {val:1});
                  return thetimeline;
                },

          getTimeline : function(focusrects, recti, pauseInbetween, im)
                {
                    var focusrectxleft=focusrects[recti][0], focusrectyleft=focusrects[recti][1], focusrectxright=focusrects[recti][2], focusrectyright=focusrects[recti][3];
                    var frx=focusrectxleft+Math.round((focusrectxright-focusrectxleft)/2); fry=focusrectyleft+Math.round((focusrectyright-focusrectyleft)/2);
                    var wc=Math.round(deviceProperty.browserWidth/2); hc=Math.round(deviceProperty.browserHeight/2);

                    var designedfor = focusrectyright-focusrectyleft;
                    var widthOfViewport = deviceProperty.browserHeight; 
                    var scaleto1 = widthOfViewport/designedfor;

                    designedfor = focusrectxright-focusrectxleft;
                    widthOfViewport = deviceProperty.browserWidth; 
                    var scaleto2 = widthOfViewport/designedfor;

                    var scaleto = (scaleto1<scaleto2)?scaleto1:scaleto2;

                    var midscaleto = 1;

                    //bounding rectangle
                    var bxtop = Math.min(focusrects[recti-1][0], focusrects[recti-1][2], focusrects[recti][0], focusrects[recti][2]);
                    var bytop = Math.min(focusrects[recti-1][1], focusrects[recti-1][3], focusrects[recti][1], focusrects[recti][3]);
                    var bxbottom = Math.max(focusrects[recti-1][0], focusrects[recti-1][2], focusrects[recti][0], focusrects[recti][2]);
                    var bybottom = Math.max(focusrects[recti-1][1], focusrects[recti-1][3], focusrects[recti][1], focusrects[recti][3]);
                    var xd = Math.abs(bxtop-bxbottom);
                    var yd = Math.abs(bytop-bybottom);
                          var midscaleto1 = deviceProperty.browserWidth/xd;
                          var midscaleto2 = deviceProperty.browserHeight/yd;
                          var midscaleto = (midscaleto1<midscaleto2)?midscaleto1:midscaleto2;
                    var frxm=bxtop+xd/2; 
                    var frym=bytop+yd/2;

                    var thetimeline = new TimelineMax( {  data:["focusrectTL"+recti], 
                                                          onComplete:TlineStartOrComplete, 
                                                          onCompleteParams:["{self}", false, pauseInbetween], 
                                                          onStart:TlineStartOrComplete, 
                                                          onStartParams:["{self}", true]} 
                                                        );

                    var speed="5.5";
                    thetimeline.to( [im], 
                                    speed, 
                                    { 
                                      data:["focusrectTN"+recti], 
                                      onComplete:TweenStartOrComplete, 
                                      onCompleteParams:["{self}", false], 
                                      onStart:TweenStartOrComplete, 
                                      onStartParams:["{self}", true], 
                                      scale:scaleto, 
                                      x:-(frx*scaleto-wc), 
                                      y:-(fry*scaleto-hc), 
                                      ease:Power4.easeOut 
                                    });

                    return thetimeline;
                }
        };



texts = [
    [5.0, "There is a War going On..."], /*  mate sc */
    [0.7, "a"],
    [1.5, "War"],
    [0.7, "for"],
    [2.0, "Talent"],
    [1.5, " "],
    // [5.0, "A war for Talent"],
    // [5.0, "and, This is Your battle"],
    // [5.0, "the Question is..."],
    [1.5, "So,"],
    [1.0, "What"],
    [0.7, "is"],
    [5.0, "Your battle plan ?"]
    // [5.0, "So, are you ready/(trained enough/well) for this battle?"],
    // [2.9, "So, what is your plan to win Your battle?"]  /*yesteryear looks good here*/
    // [9.9, "and your plan to win your battle is by flaunting your degree certificate? "]  /*when the time comes for you to face the battle / you are going to face a battle for talent. at the cusp of battle*/
    ];

t1exts = [
    [5.0, "There is a War going On..."], /*  mate sc */
    // [2.5, " "],
    [2.0, "A war"],
    // [1.0, "war"],
    // [1.0, "for"],
    [2.0, "for Talent"],
    // [5.0, "A war for Talent"],
    // [5.0, "and, This is Your battle"],
    // [5.0, "the Question is..."],
    [1.0, "are"],
    [1.0, "YOUyou"],
    [5.0, "Battle Ready ?"]
    // [5.0, "So, are you ready/(trained enough/well) for this battle?"],
    // [2.9, "So, what is your plan to win Your battle?"]  /*yesteryear looks good here*/
    // [9.9, "and your plan to win your battle is by flaunting your degree certificate? "]  /*when the time comes for you to face the battle / you are going to face a battle for talent. at the cusp of battle*/
    ];

window._g_createKT_FirstTime = true;
function createKT()
{
  var lroot = document.getElementById("landingroot");
  var pstr = document.getElementById("poster");
  var cover = document.getElementById('cover');

  tweenclickActive=true;
  _clickCallbacks = function(){};

  var getDummyTween = function(seconds)
                {
                  var ctr = {val:0};
                  var thetimeline = new TimelineMax( {data:["dummytween"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false], onStart:TlineStartOrComplete, onStartParams:["{self}", true]} );
                  thetimeline.to(ctr, seconds, {val:1});
                  return thetimeline;
                }

  var backToLanding = function()
                      {
                        if (window._g_createKT_FirstTime)
                        {
                          lroot.style.display = "block";
                          var btl = "";
                          btl = new TimelineMax( { data:["warplanKTShowLanding"], 
                                                  onComplete:TlineStartOrComplete, 
                                                  onCompleteParams:["{self}", false], 
                                                  onStart:TlineStartOrComplete, 
                                                  onStartParams:["{self}", true],
                                                 }
                                              ); 
                          btl.to(lroot, 5, {opacity:1});
                          window._g_createKT_FirstTime = false;
                          highlightCTP();
                        }
                        else
                        {
                          var tmx2 = GetFadeInFadeOut(false);
                          tmx2.play();
                        }
                        pstr.style.display = "none";                        
                        cover.style.display = "none";                        
                        tForeverCircleSpin.resume();
                        tweenclickActive=false;
                        _clickCallbacks = null;
                      }

  var whatsyourplan = function()
                      {
                        var tl = "";
                        tl = new TimelineMax( { data:["warplanKT"], 
                                                onComplete:TlineStartOrComplete, 
                                                onCompleteParams:["{self}", false, backToLanding], 
                                                onStart:TlineStartOrComplete, 
                                                onStartParams:["{self}", true],
                                                delay:0.6}
                                            ); 
                        var time = 0, word, element, duration, i;
                        var container = document.getElementById('texter');

                        var fz = window.deviceProperty.browserWidth * (70/900) + "px";

                        tl.to([cover], 2, {backgroundColor:"#111"}, time);
                        for(i = 0; i < texts.length; i++)
                        {
                            var word = texts[i][1];

                            element = document.createElement("h3");
                            container.appendChild(element);
                            element.appendChild(document.createTextNode(word));
                            element.style[ "font-size" ] = fz; 
                          

                            duration = Math.max(texts[i][0], word.length * 0.05); //longer words take longer to read, so adjust timing. Minimum of 0.5 seconds.
                            // tl.to([element], duration, {x:500, y:500,  ease:SlowMo.ease.config(0.25, 0.9)}, time)
                            TweenLite.set([element], {autoAlpha:0, scale:0, z:0.01});
                            TweenLite.set([element], {xPercent:-50, yPercent:-50} );
                            tl.to([element], duration, {scale:1.2,  ease:SlowMo.ease.config(0.25, 0.9)}, time)
                              // .to([element], duration, {borderRightWidth:30}, time)
                              // .to([element], duration, {borderLeftWidth:30}, time)
                              .fromTo([element], duration, {lineHeight:"90%", ease:Back.easeInOut}, {lineHeight:"104%", ease:Back.easeInOut}, time)
                              .to([element], duration, {autoAlpha:1, ease:SlowMo.ease.config(0.25, 0.9, true)}, time);
                        
                            time += duration - 0.05;

                        }
                        tl.add(getDummyTween(1));
                        tl.to([cover], 2, {backgroundColor:"#000000", ease: Circ.easeIn}, time);
                        
                        cover.style.display = "table";
                      }
  tForeverCircleSpin.pause();
  if (window._g_createKT_FirstTime)
  {
      whatsyourplan();
  }
  else
  {
    var tmx1 = GetFadeInFadeOut(true);
    tmx1.tweenFromTo( "start",
                      "finish", 
                      { onComplete:function()
                                    {
                                      // document.body.style.backgroundImage = "url('IMG/loading.gif')"; 
                                      whatsyourplan();
                                    }
                      }
                    );
  }

}
