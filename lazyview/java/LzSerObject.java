import java.util.*;

/**
 * Lazy View Text Serialization
 * 
 * @author LZV
 */
public class LzSerObject {

	private static final long serialVersionUID = 14200857834101L;
	
	public LzSerObject(){
		setKey(this.getClass().getName());
	}
	
	public LzSerObject(String id, long cnt){
		this();
		
		setId(id);
		setCount(cnt);
	}
	
	private String key = "";  // key
	private String id = "";   // data source ID
	private String dir = "";  // reading direction: F|R
	private long count = 0L;	// strings count
	private long end = -1L;   // last string index (-1 = unknown)
	private java.util.List<LzSerItem> items = new java.util.ArrayList<LzSerItem>(); // text strings
	
	
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
	
  public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public String getDir() {
		return dir;
	}

	public void setDir(String dir) {
		this.dir = dir;
	}
	
	public java.util.List<LzSerItem> getItems() {
		return items;
	}

	public void setItems(java.util.List<LzSerItem> items) {
		this.items = items;
	}

	public long getEnd() {
		return end;
	}

	public void setEnd(long end) {
		this.end = end;
	}
	
}
