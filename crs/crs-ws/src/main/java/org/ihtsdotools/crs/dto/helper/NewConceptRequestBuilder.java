/**
 * 
 */
package org.ihtsdotools.crs.dto.helper;

import org.ihtsdotools.crs.dto.Request;

/**
 * @author Hunter Macdonald
 *
 */
public class NewConceptRequestBuilder extends RequestBuilder {

	public NewConceptRequestBuilder(String requestType) {
		super(requestType);
	}

	@Override
	public boolean validateRequest(Request request) {
		return false;
	}

}
