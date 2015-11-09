/**
 * 
 */
package org.ihtsdotools.crs.api.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.dozer.DozerBeanMapper;
import org.ihtsdotools.crs.api.RequestAPI;
import org.ihtsdotools.crs.dao.RequestDao;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.dto.RequestItem;
import org.ihtsdotools.crs.dto.enumeration.StatusValues;
import org.ihtsdotools.crs.dto.helper.RequestBuilder;
import org.ihtsdotools.crs.dto.helper.validation.RequestItemValidator;
import org.ihtsdotools.crs.exception.CRSError;
import org.ihtsdotools.crs.exception.CRSRuntimeException;
import org.ihtsdotools.crs.jira.api.JiraClient;
import org.ihtsdotools.crs.jira.dto.Issue;
import org.ihtsdotools.crs.jira.dto.IssueType;
import org.ihtsdotools.crs.security.AuthenticationUtils;
import org.ihtsdotools.crs.ws.dto.RequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
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
	public Request createRequest(Map<String, Object> requestInfo) {
		Request request =  requestBuilder.build(requestInfo);
		String currentUser = AuthenticationUtils.getCurrentUserName();
		request.setOgirinatorId(currentUser);
		request.setRfcNumber(UUID.randomUUID().toString());
		request.setStatus(StatusValues.DRAFT.toString());
		request.setRequestDate(new Date());
		request = requestDao.save(request);
		return request;
	}


	@Override
	@Transactional
	public Request submitRequest(String requestId) {
		Request request = requestDao.findRequestWithRequestItems(requestId);
		if(request == null) throw new CRSRuntimeException(CRSError.REQUEST_INVALID);
		// Validate saved request fields before submitting. If it is not valid, throw a runtime exception
		requestItemValidator.validateRequestItems(request);
		String currentUser = AuthenticationUtils.getCurrentUserName();
		request.setRequestorId(currentUser);
		request.setStatus(StatusValues.NEW.toString());
		request.setStatusDate(new Date());
		request = requestDao.save(request);
		/*Issue issue = createJiraIssue(request);
		request.retrieveSingleRequestWorkItem().setTicketId(issue.getKey());*/
		return request;
	}

	/*private Issue createJiraIssue(Request request) {
		Issue issue = new Issue();
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
		jiraClient.close();
		return issue;
	}*/

	@Override
	@Transactional
	public Request updateRequest(String requestId, Map<String, Object> requestInfo) {
		Request request = requestDao.findRequestWithRequestItems(requestId);
		if(request == null) throw new CRSRuntimeException(CRSError.REQUEST_INVALID);
		requestBuilder.build(request, requestInfo);
		request = requestDao.save(request);
		return request;
	}

	@Override
	@Transactional(readOnly = true)
	public Request getRequestDetails(String requestId) {
		Request request = requestDao.findRequestWithRequestItems(requestId);
		if(request == null) throw new CRSRuntimeException(CRSError.REQUEST_INVALID);
		return request;
	}

	@Override
	@Transactional(readOnly = true)
	public Collection<Request> getAllRequests() {
		return requestDao.findAllRequests();
	}


	@Override
	public Collection<Request> getRequestByProject(Long projectId) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	@Transactional(readOnly = true)
	public Collection<Request> getSubmitedRequests() {
		String currentUser = AuthenticationUtils.getCurrentUserName();
		return requestDao.findBySubmiter(currentUser);
	}

	@Override
	public Collection<Request> getAssignedRequest(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

}
