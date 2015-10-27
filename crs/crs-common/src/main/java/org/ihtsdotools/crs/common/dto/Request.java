/**
 * 
 */
package org.ihtsdotools.crs.common.dto;

import java.io.Serializable;

/**
 * @author Hunter Macdonald
 *
 */
public class Request implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1607804625142076982L;

	/**
	 * 
	 */
	public Request() {
		// TODO Auto-generated constructor stub
	}

	private Long id;
	private String summary;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
}
