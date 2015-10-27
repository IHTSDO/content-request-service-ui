package org.ihtsdotools.crs.ims;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import org.springframework.test.context.support.GenericXmlContextLoader;
import org.springframework.web.client.RestTemplate;

/**
 * Unit test for simple App.
 */
@ContextConfiguration("classpath*:http-context.xml")
@RunWith(SpringJUnit4ClassRunner.class)
public class AppTest {
	@Autowired
	private RestTemplate restTemplate;
	
	@Test
	public void restTemplateShouldNotNull() {
		Assert.assertNotNull(restTemplate);
	}
	
	@Test
	public void testLoginJira() {
		String url = "https://dev-jira.ihtsdotools.org/rest/auth/1/session";
		Map<String, String> credential = new HashMap<String, String>();
		credential.put("username", "pbui");
		credential.put("password", "Sn0m3dCT");
		ResponseEntity<Map> responseEntity = 
				restTemplate.postForEntity(url, credential, Map.class);
		Assert.assertNotNull(responseEntity);
		
		Map<?,?> resBody = responseEntity.getBody();
		Map<?,?> session = (Map<?,?>) resBody.get("session");
		System.out.println("Session: ");
		Assert.assertNotNull(session);
		for(Entry<?, ?> entry : session.entrySet()) {
			System.out.println("\t" + entry.getKey() + ": " + entry.getValue());
		}
		
		Map<?, ?> loginInfo = (Map<?,?>) resBody.get("loginInfo");
		Assert.assertNotNull(loginInfo);
		System.out.println("LoginInfo: (" + loginInfo.size() + " items)");
		for(Entry<?, ?> entry : loginInfo.entrySet()) {
			System.out.println("\t" + entry.getKey() + ": " + entry.getValue());
		}
	}
}
