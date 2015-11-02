/**
 * 
 */
package org.ihtsdotools.crs.dto;

import java.io.Serializable;
import java.util.Date;

/**
 * @author Hunter Macdonald
 * TODO: add javadoc from confluence
 */
public class Status implements Serializable {
	
	/**
	 * Serial Version ID, to be re-generated when there are code changes in this class
	 */
	private static final long serialVersionUID = 3235309743350669097L;
	private Long id;
	private String status;
	private Date statusDate;
	private Request request; //FK to Request. Should be Null if workItemId not null
	private RequestItem requestItem; //FK to workItem. Should be Null if rfcNumber not null
	private String authorUserId;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Date getStatusDate() {
		return statusDate;
	}
	public void setStatusDate(Date statusDate) {
		this.statusDate = statusDate;
	}
	
	public String getAuthorUserId() {
		return authorUserId;
	}
	public void setAuthorUserId(String authorUserId) {
		this.authorUserId = authorUserId;
	}
	public Request getRequest() {
		return request;
	}
	public void setRequest(Request request) {
		this.request = request;
	}
	public RequestItem getRequestItem() {
		return requestItem;
	}
	public void setRequestItem(RequestItem requestItem) {
		this.requestItem = requestItem;
	}
}
