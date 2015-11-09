/**
 * 
 */
package org.ihtsdotools.crs.jira.api.impl;

import static org.junit.Assert.*;

import java.net.URI;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;
import org.ihtsdo.otf.im.domain.IHTSDOStubUser;
import org.ihtsdo.otf.im.domain.IHTSDOUser;
import org.ihtsdotools.crs.jira.api.JiraClient;
import org.ihtsdotools.crs.jira.api.JiraClientFactory;
import org.ihtsdotools.crs.jira.dto.Issue;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.RestTemplate;

import net.rcarz.jiraclient.RestClient;
import net.sf.json.JSON;
import net.sf.json.JSONObject;

/**
 * @author Hunter Macdonald
 *
 */
public class JiraClientImplTest {
	
	private static JiraClientFactory clientFactory;

	/**
	 * @throws java.lang.Exception
	 */
//	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		//"0O3F3MZw9hDAnsXMbSaDQQ00"
		IHTSDOUser user = new IHTSDOStubUser("pbui");
		Authentication authentication = 
				new UsernamePasswordAuthenticationToken(user, "rlZm0s0dxJJGRPuXz8QdNQ00");
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
//	@Test
	public void testGetIssueByKey() {
		JiraClient client = clientFactory.getClient();
		Issue issue = client.getIssueByKey("CMTTF-2");
		System.out.println(issue.getKey() + " -- " + issue.getDescription());
	}

	/**
	 * Test method for {@link org.ihtsdotools.crs.jira.api.impl.JiraClientImpl#createIssue(org.ihtsdotools.crs.jira.dto.Issue)}.
	 */
//	@Test
	public void testCreateIssue() {
		fail("Not yet implemented");
	}

}
