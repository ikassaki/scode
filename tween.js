///////////////////////////////////////////////////////////////////////////
///////////////////////TWEEN HELPER DEBUG//////////////////////////////////
///////////////////////////////////////////////////////////////////////////


window._LogDbgTweenOverwritten = true;
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

    GTMcEvent("Dbg.TweenOverwritten", window.pageid+" : "+overwritten.vars.data+" : "+overwriting.vars.data, label, window.performance.now(), 0);
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

    GTMcEvent('TweenExecutionSeq', window.pageid+" : "+tweentgt, twnobj.timeline.data+" : "+twnobj.data+" : "+(isStart?"START":"FINISH"), window.performance.now().toFixed(2), 0);
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

    GTMcEvent('TimelineExecutionSeq', (window.pageid+" : "+tmaxobj.data+" : "+(isStart?"START":"FINISH")), "atLabel:"+tweenlbl, window.performance.now(), 0);
  }

  if ( _LogTimelineExecutionSeq )
    logevent();
}


function _LogPauseResume(isPause, tweenortimelineid)
{
    GTMcEvent('TweenExecutionSeq', window.pageid+" : "+(isPause?"PAUSE":"RESUME"), tweenortimelineid, window.performance.now(), 1);
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
window.repeatAdFns = [ noTweensOnPageLoad, createKT, ITEvolution, ads1, ads2, ads3, ads4, ads5, ads6, ads7, ads8, ads9, ads10, ads11, ads12];
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
                        GTMpushImgTiming(imgdbgname,(window.performance.now() - imgs.imageLoadTiming)); 
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
  
  if (boolFadeIn) //hide logo and born for it msg.
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
      .addLabel("start")
      .addLabel("loadingblack")
      .to([b], 0, { scale:1, opacity:0, force3D:true,  ease: Linear.easeNone }, "loadingblack")
      // .to(b0, 1.0, { scale:1.5, opacity:0.3, force3D:true,  ease: Linear.easeNone }, "loadingblack+=.55")
      .to([yel, bh, bl, bt, svgicos, blctp], 0.9, { opacity:1, ease: Back.easeIn.config(1.4) }, "loadingblack+=1.5")
      .to(b, .1, { scale:1, ease: Linear.easeOut }, "loadingblack+=2.101")
      .to(b, 1.4, { opacity:1, ease: Linear.easeOut }, "loadingblack+=2.301")
      .addLabel("finish")

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

                  var tbigbangClick = new TimelineMax( {  data:["focusRectAnim"], 
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
    // [1.5, "So,"],
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


// texts = [ 0, "hi"
// ];

window._g_createKT_FirstTime = true; //whether logo and born to command it etc have been shown.
function noTweensOnPageLoad()
{
  tweenclickActive=true;
  _clickCallbacks = function(){};
  var lroot = document.getElementById("landingroot");
  var pstr = document.getElementById("poster");
  var cover = document.getElementById('cover');

  
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
}


function createKT()
{

  tweenclickActive=true;
  _clickCallbacks = function(){};

  var getDummyTween = function(seconds)
                {
                  var ctr = {val:0};
                  var thetimeline = new TimelineMax( {data:["dummytween"], onComplete:TlineStartOrComplete, onCompleteParams:["{self}", false], onStart:TlineStartOrComplete, onStartParams:["{self}", true]} );
                  thetimeline.to(ctr, seconds, {val:1});
                  return thetimeline;
                }

    var backToLanding = function() {  noTweensOnPageLoad();  }
/*    var backToLanding1 = function()
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
*/
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

window.g_MenushowTgl = false;
window.g_MenuSelectedDialogToBeDisplayed = false;
  function showMenu (tobj)
  {
      var menuDivName = "centralmenu";
      document.getElementById("pageContent").style.display = "none";
    if (window.g_MenushowTgl)
    {
        document.getElementById(menuDivName).innerHTML = "";
        document.getElementById(menuDivName).style.display="none";

        if (null != tobj) // if a mouse event was passed, then its for dismissal of menu without menu selection.
        {
          tForeverCircleSpin.resume();
          document.getElementById("LandingTag").style.display="block";
          document.getElementById("LandingCiY").style.display="block";
          document.getElementById("LandingLog").style.display="block";
        }
        _clickCallbacks = null;
    }
    else
    {    
        var cmenuhtml = constructMenuHollow(menuDivName, [  
                                               {svgscriptid:"svgPROGRAMicon", svgWd:100, svgHt:100, fncall:"menuCalls.showProgramScreen"} , 
                                               {svgscriptid:"svgAPPLYicon", svgWd:100, svgHt:100, fncall:"menuCalls.showApplyScreen"} , 
                                               {svgscriptid:"svgFAQicon", svgWd:100, svgHt:100, fncall:"menuCalls.showFAQScreen"} , 
                                               {svgscriptid:"svgFEEDBACKicon", svgWd:100, svgHt:100, fncall:"menuCalls.showFeedbackScreen"},
                                               {svgscriptid:"svgPARTNERicon", svgWd:100, svgHt:100, fncall:"menuCalls.showPartnersScreen"} ,
                                               {svgscriptid:"svgCONTACTUSINVERTEDicon", svgWd:150, svgHt:150, fncall:"menuCalls.showContactUsScreen"} , 
                                               {svgscriptid:"svgLOGINicon", svgWd:100, svgHt:100, fncall:"menuCalls.showLoginScreen"} 
                        ] );

        document.getElementById(menuDivName).style.display="block";
        document.getElementById(menuDivName).innerHTML = cmenuhtml;
  
    
      console.log(document.getElementById(menuDivName).outerHTML);

        //http://codepen.io/anon/pen/AkoGx?editors=1010
        //http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
        //document.getElementById("arc2").setAttribute("d", describeArc(250, 300, 150, 0, 180));
        //tweenclickActive = true;
        tForeverCircleSpin.pause();
        document.getElementById("LandingTag").style.display="none";
        document.getElementById("LandingCiY").style.display="block";
        document.getElementById("LandingLog").style.display="block";
        _clickCallbacks = function(){};
        _clickCallbacks = showMenu;
    }
    window.g_MenushowTgl = !window.g_MenushowTgl;
  }



 function constructMenuHollow(menuDivName, icons)
 {
  //https://sarasoueidan.com/blog/building-a-circular-navigation-with-svg/
   try
    {   
        var polarToCartesian = function (centerX, centerY, radius, angleInDegrees) 
        {
            var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

            return {
              x: centerX + (radius * Math.cos(angleInRadians)),
              y: centerY + (radius * Math.sin(angleInRadians))
            };
        }

        var describeArc = function (x, y, radius, startAngle, endAngle)
        {

            var start = polarToCartesian(x, y, radius, endAngle);
            var end = polarToCartesian(x, y, radius, startAngle);

            var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

            var d = [
                "M", start.x, start.y, 
                "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
                "L", x,y,
                "L", start.x, start.y
            ].join(" ");

            return d;       
        }

         //http://jsbin.com/zuvaxuvezu/edit?html,js,output
        var describeArcHollow = function (x, y, radius, startAngle, endAngle){

            var start = polarToCartesian(x, y, radius, endAngle);
            var end = polarToCartesian(x, y, radius, startAngle);

            var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

            var d = [
                "M", start.x, start.y, 
                "A", radius, radius, 0, arcSweep, 0, end.x, end.y
            ].join(" ");

            return d;       
        }

       var svgstr = "";
       var outerradius = 250;
       var viewboxHtWd = outerradius * 2;
       var thickness = 120;
       var arcMenuStyles = "";
       var arcMenuidstring = "arcMenu";
       var arcMenuHoverColor = "black"; var arcMenuColor = "rgba(52,52,52,0.7)"; var arcMenuClickCode = "var e = arguments[0] || window.event; (e.stopPropagation)?e.stopPropagation():e.cancelBubble = true;";
       var pstr = '<path id="{{arcid}}" fill="none" stroke="'+arcMenuColor+'" stroke-width="'+thickness+'" d="{{describearc}}" onclick="'+arcMenuClickCode+'{{fncall}}()" />';
       // var pstr = '<path id="{{arcid}}" fill="none" stroke="rgba(252,252,252,1)" stroke-width="'+thickness+'" d="{{describearc}}"/>';
       var da;
       var menuCt = icons.length;
       for(var i=0; i<menuCt; i++)
       {       
            da = describeArcHollow(250,250,outerradius-thickness/2,(360/menuCt)*i,(360/menuCt)*(i+1));
            svgstr += replaceHelper({arcid:arcMenuidstring+i, describearc:da, i:i, fncall:icons[i].fncall}, pstr);
            arcMenuStyles += "#"+arcMenuidstring+i+":hover {stroke:"+arcMenuHoverColor+"; cursor:hand;} " + "#"+arcMenuidstring+i+" {stroke:"+arcMenuColor+"; cursor:hand;} ";
       }
     
       var calcHtWd = function(sourceIconWidth, sourceIconHeight, angle)
       {
          var reqIconRatio = 0.18; //Master key.
          //var sourceIconWidth = 100; //hardcoded
          var sourceIconWidthRatio = sourceIconWidth / viewboxHtWd;
          var convertSourceIconWidthRatio = reqIconRatio / sourceIconWidthRatio;
          //var sourceIconHeight = 100; //hardcoded
          var sourceIconHeightRatio = sourceIconHeight / viewboxHtWd;
          var convertSourceIconHeightRatio = reqIconRatio / sourceIconHeightRatio;
       
       
          var wdth = Math.round( ((deviceProperty.layout=="Portrait")?deviceProperty.browserWidth:deviceProperty.browserHeight) * 0.75);
          var higt = wdth; //its a square viewbox for the circle.
          var ratio = wdth/(outerradius*2);
          var svgFAQiconratioWd = sourceIconWidth * ratio;
          svgFAQiconratioWd = svgFAQiconratioWd * convertSourceIconWidthRatio;
       
          var svgFAQiconratioHt = sourceIconHeight * ratio;
          svgFAQiconratioHt = svgFAQiconratioHt * convertSourceIconHeightRatio;

          var ptc = polarToCartesian(250,250,outerradius-thickness/2,angle);
          ptc.x = (ptc.x * ratio) - svgFAQiconratioWd/2;
          ptc.y = (ptc.y * ratio) - svgFAQiconratioHt/2;

          return {Ht:svgFAQiconratioHt, Wd:svgFAQiconratioWd, X:ptc.x, Y:ptc.y};
       }

      var cmenuhtml = '<svg viewBox="0 0 '+viewboxHtWd+' '+viewboxHtWd+'">'+'<style type="text/css">'+arcMenuStyles+'</style>'+svgstr+'</svg>';
      for(var i=0; i<menuCt; i++)
      {
        var cmenuicon = calcHtWd(icons[i].svgWd,icons[i].svgHt,(360/menuCt)*i+(360/menuCt)/2);
        cmenuhtml +=  '<div onmouseover="document.getElementById(\''+arcMenuidstring+i+'\').style.stroke=\''+arcMenuHoverColor+'\';" onmouseout="document.getElementById(\'arcMenu'+i+'\').style.stroke=\''+arcMenuColor+'\';" onclick="'+arcMenuClickCode+icons[i].fncall+'();" style="cursor:hand;position:absolute;left:'+cmenuicon.X+';top:'+cmenuicon.Y+';width:'+cmenuicon.Wd+';height:'+cmenuicon.Ht+'">'+  document.getElementById(icons[i].svgscriptid).innerHTML + '</div>';
      }
      return cmenuhtml;
      // document.getElementById("centralmenuIcon").innerHTML = "hi there";

      //http://greensock.com/forums/topic/7573-tween-around-circle/
      // to place icons in a circular path

      //alert('<div style="position:absolute;left:0px;top:0px;width:100px;height:100px;border:2px solid red;">'+  document.getElementById("svgFAQicon") + '</div>');

      }catch(e){console.log(e);}

 }


//http://javascript.crockford.com/private.html
window.menuCalls = new function()
{
  var isprivate = "hello";
  this.ispublic = "helloP";
  this.showLoginScreen = function()
              {
                // alert("you clicked login menu item"+isprivate);
                document.getElementById("svgmenuActionResult").src="loginHTMLsnippet.html"
                showMenu();
              }
  this.showProgramScreen = function()
              {
                //alert("you clicked program menu item"+isprivate);
                document.getElementById("svgmenuActionResult").src="programHTMLsnippet.html"
                showMenu();
              }
  this.showApplyScreen = function()
              {
                document.getElementById("svgmenuActionResult").src="applyHTMLsnippet.html"
                showMenu();
                // alert("you clicked apply menu item"+isprivate);
              }
  this.showFAQScreen = function()
              {
                // alert("you clicked faq menu item"+isprivate);
                document.getElementById("svgmenuActionResult").src="faqHTMLsnippet.html"
                showMenu();
              }
  this.showFeedbackScreen = function()
              {
                // alert("you clicked feedback menu item"+isprivate);
                document.getElementById("svgmenuActionResult").src="feedbackHTMLsnippet.html"
                showMenu();
              }
  this.showPartnersScreen = function()
              {
                document.getElementById("svgmenuActionResult").src="partnerHTMLsnippet.html"
                showMenu();
                // alert("you clicked Partners menu item"+isprivate);
              }
  this.showContactUsScreen = function()
              {
                // alert("you clicked contactus menu item"+isprivate);
                document.getElementById("svgmenuActionResult").src="contactHTMLsnippet.html"
                showMenu();

                // xHTP.send("loginHTMLsnippet.html", function(resp)
                //               {
                //                 var MyDiv = document.getElementById("pageContent");
                //                 MyDiv.innerHTML = resp; alert(resp);
                //                 var arr = MyDiv.getElementsByTagName('script')
                //                 for (var n = 0; n < arr.length; n++)
                //                     eval(arr[n].innerHTML);//run script inside div  
                //                 // the above approach,  not sure if entire response is available as DOM. not sure if innerHTML is synchronous across all browsers.  http://stackoverflow.com/questions/7001376/event-to-determine-when-innerhtml-has-loaded

                //               }
                // , "");
              }
}

//http://stackoverflow.com/questions/2557247/easiest-way-to-retrieve-cross-browser-xmlhttprequest
window.xHTP = new function()
{
  var XMLHttpFactories = [
    function () {return new XMLHttpRequest()},
    function () {return new ActiveXObject("Msxml2.XMLHTTP")},
    function () {return new ActiveXObject("Msxml3.XMLHTTP")},
    function () {return new ActiveXObject("Microsoft.XMLHTTP")}
  ];


  var createXMLHTTPObject = function() 
  {
    var xmlhttp = false;
    for (var i=0;i<XMLHttpFactories.length;i++) {
        try {
            xmlhttp = XMLHttpFactories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
  }

  this.send = function (url,callback,postData) 
  {
    var req = createXMLHTTPObject();
    if (!req) return;
    var method = (postData) ? "POST" : "GET";
    req.open(method,url,true);
    //req.setRequestHeader('User-Agent','XMLHTTP/1.0');
    if (postData)
        req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    req.onreadystatechange = function () 
    {
        if (req.readyState != 4) return;
        if (req.status != 200 && req.status != 304) 
        {
            //alert('HTTP error ' + req.status);
            return;
        }
        if (req.status == 200)
          callback(req.responseText);
    }
    if (req.readyState == 4) return;
    req.send(postData);
  }

}

