/**
 * 
 */
package org.ihtsdotools.crs.dao;

import java.util.List;

import org.ihtsdotools.crs.dto.Request;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

/**
 * @author Hunter Macdonald
 *
 */
public interface RequestDao extends CrudRepository<Request, String> {

   @Query("select r from Request as r left join fetch r.workItems where r.rfcNumber = :requestId")
   public Request findRequestWithRequestItems(@Param("requestId") String requestId);

   @Query("select distinct r from Request as r left join fetch r.workItems where r.requestorId = :requestorId or r.ogirinatorId = :requestorId")
   public List<Request> findBySubmiter(@Param("requestorId") String requestorId);

   @Query("select  distinct r from Request as r left join fetch r.workItems order by r.statusDate desc")
   public List<Request> findAllRequests();
}
