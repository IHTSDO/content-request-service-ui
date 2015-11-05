package org.ihtsdotools.crs.ws.dto.converter;

import org.dozer.DozerConverter;

import java.util.Date;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 4:25 PM
 */
public class DateAndLongConverter extends DozerConverter<Date, Long>{

   public DateAndLongConverter() {
      super(Date.class, Long.class);
   }

   @Override
   public Long convertTo(Date date, Long aLong) {
      return date != null ? date.getTime() : null;
   }

   @Override
   public Date convertFrom(Long aLong, Date date) {
      return aLong != null ? new Date(aLong) : null;
   }
}
