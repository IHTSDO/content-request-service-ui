/**
 * 
 */
package org.ihtsdotools.crs.jira.dto;

import java.util.Date;

/**
 * @author Hunter Macdonald
 *
 */
public class Comment {
	private Long id;
	private String body;
	private String authorUserId;
	
	private Date createDate;
	private Date updateDate;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getAuthorUserId() {
		return authorUserId;
	}
	public void setAuthorUserId(String authorUserId) {
		this.authorUserId = authorUserId;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	
}
