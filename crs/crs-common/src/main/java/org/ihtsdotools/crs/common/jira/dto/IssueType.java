/**
 * 
 */
package org.ihtsdotools.crs.common.jira.dto;

/**
 * @author Hunter Macdonald
 *
 */
public class IssueType {
	
	private final Long id;
	private final String name;
	private final boolean isSubtask;
	private final String description;
	
	/**
	 * 
	 */
	public IssueType(long id, String name, boolean isSubtask, String description) {
		this.id = id;
		this.name = name;
		this.isSubtask = isSubtask;
		this.description = description;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public boolean isSubtask() {
		return isSubtask;
	}

	public String getDescription() {
		return description;
	}

}
