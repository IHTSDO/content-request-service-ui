/**
 * 
 */
package org.ihtsdotools.crs.dao;

import org.ihtsdotools.crs.dto.Request;
import org.springframework.data.repository.CrudRepository;

/**
 * @author Hunter Macdonald
 *
 */
public interface RequestDao extends CrudRepository<Request, Long> {

}
