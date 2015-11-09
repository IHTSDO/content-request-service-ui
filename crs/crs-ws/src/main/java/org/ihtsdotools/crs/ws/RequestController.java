package org.ihtsdotools.crs.ws;

import org.dozer.DozerBeanMapper;
import org.ihtsdotools.crs.api.RequestAPI;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.ws.dto.RequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * User: huyle
 * Date: 11/4/2015
 * Time: 2:14 PM
 */
@RestController
@RequestMapping("/api/request")
public class RequestController {

   @Autowired
   private RequestAPI requestAPI;

   @Autowired
   private DozerBeanMapper dozerBeanMapper;

   @RequestMapping(method = RequestMethod.POST)
   public RequestDto createRequest(@RequestParam("requestType") String requestType, @RequestBody Map<String, Object> requestInfo)  {
      Request request = requestAPI.createRequest(requestType, requestInfo);
      RequestDto requestDto = dozerBeanMapper.map(request, RequestDto.class);
      return requestDto;
   }

   @RequestMapping(method = RequestMethod.PUT)
   public RequestDto updateRequest(@RequestParam("requestId") String requestId, @RequestBody Map<String, Object> requestInfo)  {
      Request request = requestAPI.updateRequest(requestId, requestInfo);
      RequestDto requestDto = dozerBeanMapper.map(request, RequestDto.class);
      return requestDto;
   }

   @RequestMapping(value = "/submit", method = RequestMethod.POST)
   public RequestDto submitRequest(@RequestParam("requestId") String requestId) {
      Request request = requestAPI.submitRequest(requestId);
      RequestDto requestDto = dozerBeanMapper.map(request, RequestDto.class);
      return  requestDto;
   }
}
