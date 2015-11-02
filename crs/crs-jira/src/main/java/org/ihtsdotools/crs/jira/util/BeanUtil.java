/**
 * 
 */
package org.ihtsdotools.crs.jira.util;

import com.atlassian.jira.rest.client.api.domain.Issue;

/**
 * @author Hunter Macdonald
 *
 */
public class BeanUtil {
	public static org.ihtsdotools.crs.jira.dto.Issue createIssueDTO(Issue issue) {
		org.ihtsdotools.crs.jira.dto.Issue dto = new org.ihtsdotools.crs.jira.dto.Issue();
		//TODO Copy props from issue
		return dto;
	}
}
