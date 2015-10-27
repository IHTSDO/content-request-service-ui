/**
 * 
 */
package org.ihtsdotools.crs.common.jira.api;

import org.ihtsdotools.crs.common.jira.dto.Issue;

/**
 * @author Hunter Macdonald
 *
 */
public interface JiraClient {
	public Issue getIssueById(Long id);
	public Issue getIssueByKey(String key);
	public Issue createIssue(Issue issue);
}
