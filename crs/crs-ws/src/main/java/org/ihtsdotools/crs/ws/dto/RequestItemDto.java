package org.ihtsdotools.crs.ws.dto;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 4:18 PM
 */
public class RequestItemDto {

   //REQUEST ITEM INFORMATION:
   private Long id; //Primary key
   //private Long rfcNumber; //Foreign key to Request
   private String request;
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
   private Long appealDate;
   private Long targetReleaseDate;
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
   private String proposedCaseSignificance;
   private String proposedDescriptionStatus;
   //DESCRIPTION INFO END

   //TODO: REFSET INFO
   //TODO: CROSS-MAP INFO
   //TODO: TRANSLATION INFO

   //RELATIONSHIP INFORMATION
   //conceptId is used as sourceConceptId of relationship
   private String destConceptId;
   private String relationshipType;
   private String characteristicType;
   private String refinability;
   private Long relationshipGroup;

   private String relationshipStatus;
   private String relationshipId;

   public Long getId() {
      return id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public String getRequest() {
      return request;
   }

   public void setRequest(String request) {
      this.request = request;
   }

   public String getRequestorInternalId() {
      return requestorInternalId;
   }

   public void setRequestorInternalId(String requestorInternalId) {
      this.requestorInternalId = requestorInternalId;
   }

   public String getRequestorInternalTerm() {
      return requestorInternalTerm;
   }

   public void setRequestorInternalTerm(String requestorInternalTerm) {
      this.requestorInternalTerm = requestorInternalTerm;
   }

   public String getRequestType() {
      return requestType;
   }

   public void setRequestType(String requestType) {
      this.requestType = requestType;
   }

   public String getArtifactReleaseVersion() {
      return artifactReleaseVersion;
   }

   public void setArtifactReleaseVersion(String artifactReleaseVersion) {
      this.artifactReleaseVersion = artifactReleaseVersion;
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

   public Long getAppealDate() {
      return appealDate;
   }

   public void setAppealDate(Long appealDate) {
      this.appealDate = appealDate;
   }

   public Long getTargetReleaseDate() {
      return targetReleaseDate;
   }

   public void setTargetReleaseDate(Long targetReleaseDate) {
      this.targetReleaseDate = targetReleaseDate;
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

   public String getParentId() {
      return parentId;
   }

   public void setParentId(String parentId) {
      this.parentId = parentId;
   }

   public String getParentFSN() {
      return parentFSN;
   }

   public void setParentFSN(String parentFSN) {
      this.parentFSN = parentFSN;
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

   public String getProposedCaseSignificance() {
      return proposedCaseSignificance;
   }

   public void setProposedCaseSignificance(String proposedCaseSignificance) {
      this.proposedCaseSignificance = proposedCaseSignificance;
   }

   public String getProposedDescriptionStatus() {
      return proposedDescriptionStatus;
   }

   public void setProposedDescriptionStatus(String proposedDescriptionStatus) {
      this.proposedDescriptionStatus = proposedDescriptionStatus;
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

   public String getRefinability() {
      return refinability;
   }

   public void setRefinability(String refinability) {
      this.refinability = refinability;
   }

   public Long getRelationshipGroup() {
      return relationshipGroup;
   }

   public void setRelationshipGroup(Long relationshipGroup) {
      this.relationshipGroup = relationshipGroup;
   }

   public String getRelationshipStatus() {
      return relationshipStatus;
   }

   public void setRelationshipStatus(String relationshipStatus) {
      this.relationshipStatus = relationshipStatus;
   }

   public String getRelationshipId() {
      return relationshipId;
   }

   public void setRelationshipId(String relationshipId) {
      this.relationshipId = relationshipId;
   }

}
