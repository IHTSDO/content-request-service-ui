/**
 * 
 */
package org.ihtsdotools.crs.dao;

import org.ihtsdotools.crs.dto.Status;
import org.springframework.data.repository.CrudRepository;

/**
 * @author Hunter Macdonald
 *
 */
public interface StatusDao extends CrudRepository<Status, Long> {

}
