package org.ihtsdotools.crs.exception;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 2:21 PM
 */
public enum CRSError {
   SERVER_RUNTIME_ERROR(10000, "Server runtime error"),
   REQUEST_REQUIRED_FIELD_MISSING(10100, "Missing required field(s)"),
   REQUEST_INVALID(10101, "Invalid Request"),
   REQUEST_TYPE_INVALID(10102, "Invalid Request Type")
   ;

   private int code;
   private String message;

   CRSError(int code, String message) {
      this.code = code;
      this.message = message;
   }

   public int getCode() {
      return code;
   }

   public void setCode(int code) {
      this.code = code;
   }

   public String getMessage() {
      return message;
   }
}
