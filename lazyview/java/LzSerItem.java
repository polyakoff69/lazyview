import java.io.Serializable;

/**
 * Lazy View Text String Object
 * 
 * @author LZV
 */
public class LzSerItem implements Serializable {
	
	private static final long serialVersionUID = 149448906104111L;

	public LzSerItem(){}
	
	public LzSerItem(long ix, String txt){
		this();
		
		setIx(ix);
		setTxt(txt);
	}
	
	private long ix = -1L;     // index
	private String txt = "";   // text
	
	public long getIx() {
		return ix;
	}

	public void setIx(long ix) {
		this.ix = ix;
	}

	public String getTxt() {
		return txt;
	}

	public void setTxt(String txt) {
		this.txt = txt;
	}	
}
