/**
 * 
 */
package org.ihtsdotools.crs.dto;

import java.io.Serializable;
import java.util.Collection;

/**
 * @author Hunter Macdonald
 *
 */
public class Project implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7656566803396866814L;

	/**
	 * 
	 */
	public Project() {
		// TODO Auto-generated constructor stub
	}

	private Long id;
	private String name;
	private String description;
	private Collection<Request> requests;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Collection<Request> getRequests() {
		return requests;
	}
	public void setRequests(Collection<Request> requests) {
		this.requests = requests;
	}
}
