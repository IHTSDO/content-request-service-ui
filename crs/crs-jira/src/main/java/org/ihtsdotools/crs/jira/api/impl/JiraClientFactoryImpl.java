package org.ihtsdotools.crs.jira.api.impl;

import java.net.URI;

import org.ihtsdo.otf.im.domain.IHTSDOUser;
import org.ihtsdotools.crs.jira.api.JiraClient;
import org.ihtsdotools.crs.jira.api.JiraClientFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import net.rcarz.jiraclient.JiraException;
import net.rcarz.jiraclient.Resource;

@Component
public class JiraClientFactoryImpl implements JiraClientFactory {
	
	private final String jiraUriStr = "https://dev-jira.ihtsdotools.org"; //TODO: load from app properties
	private final String apiRevision = "2";

	private final URI jiraUri = URI.create(jiraUriStr);
	
	public JiraClientFactoryImpl() {
		Resource.setApiRev(apiRevision);
	}
	
	@Override
	public JiraClient getClient() {
		String token = "", username = "";
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if(auth != null) {
			IHTSDOUser user = (IHTSDOUser) auth.getPrincipal();
			username = user.getUsername();
			token = auth.getCredentials().toString();
		}
		
		JiraTokenCredentials credentials = new JiraTokenCredentials(token, username);
		try {
			return new JiraClientImpl(credentials, jiraUri);
		} catch (JiraException e) {
			
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

}
