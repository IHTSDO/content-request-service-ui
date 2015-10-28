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
	private Long rfcNumber; //FK to Request. Should be Null if workItemId not null
	private Long workItemId; //FK to workItem. Should be Null if rfcNumber not null
	
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
	public Long getRfcNumber() {
		return rfcNumber;
	}
	public void setRfcNumber(Long rfcNumber) {
		this.rfcNumber = rfcNumber;
	}
	public Long getWorkItemId() {
		return workItemId;
	}
	public void setWorkItemId(Long workItemId) {
		this.workItemId = workItemId;
	}
}
