/**
 * 
 */
package org.ihtsdotools.crs.jira.dto;

/**
 * @author Hunter Macdonald
 *
 */
public class Status {
	private final Long id;
	private final String description;
	
	public Status(long id, String description) {
		this.id = id;
		this.description = description;
	}

	public Long getId() {
		return id;
	}

	public String getDescription() {
		return description;
	}

}
