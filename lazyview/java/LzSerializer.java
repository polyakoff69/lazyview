import com.thoughtworks.xstream.XStream;

/**
 * SAMPLE CODE!!!
 */
public class LzSerializer extends AbstractJsonSerializer {
  @Override
  protected void init(XStream xs) {
    super.init(xs);
    xs.alias("data", LzSerObject.class);
    xs.alias("item", LzSerItem.class);      
  }
}  
