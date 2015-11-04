package org.ihtsdotools.crs.dto.helper.config;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.List;

/**
 * User: huyle
 * Date: 11/2/2015
 * Time: 3:37 PM
 */
@XmlRootElement(name = "fields")
@XmlAccessorType(XmlAccessType.FIELD)
public class Fields {

   @XmlElement(name = "field", type = Field.class)
   private List<Field> fields = new ArrayList<>();

   public List<Field> getFields() {
      return fields;
   }

   public void setFields(List<Field> fields) {
      this.fields = fields;
   }
}
