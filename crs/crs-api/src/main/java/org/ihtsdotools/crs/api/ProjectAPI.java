/**
 * 
 */
package org.ihtsdotools.crs.api;

import java.util.Collection;

import org.ihtsdotools.crs.dto.Project;

/**
 * @author Hunter Macdonald
 *
 */
public interface ProjectAPI {
	public Project createProject(Project project);
	public Project updateProject(Project project);
	public Collection<Project> getAssignedProject(String userId);
}
