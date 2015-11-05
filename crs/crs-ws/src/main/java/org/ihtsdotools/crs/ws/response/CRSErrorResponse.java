package org.ihtsdotools.crs.ws.response;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 2:31 PM
 */
public class CRSErrorResponse {

   private int errorCode;
   private String message;

   public int getErrorCode() {
      return errorCode;
   }

   public void setErrorCode(int errorCode) {
      this.errorCode = errorCode;
   }

   public String getMessage() {
      return message;
   }

   public void setMessage(String message) {
      this.message = message;
   }
}
