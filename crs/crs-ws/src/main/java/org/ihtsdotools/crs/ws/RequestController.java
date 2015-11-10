package org.ihtsdotools.crs.ws;

import org.dozer.DozerBeanMapper;
import org.ihtsdotools.crs.api.RequestAPI;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.ws.dto.RequestDto;
import org.ihtsdotools.crs.ws.dto.RequestListItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
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
   public RequestDto createRequest(@RequestBody Map<String, Object> requestInfo)  {
      Request request = requestAPI.createRequest(requestInfo);
      RequestDto requestDto = dozerBeanMapper.map(request, RequestDto.class);
      return requestDto;
   }

   @RequestMapping(value = "/{requestId}", method = RequestMethod.PUT)
   public RequestDto updateRequest(@PathVariable String requestId, @RequestBody Map<String, Object> requestInfo)  {
      Request request = requestAPI.updateRequest(requestId, requestInfo);
      RequestDto requestDto = dozerBeanMapper.map(request, RequestDto.class);
      return requestDto;
   }

   @RequestMapping(value = "/{requestId}", method = RequestMethod.GET)
   public RequestDto getRequestDetails(@PathVariable String requestId) {
      Request request = requestAPI.getRequestDetails(requestId);
      RequestDto requestDto = dozerBeanMapper.map(request, RequestDto.class);
      return requestDto;
   }

   @RequestMapping(value = "/list", method = RequestMethod.GET)
   public List<RequestListItemDto> getSubmittedRequests() {
      Collection<Request> requests = requestAPI.getSubmitedRequests();
      List<RequestListItemDto> requestListItemDtos = new ArrayList<>();
      for (Request request : requests) {
         requestListItemDtos.add(dozerBeanMapper.map(request, RequestListItemDto.class));
      }
      return requestListItemDtos;
   }

   @RequestMapping(value = "/list/submitted", method = RequestMethod.GET)
   public List<RequestListItemDto> getAllRequests() {
      Collection<Request> requests = requestAPI.getAllRequests();
      List<RequestListItemDto> requestListItemDtos = new ArrayList<>();
      for (Request request : requests) {
         requestListItemDtos.add(dozerBeanMapper.map(request, RequestListItemDto.class));
      }
      return requestListItemDtos;
   }


   @RequestMapping(value = "/{requestId}/submit", method = RequestMethod.POST)
   public RequestDto submitRequest(@PathVariable String requestId) {
      Request request = requestAPI.submitRequest(requestId);
      RequestDto requestDto = dozerBeanMapper.map(request, RequestDto.class);
      return  requestDto;
   }


}
