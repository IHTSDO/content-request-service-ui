/**
 * 
 */
package org.ihtsdotools.crs.dto.helper;

import java.util.Map;

/**
 * @author Hunter Macdonald
 *
 */
public class RequestBuilderLocator {
	Map<String, RequestBuilder> builderMap;

	/**
	 * 
	 */
	public RequestBuilderLocator(Map<String, RequestBuilder> builderMap) {
		this.builderMap = builderMap;
	}

	public RequestBuilder getBuilder(String requestType) {
		return builderMap.get(requestType);
	}
}
