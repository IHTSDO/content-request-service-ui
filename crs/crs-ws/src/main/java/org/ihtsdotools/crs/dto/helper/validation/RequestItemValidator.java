package org.ihtsdotools.crs.dto.helper.validation;

import org.apache.commons.beanutils.BeanUtils;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.dto.RequestItem;
import org.ihtsdotools.crs.dto.helper.config.Field;
import org.ihtsdotools.crs.dto.helper.config.Fields;
import org.ihtsdotools.crs.dto.helper.config.RequestItemConfig;
import org.ihtsdotools.crs.exception.CRSError;
import org.ihtsdotools.crs.exception.CRSRuntimeException;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;

/**
 * User: huyle
 * Date: 11/5/2015
 * Time: 11:00 AM
 */
public class RequestItemValidator {

   @Autowired
   private RequestItemConfig requestItemConfig;

   public void validateRequestItems(Request request) {
      List<RequestItem> requestItems = request.getWorkItems();
      for (RequestItem requestItem : requestItems) {
         Fields fields = requestItemConfig.getRequestItemConfig(requestItem.getRequestType());
         if(fields == null) throw new CRSRuntimeException(CRSError.REQUEST_TYPE_INVALID);
         List<Field> fieldList = fields.getFields();
         for (Field field : fieldList) {

            try {
               if(field.isRequired() && BeanUtils.getProperty(requestItem, field.getName()) == null) {
                  throw new CRSRuntimeException(CRSError.REQUEST_REQUIRED_FIELD_MISSING);
               }
            } catch (IllegalAccessException e) {
               throw new CRSRuntimeException(CRSError.SERVER_RUNTIME_ERROR, e);
            } catch (InvocationTargetException e) {
               throw new CRSRuntimeException(CRSError.SERVER_RUNTIME_ERROR, e);
            } catch (NoSuchMethodException e) {
               throw new CRSRuntimeException(CRSError.SERVER_RUNTIME_ERROR, e);
            }

         }
      }
   }

}
