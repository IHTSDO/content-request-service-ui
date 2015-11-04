package org.ihtsdotools.crs.dto.helper.config;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * User: huyle
 * Date: 11/2/2015
 * Time: 3:12 PM
 */
@XmlRootElement(name = "field")
@XmlAccessorType(XmlAccessType.FIELD)
public class Field {

   @XmlAttribute(name = "name")
   //Field name
   private String name;

   @XmlAttribute(name = "required")
   //Is the field required
   private boolean required;

   @XmlAttribute(name = "updatable")
   //Is the field can be changed
   private boolean updatable = true;

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public boolean isRequired() {
      return required;
   }

   public void setRequired(boolean required) {
      this.required = required;
   }

   public boolean isUpdatable() {
      return updatable;
   }

   public void setUpdatable(boolean updatable) {
      this.updatable = updatable;
   }
}
