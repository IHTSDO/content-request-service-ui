package org.ihtsdotools.crs.jira;

import org.ihtsdotools.crs.jira.api.JiraClient;
import org.ihtsdotools.crs.jira.dto.Issue;
import org.ihtsdotools.crs.jira.dto.IssueType;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

/**
 * Unit test for simple App.
 */
//@RunWith(org.springframework.test.context.junit4.SpringJUnit4ClassRunner.class)
//@ContextConfiguration("/spring-beans.xml")
public class AppTest {
	
	//@Autowired
	JiraClient jiraClient;
	
	//@Test
	public void injectedBeansShouldNotNull() {
		Assert.assertNotNull(jiraClient);
	}
	
	
	
	//@Test
	public void testCreateIssue() {
		Issue issue = new Issue();
		IssueType issueType = new IssueType(10101L, "SCT Content Request Batch", false, "A batch of SCT Content Requests");
		issue.setIssueType(issueType);
		issue.setProjectKey("CRT");
		issue.setSummary("This issue is created for testing");
		issue.setDescription("This issue is created by Unit Test of CRS application");
		jiraClient.createIssue(issue);
		jiraClient.close();
	}
}
