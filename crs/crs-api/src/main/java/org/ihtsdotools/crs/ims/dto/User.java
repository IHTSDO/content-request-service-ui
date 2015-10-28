/**
 * 
 */
package org.ihtsdotools.crs.ims.dto;

import java.util.Set;

/**
 * @author Hunter Macdonald
 *
 */
public class User {
	private String login;
	private String firstName;
	private String lastName;
	private String email;
	private Set<String> roles;
	public String getLogin() {
		return login;
	}
	public void setLogin(String login) {
		this.login = login;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Set<String> getRoles() {
		return roles;
	}
	public void setRoles(Set<String> roles) {
		this.roles = roles;
	}
	
}