/**
 * 
 */
package org.ihtsdotools.crs.dao;

import org.ihtsdotools.crs.dto.RequestItem;
import org.springframework.data.repository.CrudRepository;

/**
 * @author Hunter Macdonald
 *
 */
public interface RequestItemDao extends CrudRepository<RequestItem, Long> {

}
