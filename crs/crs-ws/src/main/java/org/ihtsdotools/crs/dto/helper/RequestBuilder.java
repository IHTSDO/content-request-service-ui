/**
 * 
 */
package org.ihtsdotools.crs.dto.helper;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtils;
import org.ihtsdotools.crs.dto.Request;
import org.ihtsdotools.crs.dto.RequestItem;
import org.ihtsdotools.crs.dto.helper.config.Field;
import org.ihtsdotools.crs.dto.helper.config.Fields;
import org.ihtsdotools.crs.dto.helper.config.RequestItemConfig;
import org.ihtsdotools.crs.exception.CRSError;
import org.ihtsdotools.crs.exception.CRSRuntimeException;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Hunter Macdonald
 *
 */
public abstract class RequestBuilder {

	@Autowired
	private RequestItemConfig requestItemConfig;

	private String requestType;

	public abstract boolean validateRequest(Request request);

	public String getRequestType() {
		return this.requestType;
	}

	public RequestBuilder(String requestType) {
		this.requestType = requestType;
	}

	/**
	 * TODO: set properties that are specific for this RequestType <br>
	 * TODO: validate against the input map and throw a Runtime Exception if there are validation errors
	 */
	public void setSpecificProperties(Request request, String requestType, Map<String, Object> requestInput){
		Fields fields = requestItemConfig.getRequestItemConfig(requestType);
		if(fields == null) throw new CRSRuntimeException();
		List<Field> fieldList = fields.getFields();
		RequestItem requestItem = new RequestItem();
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
		requestItem.setRequest(request);
		ArrayList<RequestItem> workItems = new ArrayList<>();
		workItems.add(requestItem);
		request.setWorkItems(workItems);
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
		setCommonProperties(request, requestType, requestInput);
		setSpecificProperties(request, requestType, requestInput);
		validateRequest(request);
		return request;
	}
}
