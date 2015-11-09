/**
 * 
 */
package org.ihtsdotools.crs.dao;

import org.ihtsdotools.crs.dto.Request;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 * @author Hunter Macdonald
 *
 */
public interface RequestDao extends CrudRepository<Request, String> {

   @Query("select r from Request as r left join fetch r.workItems where r.rfcNumber = :requestId")
   public Request findRequestWithRequestItems(@Param("requestId") String requestId);

}
