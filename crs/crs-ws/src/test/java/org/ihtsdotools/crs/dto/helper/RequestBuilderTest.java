package org.ihtsdotools.crs.dto.helper;

import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.dto.RequestItem;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

import java.util.HashMap;
import java.util.Map;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 11:03 AM
 */
@RunWith(org.springframework.test.context.junit4.SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:testApplicationContext.xml")
public class RequestBuilderTest {

   @Autowired
   private RequestBuilder requestBuilder;

   @Test
   public void testBuildNewConceptRequest() {
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

      Request request = requestBuilder.build("NEW_CONCEPT", valueMap);
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

}
