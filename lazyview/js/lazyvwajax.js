// Аякс-загрузчик текста для виждета отображения текста

/* class */ function LazyViewerLdr() {
  
  this.url = null;  // URL
  this.id  = "";    // ИД 

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
  
  this.load = function (/* int */ ix, /* int */ count, /* boolean */ initMode, /* LazyViewer */ lzv){ // загрузить строки с индекса ix, count штук
	var fSuccess = null, fError = null;
    
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
          lzv.showError("Ошибка загрузки текста: "+ex);
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
	      lzv.showError("Ошибка загрузки текста: "+ex);
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
        lzv.showError("Ошибка загрузки текста");
	  },
	  complete : function(xhr, st){
        lzv.setLockUI(false);
	  } 
    });    
    
  }
}