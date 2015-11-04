/**
 * 
 */
package org.ihtsdotools.crs.api.impl;

import java.util.Collection;
import java.util.Map;

import org.ihtsdotools.crs.api.RequestAPI;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.dto.helper.RequestBuilderLocator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Hunter Macdonald
 *
 */
@Service
public class RequestAPIImpl implements RequestAPI {

	@Autowired
	private RequestBuilderLocator requestBuilderLocator;

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.api.RequestAPI#createRequest(org.ihtsdotools.crs.dto.Request)
	 */

	@Override
	public Request createRequest(String requestType, Map<String, Object> requestInfo) {
		return requestBuilderLocator.getBuilder(requestType).build(requestInfo);
	}

	/* (non-Javadoc)
       * @see org.ihtsdotools.crs.api.RequestAPI#submitRequest(java.lang.Long)
       */
	@Override
	public Request submitRequest(Long requestId) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.api.RequestAPI#updateRequest(org.ihtsdotools.crs.dto.Request)
	 */
	@Override
	public Request updateRequest(Request requestInfo) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.api.RequestAPI#getAllRequests()
	 */
	@Override
	public Collection<Request> getAllRequests() {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.api.RequestAPI#getRequestByProject(java.lang.Long)
	 */
	@Override
	public Collection<Request> getRequestByProject(Long projectId) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.api.RequestAPI#getSubmitedRequest(java.lang.String)
	 */
	@Override
	public Collection<Request> getSubmitedRequest(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.api.RequestAPI#getAssignedRequest(java.lang.String)
	 */
	@Override
	public Collection<Request> getAssignedRequest(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

}
