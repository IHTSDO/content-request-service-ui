package org.ihtsdotools.crs.dto.helper.config;

import org.springframework.core.io.Resource;

import javax.annotation.PostConstruct;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * User: huyle
 * Date: 11/2/2015
 * Time: 4:01 PM
 */
public class RequestItemConfig {

   private Map<String, Resource> configFiles;

   private final Map<String, Fields> requestItemConfigMap = new HashMap<>();

   public RequestItemConfig(Map<String, Resource> configFiles) {
      this.configFiles = configFiles;
   }

   //Load XML config of a Request Item Type to build a Request
   @PostConstruct
   public void loadConfig() {
      try {
         JAXBContext jaxbContext = JAXBContext.newInstance(Fields.class);
         Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
         for (String key : configFiles.keySet()) {
            Fields fields = (Fields) unmarshaller.unmarshal(configFiles.get(key).getInputStream());
            requestItemConfigMap.put(key, fields);
         }
      } catch (JAXBException e) {
         e.printStackTrace();
      } catch (IOException e) {
         e.printStackTrace();
      }
   }

   public Fields getRequestItemConfig(String key) {
      return requestItemConfigMap.get(key);
   }
}
