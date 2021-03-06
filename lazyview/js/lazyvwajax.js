// Ajax text loader for Lazy Text View widget

// Version : 1.2
// Release : 24.08.2016
// Web     : http://github.com/polyakoff69/lazyview

/* class */ function LazyViewerLdr() {
  
  this.url = null;  // URL
  this.id  = "";    // ИД 

  this.TXT_ERR_LOAD = 'Error loading text';

  this.getId = function(){ // ИД 
    return this.id;
  }

  this.setId = function(id){ 
    this.id = id;
  }

  this.getUrl = function(){ 
    return this.url;
  }

  this.setUrl = function(url){ 
    this.url = url;
  }
  
  this.setErrMsg = function(e){
    this.TXT_ERR_LOAD = e;
  }
  
  this.load = function (/* int */ ix, /* int */ count, /* boolean */ initMode, /* LazyViewer */ lzv){ // load strings from 'ix' index, 'count'
	var fSuccess = null, fError = null;
  var errmsg = this.TXT_ERR_LOAD;
	errmsg = ""+errmsg;
	    
	if(initMode){    
      var d = "F";
      if(ix<0)
    	d = "R";
    	
      fSuccess = function (data) {
        try{
          lzv.setTextData(data);
          lzv.setLockUI(false);
        }catch(ex){
          lzv.setLockUI(false);
          lzv.showError(errmsg+": "+ex);
        }finally{
          lzv.setLockUI(false);
        }
      };      
    }else{
      var d = "F";
      if(count<0){
        d = "R";
        count = (-1)*count;
      }
    	
	  fSuccess = function (data) { 
	    try{
	      lzv.updateTextData(data);
	    }catch(ex){
	      lzv.setLockUI(false);
	      lzv.showError(errmsg+": "+ex);
	    }finally{
	      lzv.setLockUI(false);
	    }
	  };
    }
    
    $.ajax({
	  method: "POST",
	  url: this.getUrl(),
	  data: { id : this.getId() , ix : ix, cnt : count, dir : d},
	  response:'text',
	  dataType : 'json',
	  success : fSuccess,
	  error : function(response, st, err){
        lzv.setLockUI(false);		      
        lzv.showError(errmsg);
	  },
	  complete : function(xhr, st){
        lzv.setLockUI(false);
	  } 
    });    
    
  }
}