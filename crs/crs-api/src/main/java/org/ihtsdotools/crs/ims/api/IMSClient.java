/**
 * 
 */
package org.ihtsdotools.crs.ims.api;

import org.ihtsdotools.crs.ims.dto.User;

/**
 * @author Hunter Macdonald
 *
 */
public interface IMSClient {
	public User getLoginUser(String imsSessionId);
}
