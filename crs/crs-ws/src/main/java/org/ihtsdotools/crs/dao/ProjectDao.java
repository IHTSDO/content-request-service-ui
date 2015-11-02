/**
 * 
 */
package org.ihtsdotools.crs.dao;

import org.ihtsdotools.crs.dto.Project;
import org.springframework.data.repository.CrudRepository;

/**
 * @author Hunter Macdonald
 *
 */
public interface ProjectDao extends CrudRepository<Project, Long> {

}
