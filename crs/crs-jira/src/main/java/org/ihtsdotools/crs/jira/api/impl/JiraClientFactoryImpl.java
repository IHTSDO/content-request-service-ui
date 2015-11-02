package org.ihtsdotools.crs.jira.api.impl;

import java.net.URI;

import org.ihtsdotools.crs.jira.api.JiraClient;
import org.ihtsdotools.crs.jira.api.JiraClientFactory;
import org.springframework.stereotype.Component;

import com.atlassian.jira.rest.client.api.AuthenticationHandler;
import com.atlassian.jira.rest.client.api.JiraRestClient;
import com.atlassian.jira.rest.client.auth.BasicHttpAuthenticationHandler;
import com.atlassian.jira.rest.client.internal.async.AsynchronousJiraRestClientFactory;

@Component
public class JiraClientFactoryImpl implements JiraClientFactory {
	
	private final String jiraUriStr = "https://dev-jira.ihtsdotools.org"; //TODO: load from app properties
	private final String jiraLogin = "pbui"; //TODO: load from app properties
	private final String password = "Sn0m3dCT"; //TODO: load from app properties

	private final URI jiraUri = URI.create(jiraUriStr);
	private final AuthenticationHandler jiraAuthHandler = 
			new BasicHttpAuthenticationHandler(jiraLogin, password);
	private final AsynchronousJiraRestClientFactory factory = new AsynchronousJiraRestClientFactory();
	
	private JiraRestClient getRestClient() {
		//TODO: Rest Client Pooling

		return factory.create(jiraUri, jiraAuthHandler);
	}
			
	@Override
	public JiraClient getClient() {
		JiraClientImpl client = new JiraClientImpl();
		client.setRestClient(getRestClient());
		return client;
	}

}
