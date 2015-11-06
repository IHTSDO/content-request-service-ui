/**
 * 
 */
package org.ihtsdotools.crs.jira.api.impl;

import org.apache.http.HttpRequest;

import net.rcarz.jiraclient.ICredentials;
import net.rcarz.jiraclient.JiraException;
import net.rcarz.jiraclient.RestClient;

/**
 * @author Hunter Macdonald
 *
 */
public class JiraTokenCredentials implements ICredentials {

	public static final String JIRA_AUTH_API_REV = "1";
    private String username = null;
    private String token;
	private String cookieName="dev-jira-ihtsdo";

    public JiraTokenCredentials(String token, String username) {
        this.token = token;
        this.username = username;
    }

    /**
     * Sets the Authorization header for the given request.
     *
     * @param req HTTP request to authenticate
     */
    public void authenticate(HttpRequest req) {
        if (token != null) {
            req.addHeader("Cookie",cookieName+"="+token+";");
        }
    }

    /**
     * Gets the logon name representing these credentials.
     *
     * @return logon name as a string
     */
    public String getLogonName() {
        return username;
    }

    public void initialize(RestClient client) throws JiraException {
    	//DO NOTHING
    }

    public String getToken() {
        return token;
    }

	@Override
	public void logout(RestClient client) throws JiraException {
		//DO NOTHING
	}
}
