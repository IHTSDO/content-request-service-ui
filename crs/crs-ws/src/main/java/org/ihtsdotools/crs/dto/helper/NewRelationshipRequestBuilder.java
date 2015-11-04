/**
 * 
 */
package org.ihtsdotools.crs.dto.helper;

import org.ihtsdotools.crs.dto.Request;

/**
 * @author Hunter Macdonald
 *
 */
public class NewRelationshipRequestBuilder extends RequestBuilder{

	public NewRelationshipRequestBuilder(String requestType) {
		super(requestType);
	}

	@Override
	public boolean validateRequest(Request request) {
		return false;
	}

}
