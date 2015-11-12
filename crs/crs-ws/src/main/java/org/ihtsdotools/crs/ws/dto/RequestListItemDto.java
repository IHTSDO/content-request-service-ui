package org.ihtsdotools.crs.ws.dto;

/**
 * User: huyle
 * Date: 11/9/2015
 * Time: 3:01 PM
 */
public class RequestListItemDto {

   private String rfcNumber; //Primary Key
   private Long requestDate;
   private String status;
   private Long statusDate;
   private String ticketId;
   private String requestType;
   private String batchId;
   private String requestorInternalId;

   public String getRfcNumber() {
      return rfcNumber;
   }

   public void setRfcNumber(String rfcNumber) {
      this.rfcNumber = rfcNumber;
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

   public String getTicketId() {
      return ticketId;
   }

   public void setTicketId(String ticketId) {
      this.ticketId = ticketId;
   }

   public String getRequestType() {
      return requestType;
   }

   public void setRequestType(String requestType) {
      this.requestType = requestType;
   }

   public String getBatchId() {
      return batchId;
   }

   public void setBatchId(String batchId) {
      this.batchId = batchId;
   }

   public String getRequestorInternalId() {
      return requestorInternalId;
   }

   public void setRequestorInternalId(String requestorInternalId) {
      this.requestorInternalId = requestorInternalId;
   }
}
