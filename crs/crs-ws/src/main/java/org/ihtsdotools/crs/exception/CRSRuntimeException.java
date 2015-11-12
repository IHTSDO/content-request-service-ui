package org.ihtsdotools.crs.exception;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 10:25 AM
 */
public class CRSRuntimeException extends RuntimeException{

   private CRSError crsError;

   public CRSRuntimeException() {
   }

   public CRSRuntimeException(CRSError crsError) {
      this.crsError = crsError;
   }

   public CRSRuntimeException(CRSError crsError, Throwable cause) {
      super(cause);
      this.crsError = crsError;
   }

   public CRSRuntimeException(String message) {
      super(message);
   }

   public CRSRuntimeException(String message, Throwable cause) {
      super(message, cause);
   }

   public CRSError getCrsError() {
      return crsError;
   }

   public void setCrsError(CRSError crsError) {
      this.crsError = crsError;
   }
}
