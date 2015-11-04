package org.ihtsdotools.crs.dto.helper.config;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;

/**
 * User: huyle
 * Date: 11/3/2015
 * Time: 11:34 AM
 */
@RunWith(org.springframework.test.context.junit4.SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
public class RequestConfigLoaderTest {

   @Autowired
   private RequestItemConfig requestItemConfig;

   @Test
   public void testConfigLoaded() {
      Assert.assertNotNull(requestItemConfig.getRequestItemConfig("NEW_CONCEPT"));
      Assert.assertNotNull(requestItemConfig.getRequestItemConfig("NEW_DESCRIPTION"));
   }

}
