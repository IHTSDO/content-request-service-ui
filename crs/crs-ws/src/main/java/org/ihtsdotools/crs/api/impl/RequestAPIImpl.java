/**
 * 
 */
package org.ihtsdotools.crs.api.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.dozer.DozerBeanMapper;
import org.ihtsdotools.crs.api.RequestAPI;
import org.ihtsdotools.crs.dao.RequestDao;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.dto.enumeration.StatusValues;
import org.ihtsdotools.crs.dto.helper.RequestBuilder;
import org.ihtsdotools.crs.dto.helper.validation.RequestItemValidator;
import org.ihtsdotools.crs.exception.CRSError;
import org.ihtsdotools.crs.exception.CRSRuntimeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

/**
 * @author Hunter Macdonald
 *
 */
@Service
public class RequestAPIImpl implements RequestAPI {

	@Autowired
	private RequestBuilder requestBuilder;

	@Autowired
	private RequestItemValidator requestItemValidator;

	@Autowired
	private RequestDao requestDao;

	/*@Autowired
	private JiraClient jiraClient;*/

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private DozerBeanMapper dozerBeanMapper;


	@Override
	@Transactional
	public Request createRequest(String requestType, Map<String, Object> requestInfo) {
		Request request =  requestBuilder.build(requestType, requestInfo);
		request.setRfcNumber(UUID.randomUUID().toString());
		request.setStatus(StatusValues.NEW.toString());
		request.setStatusDate(new Date());
		request = requestDao.save(request);
		return request;
	}


	@Override
	public Request submitRequest(String requestId) {
		Request request = requestDao.findOne(requestId);
		if(request == null) throw new CRSRuntimeException(CRSError.REQUEST_INVALID);
		// Validate saved request fields before submitting. If it is not valid, throw a runtime exception
		requestItemValidator.validateRequestItems(request);
		request.setStatus(StatusValues.SUBMITTED.toString());
		request.setStatusDate(new Date());
		request.setRequestDate(new Date());
		request = requestDao.save(request);
		//createJiraIssue(request);
		return request;
	}

	private void createJiraIssue(Request request) {
		/*Issue issue = new Issue();
		IssueType issueType = new IssueType(10101L, "SCT Content Request Batch", false, "A batch of SCT Content Requests");
		issue.setIssueType(issueType);
		issue.setProjectKey("CRT");
		RequestItem requestItem = request.getWorkItems().get(0);
		issue.setSummary(new StringBuilder().append(requestItem.getRequestType()).toString());
		RequestDto requestDto = dozerBeanMapper.map(request, RequestDto.class);
		try {
			issue.setDescription(objectMapper.writer().withDefaultPrettyPrinter().writeValueAsString(requestDto));
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		jiraClient.createIssue(issue);
		jiraClient.close();*/
	}

	@Override
	public Request updateRequest(String requestId, Map<String, Object> requestInfo) {
		Request request = requestDao.findRequestWithRequestItems(requestId);
		if(request == null) throw new CRSRuntimeException(CRSError.REQUEST_INVALID);
		requestBuilder.build(request, requestInfo);
		request = requestDao.save(request);
		return request;
	}


	@Override
	public Collection<Request> getAllRequests() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public Collection<Request> getRequestByProject(Long projectId) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public Collection<Request> getSubmitedRequest(String userId) {
		return requestDao.findBySubmiter(userId);
	}


	@Override
	public Collection<Request> getAssignedRequest(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

}
