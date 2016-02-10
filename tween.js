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

window._LogTweenExecutionSeq = false;
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
      window.setTimeout("startTween()", 3100);
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
                              var eve = e || window.event;
                              x = eve.pageX || eve.clientX;
                              y = eve.pageY ||  eve.clientY;
                              if (window.tweenclickActive != true) 
                                animatecircleCall.callm(x,y);
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
  } catch(e) { markR("Exception:"+e); GTMpush("exception.startTween"); }
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


window.tweenclickToggle = false;
function tweenclick()
{
  GTMpush("PlayTween.LogoClick", 1);

  tweenclickToggle?MoveUp():ITEvolution(); 
  tweenclickToggle = !tweenclickToggle;
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

  var tbigbangClick = new TimelineMax( { paused:true, onStart: function(){tweenclickActive=true;} , onComplete: function(){tweenclickActive=false;} } );
  
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
      .to([yel, bl, bt, bh], 1, { opacity:0, force3D:true, ease: Linear.easeNone }, "vanishLogo")
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
      .to([yel, bh, bl, bt], 0.9, { opacity:1, ease: Back.easeIn.config(1.4) }, "loadingblack+=1.5")
      .to(b, .1, { scale:1, ease: Linear.easeOut }, "loadingblack+=2.101")
      .to(b, 1.4, { opacity:1, ease: Linear.easeOut }, "loadingblack+=2.301")
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



