/**
 * 
 */
package org.ihtsdotools.crs.dto;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * @author Hunter Macdonald
 * TODO: add javadoc from confluence
 */
public class Request implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1607804625142076982L;

	/**
	 * 
	 */
	public Request() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * REQUEST HEADER
	 */
	private String rfcNumber; //Primary Key
	private String approvalAuthorityId;
	private String ogirinatorId;
	private String requestorId;
	private Date requestDate;
	private String status;
	private Date statusDate;
	private String justifCategory; 
	/**REQUEST HEADER END**/
	
	/**
	 * REQUEST INFORMATION
	 */
	private String userId;
	private String firstName;
	private String lastName;
	private String organization;
	private String jobTitle;
	private String phone;
	private String phoneType;
	private String email;
	/**REQUEST INFORMATION END**/
	
	private List<RequestItem> workItems;
	
	/**
	 * Historical status changes
	 */
	List<Status> statusLog;
	
	Project project;

	// REQUEST HEADER

	public String getApprovalAuthorityId() {
		return approvalAuthorityId;
	}
	public void setApprovalAuthorityId(String approvalAuthorityId) {
		this.approvalAuthorityId = approvalAuthorityId;
	}
	public String getRfcNumber() {
		return rfcNumber;
	}
	public void setRfcNumber(String rfcNumber) {
		this.rfcNumber = rfcNumber;
	}
	public String getOgirinatorId() {
		return ogirinatorId;
	}
	public void setOgirinatorId(String ogirinatorId) {
		this.ogirinatorId = ogirinatorId;
	}
	public String getRequestorId() {
		return requestorId;
	}
	public void setRequestorId(String requestorId) {
		this.requestorId = requestorId;
	}
	public Date getRequestDate() {
		return requestDate;
	}
	public void setRequestDate(Date requestDate) {
		this.requestDate = requestDate;
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
	public String getJustifCategory() {
		return justifCategory;
	}
	public void setJustifCategory(String justifCategory) {
		this.justifCategory = justifCategory;
	}
	//REQUEST HEADER END
	
	//REQUEST INFORMATION
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getOrganization() {
		return organization;
	}
	public void setOrganization(String organization) {
		this.organization = organization;
	}
	public String getJobTitle() {
		return jobTitle;
	}
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getPhoneType() {
		return phoneType;
	}
	public void setPhoneType(String phoneType) {
		this.phoneType = phoneType;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	//REQUEST INFORMATION END
	public List<Status> getStatusLog() {
		return statusLog;
	}
	public void setStatusLog(List<Status> statusLog) {
		this.statusLog = statusLog;
	}
	public List<RequestItem> getWorkItems() {
		return workItems;
	}
	public void setWorkItems(List<RequestItem> workItems) {
		this.workItems = workItems;
	}
	public Project getProject() {
		return project;
	}
	public void setProject(Project project) {
		this.project = project;
	}

	public RequestItem retrieveSingleRequestWorkItem() {
		return workItems.get(0);
	}
	
	
}
