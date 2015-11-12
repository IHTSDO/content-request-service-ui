/**
 * 
 */
package org.ihtsdotools.crs.ws;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Hunter Macdonald
 *
 */
@RestController
@RequestMapping("/error")
public class ExceptionController {
	
	@RequestMapping(value = "/401", method = RequestMethod.GET, produces="application/json")
	@ResponseBody
	public Map<String, Object> unauthorized() {
	    Map<String, String> error = new HashMap<String, String>();
	    error.put("code", String.valueOf(HttpStatus.UNAUTHORIZED.value()));
	    error.put("message", HttpStatus.UNAUTHORIZED.getReasonPhrase());
	    
	    Map<String, Object> result = new HashMap<String, Object>();
	    result.put("success", Boolean.FALSE);
	    result.put("requestLoad", null);
	    result.put("error", error);
	    return result;
	}
}
