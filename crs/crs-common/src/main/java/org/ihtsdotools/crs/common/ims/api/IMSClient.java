/**
 * 
 */
package org.ihtsdotools.crs.common.ims.api;

import org.ihtsdotools.crs.common.ims.dto.User;

/**
 * @author Hunter Macdonald
 *
 */
public interface IMSClient {
	public User getLoginUser();
}
