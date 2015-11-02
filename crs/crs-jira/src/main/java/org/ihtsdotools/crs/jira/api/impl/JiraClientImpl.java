/**
 * 
 */
package org.ihtsdotools.crs.jira.api.impl;

import java.io.IOException;

import org.ihtsdotools.crs.jira.api.JiraClient;
import org.ihtsdotools.crs.jira.dto.Issue;
import org.ihtsdotools.crs.jira.util.BeanUtil;
import org.springframework.stereotype.Component;

import com.atlassian.jira.rest.client.api.IssueRestClient;
import com.atlassian.jira.rest.client.api.JiraRestClient;
import com.atlassian.jira.rest.client.api.domain.BasicIssue;
import com.atlassian.jira.rest.client.api.domain.input.IssueInput;
import com.atlassian.jira.rest.client.api.domain.input.IssueInputBuilder;
import com.atlassian.util.concurrent.Promise;

/**
 * @author Hunter Macdonald
 *
 */
public class JiraClientImpl implements JiraClient {
	private JiraRestClient restClient;
	
	protected void setRestClient(JiraRestClient restClient) {
		this.restClient = restClient;
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.jira.api.JiraClient#getIssueByKey(java.lang.String)
	 */
	@Override
	public Issue getIssueByKey(String key) {
		// TODO Auto-generated method stub
		IssueRestClient issueClient = restClient.getIssueClient();
		Promise<com.atlassian.jira.rest.client.api.domain.Issue> promise = issueClient.getIssue(key);
		try {
			com.atlassian.jira.rest.client.api.domain.Issue jiraIssue = promise.get();
			return BeanUtil.createIssueDTO(jiraIssue);
		} catch (Exception e) {
			throw new RuntimeException(e);
		} 
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.jira.api.JiraClient#createIssue(org.ihtsdotools.crs.jira.dto.Issue)
	 */
	@Override
	public Issue createIssue(Issue issue) {
		IssueRestClient issueClient = restClient.getIssueClient();
		
		IssueInputBuilder issueBuilder = new IssueInputBuilder(issue.getProjectKey(), issue.getIssueType().getId());
		issueBuilder.setSummary(issue.getSummary());
		issueBuilder.setDescription(issue.getDescription());
		//TODO: build all other properties
		//...
		IssueInput issueInput = issueBuilder.build();
		Promise<BasicIssue> promise = issueClient.createIssue(issueInput);
		try {
			BasicIssue basicIssue = promise.get();
			issue.setKey(basicIssue.getKey());
		} catch (Exception e) {
			//TODO: handle exception
			throw new RuntimeException(e);
		}
		
		return issue;
	}

	@Override
	public void close() {
		try {
			restClient.close();
		} catch (IOException e) {
			//TODO: handle exception
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void finalize() throws Throwable {
		restClient.close();
		super.finalize();
	}

}
