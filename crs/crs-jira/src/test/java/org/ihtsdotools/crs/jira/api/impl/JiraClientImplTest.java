/**
 * 
 */
package org.ihtsdotools.crs.jira.api.impl;

import org.ihtsdo.otf.im.domain.IHTSDOStubUser;
import org.ihtsdo.otf.im.domain.IHTSDOUser;
import org.ihtsdotools.crs.jira.api.JiraClient;
import org.ihtsdotools.crs.jira.api.JiraClientFactory;
import org.ihtsdotools.crs.jira.dto.Issue;
import org.ihtsdotools.crs.jira.dto.IssueType;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * @author Hunter Macdonald
 *
 */
public class JiraClientImplTest {
	
	private static JiraClientFactory clientFactory;

	/**
	 * @throws java.lang.Exception
	 */
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		//"0O3F3MZw9hDAnsXMbSaDQQ00"
		IHTSDOUser user = new IHTSDOStubUser("pbui");
		Authentication authentication = 
				new UsernamePasswordAuthenticationToken(user, "lFU3xVbJXhAUiT19OZcSGw00");
		SecurityContextHolder.getContext().setAuthentication(authentication);
		clientFactory = new JiraClientFactoryImpl();
		
/*		RestTemplate restTemplate = new RestTemplate();
		restTemplate.

		HttpParams params = new BasicHttpParams();
		params.setParameter("j_username", "pbui");
		params.setParameter("j_password", "Sn0m3dCT");

		URI imsUri = new URI("https://dev-ims.ihtsdotools.org/j_security_check");
		HttpPost postReq = new HttpPost(imsUri);
		postReq.addHeader("Content-Type", "application/json");
		postReq.setParams(params);	
		
		HttpResponse response = new DefaultHttpClient().execute(postReq);
		
		int i = 9;
		System.out.println(i);
		return;*/
	}


	/**
	 * Test method for {@link org.ihtsdotools.crs.jira.api.impl.JiraClientImpl#getIssueByKey(java.lang.String)}.
	 */
	@Test
	public void testGetIssueByKey() {
		JiraClient client = clientFactory.getClient();
		Issue issue = client.getIssueByKey("CMTTF-2");
		System.out.println(issue.getKey() + " -- " + issue.getDescription());
	}

	/**
	 * Test method for {@link org.ihtsdotools.crs.jira.api.impl.JiraClientImpl#createIssue(org.ihtsdotools.crs.jira.dto.Issue)}.
	 */
	@Test
	public void testCreateIssue() {
		Issue issue = new Issue();
		IssueType issueType = new IssueType(10101L, "SCT Content Request Batch", false, "A batch of SCT Content Requests");
		issue.setIssueType(issueType);
		issue.setProjectKey("CRT");
		issue.setDescription("Test issue");
		issue.setSummary("We are testing creating issue");
		
		JiraClient jiraClient = clientFactory.getClient();
		jiraClient.createIssue(issue);
		jiraClient.close();
	}

}
