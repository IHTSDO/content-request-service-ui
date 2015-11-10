/**
 * 
 */
package org.ihtsdotools.crs.jira.api.impl;

import java.net.URI;

import org.apache.http.impl.client.DefaultHttpClient;
import org.ihtsdotools.crs.jira.api.JiraClient;
import org.ihtsdotools.crs.jira.dto.Issue;
import org.ihtsdotools.crs.jira.util.BeanUtil;

import net.rcarz.jiraclient.Field;
import net.rcarz.jiraclient.JiraException;
import net.rcarz.jiraclient.RestClient;


/**
 * @author Hunter Macdonald
 *
 */
public class JiraClientImpl implements JiraClient {
	private final RestClient restClient;
	private final JiraTokenCredentials credentials;
	
	JiraClientImpl(JiraTokenCredentials credentials, URI uri) throws JiraException {
		this.restClient = new RestClient(new DefaultHttpClient(), credentials, uri);
		this.credentials = credentials;
		this.credentials.initialize(restClient);
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.jira.api.JiraClient#getIssueByKey(java.lang.String)
	 */
	@Override
	public Issue getIssueByKey(String key) {
		net.rcarz.jiraclient.Issue rcarz;
		try {
			rcarz = net.rcarz.jiraclient.Issue.get(restClient, key);
			return BeanUtil.createIssueDTO(rcarz);
		} catch (JiraException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	/* (non-Javadoc)
	 * @see org.ihtsdotools.crs.jira.api.JiraClient#createIssue(org.ihtsdotools.crs.jira.dto.Issue)
	 */
	@Override
	public Issue createIssue(Issue issue) {
		net.rcarz.jiraclient.Issue rcarz;
		try {
			rcarz = net.rcarz.jiraclient.Issue.create(
					restClient, issue.getProjectKey(), issue.getIssueType().getName())
			        .field(Field.SUMMARY, issue.getSummary())
			        .field(Field.DESCRIPTION, issue.getDescription())
			       // .field(Field.REPORTER, credentials.getLogonName())
			        .execute();
		} catch (JiraException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw new RuntimeException(e);
		}
		issue.setKey(rcarz.getKey());
		return issue;
	}

	@Override
	public void close() {
		
	}

}
