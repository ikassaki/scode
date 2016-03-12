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
      'ceValue':window.performance.now(), 
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
    
    document.body.style.display='block';
    document.body.style.visibility='visible';
    document.body.style.backgroundImage = "none"; //disable loading progress image.

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
                              // markR("mouse moved"+x + ' ' + y);
                              animateCircle(x,y);
                            }

    tween4();

    // if ('ontouchstart' in document.documentElement || 'ontouchstart' in document.documentElement ||  (navigator.maxTouchPoints > 0) ||  (navigator.msMaxTouchPoints > 0))
    // {  document.ontouchend = function () {markR("you touch the screen");  /*if (_clickCallbacks) {_clickCallbacks();} else  {tweenclick();} */ }    }


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


function tweenclick()
{
  GTMpush("PlayTween.LogoClick", 1);

  ITEvolution(); 
}


var randomTween = null;
function animateCircle(x,y)
{
  if (tweenclickActive == true) return;

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


function GetFadeInFadeOut(boolFadeIn)
{
  var yel = document.getElementById("LandingCiY");
  var bl = document.getElementById("LandingLog");
  var bh = document.getElementById("LandingBH");
  var bt = document.getElementById("LandingTag");
  var b = document.getElementById("Landing");
  var b0 = document.getElementById("Landing0");  
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
      .to(b0, 0.1, { scale:0.2, opacity:0, force3D:true, ease: Linear.easeNone }, "vanishLogo")
      .to(b, 1.5, { scale:1.5, opacity:0, force3D:true,  ease: Linear.easeNone }, "vanishLogo+=1.05")
      .addLabel("loadingblack2")
      .addLabel("finish")
  }
  else
  {
    tbigbangClick
      .addLabel("loadingblack")
      .to([b, b0], 0, { scale:1, opacity:0, force3D:true,  ease: Linear.easeNone }, "loadingblack")
      .to(b0, 1.0, { scale:1.5, opacity:0.3, force3D:true,  ease: Linear.easeNone }, "loadingblack+=.55")
      .to([yel, bh, bl, bt], 0.9, { opacity:1, ease: Back.easeIn.config(1.4) }, "loadingblack+=1.5")
      .to(b, .1, { scale:1, ease: Linear.easeOut }, "loadingblack+=2.101")
      .to(b, 1.4, { opacity:1, ease: Linear.easeOut }, "loadingblack+=2.301")
  }
  return tbigbangClick;
}




function ITEvolution()
{
  var imgs = new Image();
  var dualcall =  new function()
  {
    this.ctr = 2;
    this.call = function ()
    { 
      if (--this.ctr <= 0) 
      {        
        var lroot = document.getElementById("landingroot");
        lroot.style.display = "none";
        tForeverCircleSpin.pause();

        displayITEvolution(// invoke only if image load AND fade animation, BOTH, are completed. For eg on localhost image load completes instantly before the logo fades out.
          function(){
            var lroot = document.getElementById("landingroot");
            lroot.style.display = "block";
            tForeverCircleSpin.resume();
            tweenclickActive=true;
            var tmx2 = GetFadeInFadeOut(false);
            tmx2.play();
            _clickCallbacks = null;
          });
      }
    }
  };


  imgs.onload = function()
  {
    var height = imgs.height;
    var width = imgs.width;
    dualcall.call();
  }

  imgs.src = "takefull3.jpg";
  var im = document.getElementById("theim");
  im.src = "takefull3.jpg";

  tweenclickActive=true;
  var tmx1 = GetFadeInFadeOut(true);
  tmx1.tweenFromTo("start","finish", {onComplete:function(){dualcall.call();}});
}



window._enableStepByStepNavigation = true;
function displayITEvolution(cback)
{
  var im = document.getElementById("theim");
  var pstr = document.getElementById("poster");

  pstr.style.display = "block";

  tweenclickActive=true;
  
  this.getTimeline = function (focusrects, recti)
                    {


                        var focusrectxleft=focusrects[recti][0], focusrectyleft=focusrects[recti][1], focusrectxright=focusrects[recti][2], focusrectyright=focusrects[recti][3];
                        // var focusrectxleft=352, focusrectyleft=4294, focusrectxright=670, focusrectyright=4570;
                          markRed("iteration:"+recti+"  rectangle to focus on: "+focusrectxleft+","+focusrectyleft+" - "+focusrectxright+","+focusrectyright);
                        var frx=focusrectxleft+Math.round((focusrectxright-focusrectxleft)/2); fry=focusrectyleft+Math.round((focusrectyright-focusrectyleft)/2);
                          markRed("iteration:"+recti+"  Rectangle centerpoint: "+frx+" "+fry);
                        var wc=Math.round(deviceProperty.browserWidth/2); hc=Math.round(deviceProperty.browserHeight/2);
                        // frx-=wc; fry-=hc;
                          markRed("iteration:"+recti+"  Move to:"+(frx-wc)+" "+(fry-hc));



                        //        var designedfor = focusrectyright-focusrectyleft;
                        //      var widthOfViewport = height; 
                        //       if ((focusrectxright-focusrectxleft) > (focusrectyright-focusrectyleft)) //width > height. landscape
                        //       {
                        //       var designedfor = focusrectxright-focusrectxleft;
                        //       var widthOfViewport = width; 
                        //       }
                        //       var scaleto = widthOfViewport/designedfor;
                        // markRed("scaleto: "+scaleto);


                                var designedfor = focusrectyright-focusrectyleft;
                              var widthOfViewport = deviceProperty.browserHeight; 
                              var scaleto1 = widthOfViewport/designedfor;
                        markRed("iteration:"+recti+"  scaleto1: "+scaleto1);

                              designedfor = focusrectxright-focusrectxleft;
                              widthOfViewport = deviceProperty.browserWidth; 
                              var scaleto2 = widthOfViewport/designedfor;
                        markRed("iteration:"+recti+"  scaleto2: "+scaleto2);

                              var scaleto = (scaleto1<scaleto2)?scaleto1:scaleto2;
                        markRed("iteration:"+recti+"  scaleto: "+scaleto);

                        // var scaledifference = prevscaleto - scaleto;
                        // var minreqscaledifferential = 0.5;
                        // minreqscaledifferential = (minreqscaledifferential>scaledifference)?minreqscaledifferential:scaledifference;
                        var midscaleto = 1;
                        // midscaleto = prevscaleto - (minreqscaledifferential/2);


                        // 1. mid point rect1
                        // 2. mid point rect2
                        // 3. x diff, y diff (use math.abs)


                        // //[0,0,0,0],[415, 8109,989,8387]
                        // var mptPrevx = focusrects[recti-1][0] + focusrects[recti-1][2] - focusrects[recti-1][0];
                        // var mptPrevy = focusrects[recti-1][1] + focusrects[recti-1][3] - focusrects[recti-1][1];
                        // var mptCurx = focusrects[recti][0] + focusrects[recti][2] - focusrects[recti][0];
                        // var mptCury = focusrects[recti][1] + focusrects[recti][3] - focusrects[recti][1];
                        // var xd = Math.abs(mptPrevx-mptCurx);
                        // var yd = Math.abs(mptPrevy-mptCury);
                        //       var midscaleto1 = width/xd;
                        //       var midscaleto2 = height/yd;
                        //       var midscaleto = (midscaleto1<midscaleto2)?midscaleto1:midscaleto2;
                        // var frxm=((mptPrevx<mptCurx)?mptPrevx:mptCurx)+xd/2; 
                        // var frym=((mptPrevy<mptCury)?mptPrevy:mptCury)+yd/2;




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





                        markR("iteration:"+recti+"  xd yd: "+xd+","+yd);

                        markR("iteration:"+recti+"  ms1 ms2: "+midscaleto1+","+midscaleto2);

                        markR("iteration:"+recti+"  midscaleto: "+midscaleto);

                        var thetimeline = new TimelineMax( {data:["focusrectTL"+recti], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false, pauseInbetween], onStart:TlineStartOrComplete, onStartParams:["{self}", true]} );

                        if (true)
                        {
                            var speed="5.5";

                            // equivalent of using transformOrigin
                            thetimeline
                            // .to(im, speed, { scale:midscaleto, x:-(frxm*midscaleto-wc), y:-(frym*midscaleto-hc), ease:Power0.easeNone })   // Excellent and works
                            // .set({}, {}, "+=1") // inserting a delay... http://greensock.com/forums/topic/9856-inserting-a-pausedelaywait-into-timeline/
                            .to([im], speed, { data:["focusrectTN"+recti], onComplete:TweenStartOrComplete, onCompleteParams:["{self}", false], onStart:TweenStartOrComplete, onStartParams:["{self}", true], scale:scaleto, x:-(frx*scaleto-wc), y:-(fry*scaleto-hc), ease:Power4.easeOut })   // Excellent and works
                            .set({}, {}, "+=2"); // inserting a delay... http://greensock.com/forums/topic/9856-inserting-a-pausedelaywait-into-timeline/

                        }
                        else
                        {
                            var speed="2.5";
                            // thetimeline.addLabel("start"+recti)
                            // .to(im, speed, { scale:1}, "start"+recti+"+=0")
                            // .to(im, speed, { x:-(frx-wc), y:-(fry-hc) }, "start"+recti)
                            // .to(im, speed, { scale:scaleto, transformOrigin:frx+"px "+fry+"px"}, "start"+recti+"+="+speed)

                            thetimeline.addLabel("start"+recti)
                            .to(im, speed, { scale:1}, "start"+recti+"+=0")
                            .to(im, speed, { x:-(frx-wc), y:-(fry-hc) }, "start"+recti)
                            .to(im, speed, { scale:scaleto, transformOrigin:frx+"px "+fry+"px"}, "start"+recti+"+="+speed)

                        }
                            // Expo is better when the scale/zoom changes too much between steps.
                            // Sine is more smoother but appears drastic when zoom diff is high between steps
                            

                        prevscaleto = scaleto;

                        return thetimeline;

                    }

  var imgs = new Image();
  imgs.src = "takefull3.jpg";//"takefull3.jpg";

  var focusrects = [[0,0,0,0],[21,17,675,159], [37,329,312,755],[285,233,577,760],[529,199,816,765],[777,18,1092,770],[0,0,1123,810]]; //the final element is image size at which the area points were generated.
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

  var recti = focusrects.length-1; var prevscaleto = 1;
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

  var tbigbangClick = new TimelineMax( { data:["tbigbangClick"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false, function(){hideimage.play();}], onStart:TlineStartOrComplete, onStartParams:["{self}", true], paused:true } );
  var showimage = new TimelineMax( { data:["showimage"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false], onStart:TlineStartOrComplete, onStartParams:["{self}", true], paused:true } );
  var hideimage = new TimelineMax( { data:["hideimage"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false, cback], onStart:TlineStartOrComplete, onStartParams:["{self}", true], paused:true } );

  showimage.to([im], 0, { data:["first1","1"], onComplete:TweenStartOrComplete, onCompleteParams:["{self}", false], onStart:TweenStartOrComplete, onStartParams:["{self}", true], scale:1, transformOrigin:"top left" } )
      .to([im],3, {data:["scalechanger"], onComplete:TweenStartOrComplete, onCompleteParams:["{self}", false], onStart:TweenStartOrComplete, onStartParams:["{self}", true], scale:scaleto, x:-(frx*scaleto-wc), y:-(fry*scaleto-hc)}, "step1")
      .to([im],5, {data:["opacitychanger"], onComplete:TweenStartOrComplete, onCompleteParams:["{self}", false, function(){tbigbangClick.play();}], onStart:TweenStartOrComplete, onStartParams:["{self}", true, function(){console.log('\t\tactual callback');}], opacity:1, force3D:true}, "step1+=0");

  hideimage
      .to([im],5, {data:["opacitychanger"], onComplete:TweenStartOrComplete, onCompleteParams:["{self}", false, function(){/*tbigbangClick.play();*/}], onStart:TweenStartOrComplete, onStartParams:["{self}", true, function(){console.log('\t\tactual callback');}], opacity:0, force3D:true});


  if (_enableStepByStepNavigation)
  {
    this.pauseInbetween = function ()
                          {
                              // debugger;
                              // alert("press any key to continue");
                              tbigbangClick.pause();
                              _LogPauseResume(true, tbigbangClick.data);
                          }
    this.resumeInbetween = function ()
                          {
                              // debugger;
                              // alert("press any key to continue");
                              tbigbangClick.play();
                              _LogPauseResume(false, tbigbangClick.data);
                          }
  }
  else
  {                        
    this.toggle = false;
    this.resumeInbetween = function ()
                          {
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
    this.pauseInbetween = null;
    }
  _clickCallbacks = resumeInbetween; 

  for(var recti=1; recti<focusrects.length; recti++)
  {
    tbigbangClick.add(getTimeline(focusrects, recti));
  }
  tbigbangClick.add(getDummyTween());

  showimage.play();
}



function getDummyTween()
{
    var ctr = {val:0};
    var thetimeline = new TimelineMax( {data:["dummytween"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false], onStart:TlineStartOrComplete, onStartParams:["{self}", true]} );
    thetimeline.to(ctr, 1, {val:1});
    return thetimeline;
}