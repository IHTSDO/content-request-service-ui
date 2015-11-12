/**
 * 
 */
package org.ihtsdotools.crs.ws;

import org.ihtsdotools.crs.exception.CRSError;
import org.ihtsdotools.crs.exception.CRSRuntimeException;
import org.ihtsdotools.crs.ws.response.CRSErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 2:18 PM
 */
@ControllerAdvice
public class RuntimeExceptionController {

	   @ExceptionHandler(value = {CRSRuntimeException.class})
	   @ResponseStatus(HttpStatus.BAD_REQUEST)
	   @ResponseBody
	   public CRSErrorResponse handleCRSRuntimeException(CRSRuntimeException e) {
	      CRSError crsError = e.getCrsError();
	      CRSErrorResponse crsErrorResponse = new CRSErrorResponse();
	      crsErrorResponse.setErrorCode(crsError.getCode());
	      if(e.getCause() != null) {
	         crsErrorResponse.setMessage(e.getCause().getMessage());
	      } else {
	         crsErrorResponse.setMessage(crsError.getMessage());
	      }
	      return  crsErrorResponse;
	   }
}
