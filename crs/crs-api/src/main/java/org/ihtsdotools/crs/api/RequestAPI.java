/**
 * 
 */
package org.ihtsdotools.crs.api;

import java.util.Collection;
import java.util.Map;

import org.ihtsdotools.crs.dto.Request;

/**
 * @author Hunter Macdonald
 *
 */
public interface RequestAPI {
	public Request createRequest(String requestType, Map<String, Object> requestInfo);
	
	/**
	 * TODO: Clarify this use-case
	 * @param requestId
	 * @return
	 */
	public Request submitRequest(Long requestId);
	public Request updateRequest(Request requestInfo);
	
	public Collection<Request> getAllRequests();
	public Collection<Request> getRequestByProject(Long projectId);
	//TODO in Sprint 2: public Collection<Request> getRequestByCriteria(List<Criteria> criterium); 
	public Collection<Request> getSubmitedRequest(String userId);
	public Collection<Request> getAssignedRequest(String userId);
}
