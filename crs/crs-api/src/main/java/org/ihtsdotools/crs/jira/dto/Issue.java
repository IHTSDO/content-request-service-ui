/**
 * 
 */
package org.ihtsdotools.crs.jira.dto;

import java.util.Date;
import java.util.List;
import java.util.Set;


/**
 * @author Hunter Macdonald
 *
 */
public class Issue {

	private String key;
	private Status status;
	private IssueType issueType;
	private String projectKey;
	private String summary;
	private String description;
	private String assigneeUserId;

	private Date creationDate;
	private Date updateDate;
	private Date dueDate;

	private List<Comment> comments;
	private Set<Issue> relatedIssues;
	private Set<String> labels;
	
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public IssueType getIssueType() {
		return issueType;
	}
	public void setIssueType(IssueType issueType) {
		this.issueType = issueType;
	}
	public String getProjectKey() {
		return projectKey;
	}
	public void setProjectKey(String projectId) {
		this.projectKey = projectId;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getAssigneeUserId() {
		return assigneeUserId;
	}
	public void setAssigneeUserId(String assigneeUserId) {
		this.assigneeUserId = assigneeUserId;
	}
	public Date getCreationDate() {
		return creationDate;
	}
	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public Date getDueDate() {
		return dueDate;
	}
	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}
	public List<Comment> getComments() {
		return comments;
	}
	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}
	public Set<Issue> getRelatedIssues() {
		return relatedIssues;
	}
	public void setRelatedIssues(Set<Issue> relatedIssues) {
		this.relatedIssues = relatedIssues;
	}
	public Set<String> getLabels() {
		return labels;
	}
	public void setLabels(Set<String> labels) {
		this.labels = labels;
	}

}
