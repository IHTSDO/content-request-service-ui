/**
 * 
 */
package org.ihtsdotools.crs.dto.helper;

import org.apache.commons.beanutils.BeanUtils;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.dto.RequestItem;
import org.ihtsdotools.crs.dto.helper.config.Field;
import org.ihtsdotools.crs.dto.helper.config.Fields;
import org.ihtsdotools.crs.dto.helper.config.RequestItemConfig;
import org.ihtsdotools.crs.exception.CRSError;
import org.ihtsdotools.crs.exception.CRSRuntimeException;
import org.springframework.beans.factory.annotation.Autowired;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Hunter Macdonald
 *
 */
public class RequestBuilder {

	@Autowired
	private RequestItemConfig requestItemConfig;

	/**
	 * TODO: set properties that are specific for this RequestType <br>
	 * TODO: validate against the input map and throw a Runtime Exception if there are validation errors
	 */
	public void setSpecificProperties(Request request, String requestType, Map<String, Object> requestInput, boolean isEdit){
		if(requestType == null) throw new CRSRuntimeException(CRSError.REQUEST_TYPE_INVALID);
		Fields fields = requestItemConfig.getRequestItemConfig(requestType);
		if(fields == null) throw new CRSRuntimeException(CRSError.REQUEST_TYPE_INVALID);
		List<Field> fieldList = fields.getFields();
		RequestItem requestItem;
		if(isEdit) {
			requestItem = request.retrieveSingleRequestWorkItem();
		} else {
			requestItem = new RequestItem();
		}
		for (Field field : fieldList) {
			String fieldName = field.getName();
			try {
				Object value = requestInput.get(fieldName);
				BeanUtils.setProperty(requestItem, fieldName, value);
			} catch (IllegalAccessException e) {
				throw new CRSRuntimeException(CRSError.SERVER_RUNTIME_ERROR, e);
			} catch (InvocationTargetException e) {
				throw new CRSRuntimeException(CRSError.SERVER_RUNTIME_ERROR, e);
			}
		}
		if(!isEdit) {
			requestItem.setRequest(request);
			requestItem.setRequestType(requestType);
			ArrayList<RequestItem> workItems = new ArrayList<>();
			workItems.add(requestItem);
			request.setWorkItems(workItems);
		}


	}
	
	/**
	 * TODO: set properties that are specific for this RequestType <br>
	 * TODO: validate against the input map and throw a Runtime Exception if there are validation errors
	 */
	public void setCommonProperties(Request request, String requestType, Map<String, Object> requestInput) {
		//TODO: copy common properties from requestInput to request
	}
	
	public Request build(Map<String, Object> requestInput) {
		Request request = new Request();
		String requestType = requestInput.get("requestType") != null ? requestInput.get("requestType").toString() : null;
		setCommonProperties(request, requestType, requestInput);
		setSpecificProperties(request, requestType, requestInput, false);
		return request;
	}

	public Request build(Request request, Map<String, Object> requestInput) {
		String requestType = request.retrieveSingleRequestWorkItem().getRequestType();
		setCommonProperties(request, requestType, requestInput);
		setSpecificProperties(request, requestType, requestInput, true);
		return request;
	}
}
