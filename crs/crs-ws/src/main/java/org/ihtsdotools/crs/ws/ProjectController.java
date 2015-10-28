/**
 * 
 */
package org.ihtsdotools.crs.ws;

import java.util.HashSet;
import java.util.Set;

import org.ihtsdotools.crs.dto.Project;
import org.ihtsdotools.crs.dto.Request;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Hunter Macdonald
 *
 */
@RestController
@RequestMapping("/api/project")
public class ProjectController {

	@RequestMapping(value = "/hi", method = RequestMethod.GET)
	public String greeting(){
		return "Hello, Fox";
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
	@ResponseBody
	public Project getProject(@PathVariable("id") Long projectId) {
		Project project = new Project();
		project.setId(1L);
		project.setName("Project one");
		
		Set<Request> reqs = new HashSet<Request>();
		Request req = new Request();
		req.setId(1L);
		req.setSummary("First request");
		reqs.add(req);
		
		req = new Request();
		req.setId(2L);
		req.setSummary("Second request");
		reqs.add(req);
		
		project.setRequests(reqs);
		return project;
	}
}
