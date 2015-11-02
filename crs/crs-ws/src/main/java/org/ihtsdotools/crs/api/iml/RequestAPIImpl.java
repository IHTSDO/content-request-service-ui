/**
 * 
 */
package org.ihtsdotools.crs.api.iml;

import java.util.Collection;

import org.ihtsdotools.crs.api.RequestAPI;
import org.ihtsdotools.crs.dto.Request;

/**
 * @author Hunter Macdonald
 *
 */
public class RequestAPIImpl implements RequestAPI {

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.api.RequestAPI#createRequest(org.ihtsdotools.crs.dto.Request)
	 */
	@Override
	public Request createRequest(Request requestInfo) {
		// TODO Auto-generated method stub
		return null;
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
