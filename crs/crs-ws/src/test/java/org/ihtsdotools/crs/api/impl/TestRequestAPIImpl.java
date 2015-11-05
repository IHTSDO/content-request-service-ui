package org.ihtsdotools.crs.api.impl;

import org.ihtsdotools.crs.api.RequestAPI;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.dto.RequestItem;
import org.ihtsdotools.crs.dto.enumeration.StatusValues;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

/**
 * User: huyle
 * Date: 11/5/2015
 * Time: 10:34 AM
 */
@RunWith(org.springframework.test.context.junit4.SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:testApplicationContext.xml")
@Transactional
public class TestRequestAPIImpl {

   @Autowired
   private RequestAPI requestAPI;

   @Test
   public void testCreateNewConceptRequestSuccessfully() {
      Map<String, Object> valueMap = new HashMap<>();
      valueMap.put("requestorInternalId","requestorInternalId");
      valueMap.put("parentId","parentId");
      valueMap.put("proposedFSN","proposedFSN");
      valueMap.put("conceptPT","conceptPT");
      valueMap.put("proposedSynonym","proposedSynonym");
      valueMap.put("proposedDefinition","proposedDefinition");
      valueMap.put("reasonForChange","reasonForChange");
      valueMap.put("notes","notes");
      valueMap.put("reference","reference");

      Request request = requestAPI.createRequest("NEW_CONCEPT", valueMap);
      Assert.assertNotNull(request);
      RequestItem requestItem = request.getWorkItems().get(0);
      Assert.assertEquals(requestItem.getRequestorInternalId(), "requestorInternalId");
      Assert.assertEquals(requestItem.getParentId(), "parentId");
      Assert.assertEquals(requestItem.getProposedFSN(), "proposedFSN");
      Assert.assertEquals(requestItem.getConceptPT(), "conceptPT");
      Assert.assertEquals(requestItem.getProposedSynonym(), "proposedSynonym");
      Assert.assertEquals(requestItem.getProposedDefinition(), "proposedDefinition");
      Assert.assertEquals(requestItem.getReasonForChange(), "reasonForChange");
      Assert.assertEquals(requestItem.getNotes(), "notes");
      Assert.assertEquals(requestItem.getReference(), "reference");
   }

   @Test
   public void testSubmitNewConceptRequestSuccessfully() {
      Map<String, Object> valueMap = new HashMap<>();
      valueMap.put("requestorInternalId","requestorInternalId");
      valueMap.put("parentId","parentId");
      valueMap.put("proposedFSN","proposedFSN");
      valueMap.put("conceptPT","conceptPT");
      valueMap.put("proposedSynonym","proposedSynonym");
      valueMap.put("proposedDefinition","proposedDefinition");
      valueMap.put("reasonForChange","reasonForChange");
      valueMap.put("notes","notes");
      valueMap.put("reference","reference");

      Request request = requestAPI.createRequest("NEW_CONCEPT", valueMap);
      request = requestAPI.submitRequest(request.getRfcNumber());
      Assert.assertEquals(StatusValues.SUBMITTED.toString(), request.getStatus());
   }

}
