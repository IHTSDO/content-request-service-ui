package org.ihtsdotools.crs.ws.dto;

import java.util.List;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 4:05 PM
 */
public class RequestDto {
   /**
    * REQUEST HEADER
    */
   private String rfcNumber; //Primary Key
   private String approvalAuthorityId;
   private String ogirinatorId;
   private String requestorId;
   private Long requestDate;
   private String status;
   private Long statusDate;
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

   private List<RequestItemDto> workItems;

   public String getRfcNumber() {
      return rfcNumber;
   }

   public void setRfcNumber(String rfcNumber) {
      this.rfcNumber = rfcNumber;
   }

   public String getApprovalAuthorityId() {
      return approvalAuthorityId;
   }

   public void setApprovalAuthorityId(String approvalAuthorityId) {
      this.approvalAuthorityId = approvalAuthorityId;
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

   public Long getRequestDate() {
      return requestDate;
   }

   public void setRequestDate(Long requestDate) {
      this.requestDate = requestDate;
   }

   public String getStatus() {
      return status;
   }

   public void setStatus(String status) {
      this.status = status;
   }

   public Long getStatusDate() {
      return statusDate;
   }

   public void setStatusDate(Long statusDate) {
      this.statusDate = statusDate;
   }

   public String getJustifCategory() {
      return justifCategory;
   }

   public void setJustifCategory(String justifCategory) {
      this.justifCategory = justifCategory;
   }

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

   public List<RequestItemDto> getWorkItems() {
      return workItems;
   }

   public void setWorkItems(List<RequestItemDto> workItems) {
      this.workItems = workItems;
   }
}
