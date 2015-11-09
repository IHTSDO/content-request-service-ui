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
	public Request createRequest(Map<String, Object> requestInfo);
	
	/**
	 * TODO: Clarify this use-case
	 * @param requestId
	 * @return
	 */
	public Request submitRequest(String requestId);
	public Request updateRequest(String requestId, Map<String, Object> requestInfo);

	public Request getRequestDetails(String requestId);
	
	public Collection<Request> getAllRequests();
	public Collection<Request> getRequestByProject(Long projectId);
	//TODO in Sprint 2: public Collection<Request> getRequestByCriteria(List<Criteria> criterium); 
	public Collection<Request> getSubmitedRequests();
	public Collection<Request> getAssignedRequest(String userId);
}
