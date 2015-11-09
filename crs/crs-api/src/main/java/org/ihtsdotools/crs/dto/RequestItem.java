/**
 * 
 */
package org.ihtsdotools.crs.dto;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;

/**
 * @author Hunter Macdonald
 *
 */
public class RequestItem implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2562178420402668466L;

	/**
	 * 
	 */
	public RequestItem() {
		// TODO Auto-generated constructor stub
	}

	//JIRA ticket ID
	private String ticketId;

	//REQUEST ITEM INFORMATION:
	private Long id; //Primary key
	//private Long rfcNumber; //Foreign key to Request
	private Request request;
	private String requestorInternalId;
	private String requestorInternalTerm;
	private String requestType;
	private String artifactReleaseVersion;
	private String rejectionImpact;
	private String reasonForChange;
	private String description;
	private String justifDescription;
	private String notes;
	private String reference;
	private Date appealDate;
	private Date targetReleaseDate;
	//REQUEST ITEM INFORMATION END
	
	//CONCEPT INFORMATION
	private String conceptId; //Also used as sourceConceptId of relationship
	private String conceptFSN; //NOT used as proposed FSN
	private String conceptPT; //Also used as proposed PT
	private String conceptDescription; //Current description
	private String parentId;
	private String parentFSN;
	private String historyAttribute;
	private String historyAttributeValue;
	private String proposedDefinition;
	private String proposedSynonym;
	private String proposedDescription;
	private String proposedFSN;
	private String proposedStatus;
	private Boolean descriptionIsPT;
	//CONCEPT INFORMATION END
	
	//DESCRIPTION INFO
	private String descriptionId;
	private String caseSignificance;
	private String descriptionStatus;
	//DESCRIPTION INFO END
	
	//TODO: REFSET INFO	
	//TODO: CROSS-MAP INFO
	//TODO: TRANSLATION INFO
	
	//RELATIONSHIP INFORMATION
	//conceptId is used as sourceConceptId of relationship
	private String destConceptId;
	private String relationshipType;
	private String characteristicType;
	private Boolean refinable;
	private Long relationshipGroup;
	//RELATIONSHIP INFORMATION END
	
	Collection<Status> statusLog;
	/**
	 * Primary key.
	 * Request Work Item ID, the identifier of the work item associated with the <br>
	 * individual request (i.e. request batch) grouping of requests as a single <br>
	 * work item
	 * @return ID of this request item
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * Primary key
	 * Request Work Item ID, the identifier of the work item associated with the <br>
	 * individual request (i.e. request batch) grouping of requests as a single <br>
	 * work item
	 * @param ID of this request item
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * The action required to fulfill the request. <br>
	 * Possible values: <br>
	 * "New Concept", "Change Concept", "Retire Concept", <br>
	 * "New Description", "Change Description", "Retire Description", <br>
	 * "New Relationship", "New Refset"
	 * 
	 * @return the request type of this request item
	 */
	public String getRequestType() {
		return requestType;
	}

	/**
	 * The action required to fulfill the request. <br>
	 * Possible values: <br>
	 * "New Concept", "Change Concept", "Retire Concept", <br>
	 * "New Description", "Change Description", "Retire Description", <br>
	 * "New Relationship", "New Refset"
	 * 
	 * @return the request type of this request item
	 */
	public void setRequestType(String requestType) {
		this.requestType = requestType;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getJustifDescription() {
		return justifDescription;
	}
	public void setJustifDescription(String justifDescription) {
		this.justifDescription = justifDescription;
	}
	public String getArtifactReleaseVersion() {
		return artifactReleaseVersion;
	}
	public void setArtifactReleaseVersion(String artifactReleaseVersion) {
		this.artifactReleaseVersion = artifactReleaseVersion;
	}

	/**
	 * The identifier of the component that is the subject of the request. <br>
	 * If a new concept request, this is the parent of the requested concept. <br>
	 * For all other request types it is the ID of the existing component<br>
	 *  implicated by the request.
	 * @return
	 */
	public String getParentId() {
		return parentId;
	}

	/**
	 * The identifier of the component that is the subject of the request. <br>
	 * If a new concept request, this is the parent of the requested concept. <br>
	 * For all other request types it is the ID of the existing component<br>
	 *  implicated by the request.
	 * @return
	 */
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getParentFSN() {
		return parentFSN;
	}

	public void setParentFSN(String parentFSN) {
		this.parentFSN = parentFSN;
	}

	/**
	 * An alphanumeric value that requestor can define to uniquely identify this request<br>
	 *  in their database (or spreadsheet). 
	 * @return
	 */
	public String getRequestorInternalId() {
		return requestorInternalId;
	}

	/**
	 * An alphanumeric value that requestor can define to uniquely identify this request<br>
	 *  in their database (or spreadsheet). 
	 * @return
	 */
	public void setRequestorInternalId(String submiterLocalId) {
		this.requestorInternalId = submiterLocalId;
	}

	/**
	 * An alphanumeric value that requestor can define to uniquely identify this request<br>
	 *  in their database (or spreadsheet). 
	 * @return
	 */
	public String getRequestorInternalTerm() {
		return requestorInternalTerm;
	}

	/**
	 * An alphanumeric value that requestor can define to uniquely identify this request<br>
	 *  in their database (or spreadsheet). 
	 * @return
	 */
	public void setRequestorInternalTerm(String submiterLocalTerm) {
		this.requestorInternalTerm = submiterLocalTerm;
	}

	public Date getAppealDate() {
		return appealDate;
	}

	public void setAppealDate(Date appealDate) {
		this.appealDate = appealDate;
	}

	public Date getTargetReleaseDate() {
		return targetReleaseDate;
	}

	public void setTargetReleaseDate(Date targetReleaseDate) {
		this.targetReleaseDate = targetReleaseDate;
	}

	public String getRejectionImpact() {
		return rejectionImpact;
	}

	public void setRejectionImpact(String rejectionImpact) {
		this.rejectionImpact = rejectionImpact;
	}

	public String getReasonForChange() {
		return reasonForChange;
	}

	public void setReasonForChange(String reasonForChange) {
		this.reasonForChange = reasonForChange;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getReference() {
		return reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
	}

	public String getConceptId() {
		return conceptId;
	}

	public void setConceptId(String conceptId) {
		this.conceptId = conceptId;
	}

	public String getConceptFSN() {
		return conceptFSN;
	}

	public void setConceptFSN(String conceptFSN) {
		this.conceptFSN = conceptFSN;
	}

	public String getConceptPT() {
		return conceptPT;
	}

	public void setConceptPT(String conceptPT) {
		this.conceptPT = conceptPT;
	}

	public String getConceptDescription() {
		return conceptDescription;
	}

	public void setConceptDescription(String conceptDescription) {
		this.conceptDescription = conceptDescription;
	}

	public String getHistoryAttribute() {
		return historyAttribute;
	}

	public void setHistoryAttribute(String historyAttribute) {
		this.historyAttribute = historyAttribute;
	}

	public String getHistoryAttributeValue() {
		return historyAttributeValue;
	}

	public void setHistoryAttributeValue(String historyAttributeValue) {
		this.historyAttributeValue = historyAttributeValue;
	}

	public String getProposedDefinition() {
		return proposedDefinition;
	}

	public void setProposedDefinition(String proposedDefinition) {
		this.proposedDefinition = proposedDefinition;
	}

	public String getProposedSynonym() {
		return proposedSynonym;
	}

	public void setProposedSynonym(String proposedSynonym) {
		this.proposedSynonym = proposedSynonym;
	}

	public String getProposedDescription() {
		return proposedDescription;
	}

	public void setProposedDescription(String proposedDescription) {
		this.proposedDescription = proposedDescription;
	}

	public String getProposedFSN() {
		return proposedFSN;
	}

	public void setProposedFSN(String proposedFSN) {
		this.proposedFSN = proposedFSN;
	}

	public String getProposedStatus() {
		return proposedStatus;
	}

	public void setProposedStatus(String proposedStatus) {
		this.proposedStatus = proposedStatus;
	}

	public Boolean getDescriptionIsPT() {
		return descriptionIsPT;
	}

	public void setDescriptionIsPT(Boolean descriptionIsPT) {
		this.descriptionIsPT = descriptionIsPT;
	}

	public String getDescriptionId() {
		return descriptionId;
	}

	public void setDescriptionId(String descriptionId) {
		this.descriptionId = descriptionId;
	}

	public String getCaseSignificance() {
		return caseSignificance;
	}

	public void setCaseSignificance(String caseSignificance) {
		this.caseSignificance = caseSignificance;
	}

	public String getDescriptionStatus() {
		return descriptionStatus;
	}

	public void setDescriptionStatus(String descriptionStatus) {
		this.descriptionStatus = descriptionStatus;
	}

	public String getDestConceptId() {
		return destConceptId;
	}

	public void setDestConceptId(String destConceptId) {
		this.destConceptId = destConceptId;
	}

	public String getRelationshipType() {
		return relationshipType;
	}

	public void setRelationshipType(String relationshipType) {
		this.relationshipType = relationshipType;
	}

	public String getCharacteristicType() {
		return characteristicType;
	}

	public void setCharacteristicType(String characteristicType) {
		this.characteristicType = characteristicType;
	}

	public Boolean getRefinable() {
		return refinable;
	}

	public void setRefinable(Boolean refinable) {
		this.refinable = refinable;
	}

	public Long getRelationshipGroup() {
		return relationshipGroup;
	}

	public void setRelationshipGroup(Long relationshipGroup) {
		this.relationshipGroup = relationshipGroup;
	}

/*	public Long getRfcNumber() {
		return rfcNumber;
	}
	public void setRfcNumber(Long rfcNumber) {
		this.rfcNumber = rfcNumber;
	}
*/
	public Request getRequest() {
		return request;
	}

	public void setRequest(Request request) {
		this.request = request;
	}

	public Collection<Status> getStatusLog() {
		return statusLog;
	}

	public void setStatusLog(Collection<Status> statusLog) {
		this.statusLog = statusLog;
	}

	public String getTicketId() {
		return ticketId;
	}

	public void setTicketId(String ticketId) {
		this.ticketId = ticketId;
	}
}
