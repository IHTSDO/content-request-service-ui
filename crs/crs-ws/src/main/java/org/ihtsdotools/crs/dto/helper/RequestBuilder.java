/**
 * 
 */
package org.ihtsdotools.crs.dto.helper;

import java.util.Map;

import org.ihtsdotools.crs.dto.Request;

/**
 * @author Hunter Macdonald
 *
 */
public abstract class RequestBuilder {
	
	/**
	 * TODO: set properties that are specific for this RequestType <br>
	 * TODO: validate against the input map and throw a Runtime Exception if there are validation errors
	 */
	public abstract void setSpecificProperties(Request request, Map<String, Object> requestInput);
	
	/**
	 * TODO: set properties that are specific for this RequestType <br>
	 * TODO: validate against the input map and throw a Runtime Exception if there are validation errors
	 */
	public void setCommonProperties(Request request, Map<String, Object> requestInput) {
		//TODO: copy common properties from requestInput to request
	}
	
	public Request build(Map<String, Object> requestInput) {
		Request request = new Request();
		setCommonProperties(request, requestInput);
		setSpecificProperties(request, requestInput);
		return request;
	}
}
