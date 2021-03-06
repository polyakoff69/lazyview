// Lazy Text View widget

// Version : 1.2
// Release : 24.08.2016
// Web     : http://github.com/polyakoff69/lazyview

/* class */ function LazyViewer(/* String */id, /* String */ imgPath, /* boolean */ sysButtons) {
  this.id = id;         // widget ID
  this.margin = 0;
  this.rh = 16*6;       // string height
  
  this.frameSz = 100*3; // frame size 
  this.strBegin = 0;    // current frame begin index
  this.strEnd   = 0;    // current frame end index
  this.textLen  = null; // total strings (0-based)
  
  this.timerId = null;  // timer ID
  this.mouseIntval = 250;
  this.lockUI = false;  // lock UI while data is loaded
  
  this.TXT_UP = "Up. Press Ctrl to scroll to top.";
  this.TXT_DN = "Down. Press Ctrl to scroll to end.";
  this.TXT_ERR = 'Error';
  this.TXT_ERR_LOAD = 'Error loading text'; 
    
  if(imgPath!=undefined && imgPath!=null){
    this.imcp = imgPath;
  }else{
	this.imcp = "";  
  }

  if(sysButtons!=undefined && sysButtons!=null){
    this.sysButt = sysButtons;
  }else{
	this.sysButt = false;  
  }
  
  this.LDR = null;      // Ajax-loader

  this.getId = function(){ // widget ID
    return id;
  }
  
  this.getVpId = function(){ // viewport ID
    return id + "viewport";
  }

  this.getContId = function(){ // container ID
    return id + "outer";
  }
  
  this.getLoader = function(){
    return this.LDR;
  }
  
  this.getMouseIntval = function(){
	return this.mouseIntval;
  }
  
  this.getBtnUpId = function(){ // UP button ID
    return id + "btnup";
  } 

  this.getBtnDnId = function(){ // DOWN button ID
	return id + "btndn";
  } 

  this.getProgrId = function(){ // progress ID
	return id + "prgss";
  }
  
  this.getRowHeight = function(){ // string height
	return this.rh;
  } 

  this.setRowHeight = function(/* int */ h){
	this.rh = h;
  } 
  
  this.getTimerId = function(){
    return this.timerId;
  } 

  this.setTimerId = function(tm){
	this.timerId = tm;
  } 

  this.getStrBegin = function(){
	return this.strBegin;
  } 

  this.setStrBegin = function(/* int */ x){
	this.strBegin = x;
  } 

  this.getStrEnd = function(){
	return this.strEnd;
  } 

  this.setStrEnd = function(/* int */ x){
	this.strEnd = x;
  } 

  this.getFrameSz = function(){
	return this.frameSz;
  } 

  this.setFrameSz = function(/* int */ s){
	this.frameSz = s;
  } 

  this.getTextLen = function(){
	return this.textLen;
  } 

  this.setTextLen = function(/* int */ l){
	this.textLen = l;
  }  

  this.getLockUI = function(){
	return this.lockUI;
  } 

  this.setLockUI = function(/* boolean */ b){
	this.lockUI = b;
  }  

  this.setLocale = function(id){
	  if("RU"==id || "ru"==id){
      this.TXT_UP = "Вверх. Удерживайте Ctrl для перехода к началу.";
      this.TXT_DN = "Вниз. Удерживайте Ctrl для перехода к концу.";
      this.TXT_ERR = 'Ошибка';
      this.TXT_ERR_LOAD = 'Ошибка загрузки текста';
	  }
  }
    
  this.checkFocused = function(){ // check if element is focused
    var foc = document.activeElement; // $(':focus');
    if(foc==undefined || foc==null)
      return false;
    
    foc = $(foc);
    
    var eid = this.getContId();
    var i = 0;
    for(i=0;i<100;i++){
      var cid = foc.attr("id");
      if(eid==cid)return true;
      
      foc = foc.parent();
      if(foc==undefined || foc==null)
    	break;
    }
    
    return false;
  }
  
  this.resize = function(/* LazyViewer */that){ // resize
    var d = $( '#'+id );
    var o = $( '#'+id + "outer" );
    
    var offset = o.offset();
    var margin  = o.outerHeight(true) - o.outerHeight();
        
    var h = $(window).height() - offset.top - 2 - margin;
    if(h<100)
      h = 100;
    
    d.height(h);
    
    // var vp = $("#"+ id + "viewport");    
    // var vps = 0; // $(vp).scrollTop(); // $(vp).height(h-vps)  // $(vp).scrollTop(vps);    
    
    var sysButt = false;
    if(that!=undefined && that!=null)
      sysButt = that.sysButt;    	
    
    var btn = $("#"+ id + "btndn");
    if(sysButt==true){      
      btn.css("top", ""+(offset.top + h - 16*2)+"px");
    }else{
      btn.css("top", ""+(h - 116)+"px");
    }

    if(that!=undefined && that!=null)
      that.updateProgress();
  }

  this.onResize = function(/* LazyViewer */that){ // resize
    var d = $( '#'+id );
    var o = $( '#'+id + "outer" );
    
    var offset = o.offset();
    var margin  = o.outerHeight(true) - o.outerHeight();
    
    var h = d.height();
    
    var sysButt = false;
    if(that!=undefined && that!=null)
      sysButt = that.sysButt;    	
    
    var btn = $("#"+ id + "btndn");
    if(sysButt==true){      
      btn.css("top", ""+(offset.top + h - 16*2)+"px");
      btn.css("left", ""+(offset.left+ o.width() - margin/2 - 3)+"px");
    }else{
      btn.css("top", ""+(h - 116)+"px");	
    }

    if(that!=undefined && that!=null)
      that.updateProgress();
  }
  
  this.scrUp = function(/* LazyViewer */ that){ // handle UP
	if(this.getLockUI()==true)
	  return;
	this.setLockUI(true);
	var unlock = true;
	  
	if(that.isNeedLoad(that, true)){
	  unlock = false;
      that.loadTextFrame(true);
	}
			
    var lzv = $("#"+ that.getId());
    var y = $(lzv).scrollTop();
    $(lzv).scrollTop(y-$(lzv).height()/4);

    that.updateProgress();
    
    if(unlock)
      this.setLockUI(false);
  }

  this.scrDn = function(/* LazyViewer */ that){ // handle DOWN
	if(this.getLockUI()==true)
	  return;
	this.setLockUI(true);
	var unlock = true;
	  
	if(that.isNeedLoad(that, false)){
	  unlock = false;
      that.loadTextFrame(false);
	}
	
    var lzv = $("#"+ that.getId());
    var y = $(lzv).scrollTop();
    $(lzv).scrollTop(y+$(lzv).height()/4);
    
    that.updateProgress();
    
    if(unlock)
      this.setLockUI(false);
  }

  this.pgUp = function(/* LazyViewer */ that){ // handle PG UP
	if(this.getLockUI()==true)
	  return;
	this.setLockUI(true);
	var unlock = true;
	  
	if(that.isNeedLoad(that, true)){
	  unlock = false;
	  that.loadTextFrame(true);
	}
	  
    var lzv = $("#"+ that.getId());
    var y = $(lzv).scrollTop();
    var h = y-($(lzv).height()*9)/10;
    if(h<0)
      h=0;
    $(lzv).scrollTop(h);
    
    that.updateProgress();
    
    if(unlock)
      this.setLockUI(false);
  }

  this.pgDn = function(/* LazyViewer */ that){ // handle PG DN
	if(this.getLockUI()==true)
	  return;
	this.setLockUI(true);
	var unlock = true;
	  
	if(that.isNeedLoad(that, false)){
	  unlock = false;
      that.loadTextFrame(false);
	}
	
    var lzv = $("#"+ that.getId());
    var y = $(lzv).scrollTop();
    $(lzv).scrollTop(y+($(lzv).height()*9)/10);
    
    that.updateProgress();
    
    if(unlock)
      this.setLockUI(false);
  }
  
  this.pgHome = function(/* LazyViewer */ that){ // handle HOME
	if(this.getLockUI()==true)
	  return;
	this.setLockUI(true);
	  
	var needLoad = false;
	if(this.getStrBegin()>0){
	  needLoad = true;
	  this.loadTextInit();	  	
	}
	
	var lzv = $("#"+ that.getId());
	$(lzv).scrollTop(0);
	
	that.updateProgress();
	
	if(!needLoad)
	  this.setLockUI(false);
  }
  
  this.pgEnd = function(/* LazyViewer */ that){ // handle END
	var last = this.getTextLen(), needLoad = true;

	if(this.getLockUI()==true)
	  return;
	this.setLockUI(true);
	
	if(last!=undefined && last!=null){
	  if((this.getStrEnd()+1)>=last)
        needLoad = false;
	}
	    
	if(needLoad)
      this.loadTextEnd();
	
	var lzv = $("#"+ that.getId());
	var vp = $("#"+ that.getVpId());
	var h = $(vp).height()-$(lzv).height()+50;
	if(h<0)
	  h=0;
	$(lzv).scrollTop(h);	
	
	that.updateProgress();
	
	if(!needLoad)
	  this.setLockUI(false);
  }
  
  this.mouseUpPress = function(/* LazyViewer */ that){ // handle mouse press on UP
	var tm = that.getTimerId();
    if(tm!=undefined && tm!=null){
   	  clearInterval(tm);
    }
   	tm = setInterval(function(){ that.scrUp(that) } , that.getMouseIntval());
   	that.setTimerId(tm);
  }
  
  this.mouseUpUp = function(/* LazyViewer */ that){ // handle mouse release on UP
	var tm = that.getTimerId();
    if(tm!=undefined && tm!=null){
   	  clearInterval(tm);
    }   	
   	that.setTimerId(null);	  
  }

  this.mouseDnPress = function(/* LazyViewer */ that){// handle mouse press on DOWN
	var tm = that.getTimerId();
    if(tm!=undefined && tm!=null){
   	  clearInterval(tm);
    }
   	tm = setInterval(function(){ that.scrDn(that) }, that.getMouseIntval());
   	that.setTimerId(tm);	  
  }
  
  this.mouseDnUp = function(/* LazyViewer */ that){// handle mouse release on DOWN
    that.mouseUpUp(that);
  }
  
  this.isNeedLoad = function(/* LazyViewer */ that, /* boolean */ dirUp){ // check if more text is needed to load
	if(dirUp && that.getStrBegin()<=0) // ^
      return false;
	
	var last = that.getTextLen(); // v
	if(!dirUp && last!=undefined && last!=null && last>=0){
      if(that.getStrEnd()+1>=last)
    	return false;
	}
	  
	var lzv = $("#"+ that.getId());
	var vp = $("#"+ that.getVpId());
	
	var H = vp.height();	
	var t = lzv.scrollTop();
	
	if(dirUp){ // ^
	  if(3*t<H)
		return true;
	}else{ // v
	  var h = lzv.height();
      if(3*(h+t)>H*2)
    	return true;
	}
	
	return false;
  }
  
  this.loadTextFrame = function(/* boolean */ dirUp){ // load frame
	this.setLockUI(true);
	  
	var ix = this.getStrEnd();
	var cnt = this.getFrameSz()/3;
	
	if(dirUp){
	  ix = this.getStrBegin();
	  cnt = cnt*(-1);
	}
	
    var ldr = this.getLoader();
    ldr.load(ix, cnt, false, this);
  }
  
  this.initScroller = function(container){
    // $(container).css("padding-right", "16px");
	
	(function(that){
	
      $(container)
	    //.data('scrollLeft', -1) //для предотвращения блокировки вертикального скролла
	    .mousewheel(function (event, delta) {
		  // console.log(event.deltaX, event.deltaY, event.deltaFactor);		  
	      var dy = event.deltaY;
	      var df = event.deltaFactor;
		
		  if(dy<0){ // negative = down
		    if(dy>-2)
			  that.scrDn(that);
		    else
			  that.pgDn(that);
		  }else{
		    if(dy<2)
			  that.scrUp(that);
		    else
			  that.pgUp(that);
		  }
	  });	 
    
	})(this);
	
  }

  this.createButtons = function(panel){ // create buttons for mouse clicks	  
    var btn = document.createElement("div");
    btn = $(btn); 
    btn.attr("id", this.getBtnUpId());
    
    var gif = "";
    if(this.sysButt==true){
      btn.addClass("lazyviewbtn");
      btn.addClass("lazyviewbtnup");
      gif = "u.gif";      
    }else{
      btn.addClass("lazyviewbtn2");
      btn.addClass("lazyviewbtnup2");
      gif = "ru.gif";          	
    }
    btn.html("<img src=\""+this.imcp+gif+"\" border=\"0\" title=\""+this.TXT_UP+"\" >");

    $(btn).bind("click", {lzv : this},  function (e) {
      var that = $(e.data.lzv);
      that = $(that)[0];
      
      if(e.ctrlKey){
    	that.pgHome(that);  
      }else{
        that.scrUp(that);
      }
    });

    $(btn).bind("mousedown", {lzv : this},  function (e) {
      var that = $(e.data.lzv);
      that = $(that)[0];
      that.mouseUpPress(that);
    });

    $(btn).bind("mouseup", {lzv : this},  function (e) {
      var that = $(e.data.lzv);
      that = $(that)[0];
      that.mouseUpUp(that);
    });

    $(btn).bind("mouseout", {lzv : this},  function (e) {
      var that = $(e.data.lzv);
      that = $(that)[0];
      that.mouseUpUp(that);
    });
    
    btn.prependTo(panel);
    
    
    btn = document.createElement("div");
    btn = $(btn);
    btn.attr("id", this.getBtnDnId());
    
    if(this.sysButt==true){
      btn.addClass("lazyviewbtn");
      btn.addClass("lazyviewbtndn");
      gif = "v.gif";      
    }else{
      btn.addClass("lazyviewbtn2");
      btn.addClass("lazyviewbtndn2");
      gif = "rv.gif";          	
    }
    btn.html("<img src=\""+this.imcp+gif+"\" border=\"0\" title=\""+this.TXT_DN+"\" >");

    $(btn).bind("click", {lzv : this},  function (e) {
      var that = $(e.data.lzv);
      that = $(that)[0];

      if(e.ctrlKey){
      	that.pgEnd(that);  
      }else{      
        that.scrDn(that);
      }
  	});    
    
    $(btn).bind("mousedown", {lzv : this},  function (e) {
      var that = $(e.data.lzv);
      that = $(that)[0];
      that.mouseDnPress(that);
    });

    $(btn).bind("mouseup", {lzv : this},  function (e) {
      var that = $(e.data.lzv);
      that = $(that)[0];
      that.mouseDnUp(that);
    });

    $(btn).bind("mouseout", {lzv : this},  function (e) {
      var that = $(e.data.lzv);
      that = $(that)[0];
      that.mouseDnUp(that);
    });

    btn.prependTo(panel);    
  }

  this.createProgress = function(panel){ // create progress indicator
    var prg = document.createElement("div");
    prg = $(prg);    
    prg.attr("id", this.getProgrId());        
    prg.addClass("lazyviewprss");
	  
    prg.prependTo(panel);
  }
  
  this.createUiHandlers = function(){ // create keyboard handlers
    var vp = $(document);    
    
    $(vp).bind("keydown", {lzv : this},  function (e) { 
      var that = $(e.data.lzv);
      that = $(that)[0];
      
      if(!that.checkFocused())return;
      
      var code = e.keyCode || e.which;
      if(38==code){ // ^
        that.scrUp(that);
      }else if(40==code){ // v
        that.scrDn(that);
      }else if(36==code){ // home
        that.pgHome(that);
      }else if(35==code){ // end
    	that.pgEnd(that);
      }else if(33==code){ // pg up
        that.pgUp(that);
      }else if(34==code){ // pg dn
      	that.pgDn(that);    	
      }
    });   
    
  }
  
  /* this.loadText = function (/ * int * / ix, / * int * / count){ // загрузить строки с индекса ix, count штук
    var ldr = this.getLoader();
    ldr.load(ix, count);
  } */

  this.loadTextInit = function (){ // load initial text
    var ldr = this.getLoader();
    ldr.load(0, this.getFrameSz(), true, this);
  }

  this.loadTextEnd = function (){ // load final frame
    var ldr = this.getLoader();
    ldr.load(-1, this.getFrameSz(), true, this);
  }
  
  this.init = function(/* int */ margin, /* String*/ url, /* String*/ dataId, /* boolean */ bAutoSize){ // widget init.
    this.margin = margin;
	if(this.margin==undefined || this.margin==null)this.margin = 0;
	  
    var d = $( '#'+this.getId() );
    d.addClass("lazyview");
    d.css('height', '200px');    
        
    var vpo = document.createElement("div");
    vpo = $(vpo); 
    vpo.attr("id", this.getContId());    
    vpo.addClass("lazyviewout");
    if(this.margin>0)vpo.css('margin', ""+this.margin+"px");
    vpo.insertBefore(d);
    
    var vp = document.createElement("div");
    vp = $(vp);
    vp.attr("id", this.getVpId());    
    vp.attr("tabindex", "-1");
    vp.addClass("lazyviewport");        
    vp.append(d.html());
    d.html("");
    vp.appendTo(d);
    
    d.appendTo(vpo);
    
    d.css('display', 'block');
    vp.css('display', 'block');
    vpo.css('display', 'block');
    
    this.createButtons(vpo);
    
    this.createProgress(vpo);
    
    this.createUiHandlers();
    
    this.initScroller(d);
    
    if(bAutoSize!=undefined && bAutoSize!=null && bAutoSize==true){
      $(window).bind("resize", {lzv : this},  function (e) {
        var that = $(e.data.lzv);
        that = $(that)[0];
        that.resize(that);
      });
    
      this.resize(this);    
    }else{
      $(window).bind("resize", {lzv : this},  function (e) {
    	var that = $(e.data.lzv);
    	that = $(that)[0];
    	that.onResize(that);
      });  
      
      this.onResize(this);
    }
    
    this.LDR = new LazyViewerLdr();
    if(url!=undefined && url!=null)
      this.LDR.setUrl(url);
    this.LDR.setId(dataId);
    this.LDR.setErrMsg(this.TXT_ERR_LOAD);
    
    this.setLockUI(true);
    this.loadTextInit();
    
    var IE = (!+"\v1")?true:false;
    var IEVer = this.getIeVer();  // alert("IE " + IE+" v. "+IEVer);
    if (IE && $.browser.msie && IEVer<10) { 
      // alert("IE " + IEVer);
      d = $(d);
      var that = this;
      d.scroll(function() {
        that.updScroll8(d);
      });

      vp.scroll(function() {    
        that.updScroll8(vp);
      });
    }

    vp.focus();
  }
  
  this.setTextData = function(/* JSON */ data){ // replace whole text in widget
    if(data==undefined || data==null)
      return;
    
    data = data.data;
    if(data==undefined || data==null)
      return;
    
    var items = data.items;
    if(items==undefined || items==null)
      return;
 
    var vp = $("#"+this.getVpId());
    vp.html("");
    
    var begin = -1, end = -1;
    
    for(i=0;i<items.length; i++){
      var ix = items[i].ix;
      if(ix==undefined || ix==null)
    	continue;
      if(ix<0)
    	continue;
      
      if(ix<begin || begin<0)
    	begin = ix;
      if(ix>end || end<0)
    	end = ix;
            
      this.addString(vp, ix, items[i].txt, 0, null);
    }
    
    var last = data.end;
    if(last!=undefined && last!=null){
      if(last>=0)this.setTextLen(last);    	
    }
    
    this.setStrBegin(begin);
    this.setStrEnd(end);
    
    this.updateProgress();
  }
  
  this.updateTextData = function(/* JSON */ data){ // add new frame and delete unused frame
    if(data==undefined || data==null)
      return;
    
    data = data.data;
    if(data==undefined || data==null)
      return;
    
    var items = data.items;
    if(items==undefined || items==null)
      return;
 
    var vp = $("#"+this.getVpId());    
    var ch1 = $(vp).children().first();
    
    var begin = this.getStrBegin(), end = this.getStrEnd();
    var orgBegin = begin, orgEnd = end;
    
    var cnt = 0;
    for(i=0;i<items.length; i++){
      var ix = items[i].ix;
      if(ix==undefined || ix==null)
    	continue;
      if(ix<0)
    	continue;
      
      if(ix>=orgBegin && ix<=orgEnd)
    	continue;
      
      if(ix<begin || begin<0)
    	begin = ix;
      if(ix>end || end<0)
    	end = ix;
      
      var place = 1;
      if(ix<orgBegin)
    	place = -1;
            
      this.addString(vp, ix, items[i].txt, place, ch1);
      cnt++;
    }
    
    var last = data.end;
    if(last!=undefined && last!=null){
      if(last>=0)this.setTextLen(last);    	
    }
    
    this.setStrBegin(begin);
    this.setStrEnd(end);
    
    this.removeStr(data.dir, cnt, vp); // delete excess strings
    
    this.updateProgress();
  }
  
  this.addString = function(/* DOM */ vp, /* int */ ix, /* String */ txt, /* int */ place, /* DOM*/ child1){
    if(txt==undefined || txt==null)
      txt = "";
    
    var strNum = "<span class=\"lazyviewnum\" >"+(ix+1)+"<span class=\"lazyviewsep\" >:</span></span>";
    var htm = "<div strix=\""+ix+"\" class=\"lazyviewstr\" >"+strNum+txt+"</div>";
    
    if(place==-1 && (child1==undefined || child1==null))
      place = 0;
    
    if(place==0 || place==1){
      vp.append(htm);
    }else if(place==-1){      
      $(htm).insertBefore(child1); // vp.prepend(htm);
    }
  }
  
  this.removeStr = function(/* String */dir, /* int */ cnt, /* DOM */ vp){ // delete excess strings
	var v = new Array(); 
		
    $('.lazyviewstr').each(function (index, value) { 
      v.push(value);
	});
    
    if(!("F"==dir || "f"==dir)){
      v = v.reverse();	
    }
    
    var c = 0;
    var n = v.length;
    var h = vp.height();
    var ch = h/n;
    
    for(i=0; i<cnt && i<v.length; i++){
      var d = $(v[i]);
      d.remove();
      c++;
    }    
 
    var lzv = $("#"+ this.getId());
    var y = $(lzv).scrollTop();    

    if("F"==dir || "f"==dir){
      var b = this.getStrBegin();
      this.setStrBegin(b+c);      
    }else{
      var e = this.getStrEnd();
      this.setStrEnd(e-c);
      ch = (-1)*ch;
    }
    
    $(lzv).scrollTop(y-c*ch);
  }
  
  this.showError = function(txt){
    $.toaster(txt, this.TXT_ERR, 'danger');
  }
  
  this.updateProgress = function(){ // calc indicator
	try{  
      var prg = $("#"+ id + "prgss");
    
      var len = this.getTextLen();
      if(len==undefined || len==null)
    	len = -1;
    
      if(len>0){
        prg.css("display", "inline");
      }else{
        prg.css("display", "none");
        return;
      }
    
      var strH = 0;
      var str = $( ".lazyviewstr" ).first();
      if(str!=undefined && str!=null)
        strH = str.height();
    
      var lzv = $("#"+ id );
      var vh = lzv.height();
    
      var vs = lzv.scrollTop();
    
      var e = this.getStrEnd();
      if(strH>0)
        e = this.getStrBegin() + (vs + vh)/strH ;    
    
      var prc = (e*100)/len;
      if(prc>100 || (e+1)>=len)prc = 100;
          
      prg.height((vh*prc)/100);
    }catch(exx){
      prg.css("display", "none");
    }
  }

  this.updScroll8 = function (el){
    try{
      //el.html(el.html());
      //el.trigger("resize");    	
   	  var n = document.createTextNode(' ');
      el.append(n);
      (function(){n.parentNode.removeChild(n)}).defer();    	
    }catch(ex){;}	  
  }
  
  this.getIeVer = function (){
    var ua = navigator.userAgent;
	  if (ua.indexOf("Trident/6.0") > -1) {
	    return 10;
    } else if (ua.indexOf("Trident/5.0") > -1) {      
	    return 9;
    } else if (ua.indexOf("Trident/4.0") > -1) {
   	  return 8;
    }

    return $.browser.version;
  }  
  
}
