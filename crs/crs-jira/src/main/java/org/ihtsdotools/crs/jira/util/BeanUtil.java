/**
 * 
 */
package org.ihtsdotools.crs.jira.util;

import org.ihtsdotools.crs.jira.dto.Status;

import net.rcarz.jiraclient.Issue;

/**
 * @author Hunter Macdonald
 *
 */
public class BeanUtil {
	public static org.ihtsdotools.crs.jira.dto.Issue createIssueDTO(Issue issue) {
		org.ihtsdotools.crs.jira.dto.Issue dto = new org.ihtsdotools.crs.jira.dto.Issue();
		if(issue.getAssignee() != null)
			dto.setAssigneeUserId(issue.getAssignee().getId());
		dto.setCreationDate(issue.getCreatedDate());
		dto.setDescription(issue.getDescription());
		dto.setSummary(issue.getSummary());
		if(issue.getStatus() != null) {
			
			Status status = new Status(
					Long.valueOf(issue.getStatus().getId()), 
					issue.getStatus().getName());
			dto.setStatus(status);
		}
		dto.setKey(issue.getKey());
		//TODO dto.setCreatedBy
		return dto;
	}
}
