package org.ihtsdotools.crs.dto.helper.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;

import javax.annotation.PostConstruct;
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

   @Autowired
   private ObjectMapper objectMapper;

   public RequestItemConfig(Map<String, Resource> configFiles) {
      this.configFiles = configFiles;
   }

   @PostConstruct
   public void loadConfig() {
      try {
         for (String key : configFiles.keySet()) {
            Fields fields = objectMapper.readValue(configFiles.get(key).getInputStream(), Fields.class);
            requestItemConfigMap.put(key, fields);
         }
      } catch (IOException e) {
         e.printStackTrace();
      }
   }

   public Fields getRequestItemConfig(String key) {
      return requestItemConfigMap.get(key);
   }
}
