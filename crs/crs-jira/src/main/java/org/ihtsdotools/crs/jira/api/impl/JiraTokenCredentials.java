/**
 * 
 */
package org.ihtsdotools.crs.jira.api.impl;

import java.io.IOException;
import java.net.URISyntaxException;

import org.apache.http.HttpRequest;

import net.rcarz.jiraclient.ICredentials;
import net.rcarz.jiraclient.JiraException;
import net.rcarz.jiraclient.Resource;
import net.rcarz.jiraclient.RestClient;
import net.rcarz.jiraclient.RestException;
import net.sf.json.JSON;
import net.sf.json.JSONObject;

/**
 * @author Hunter Macdonald
 *
 */
public class JiraTokenCredentials implements ICredentials {

	public static final String JIRA_AUTH_API_REV = "1";
    private String username = null;
    private String token;
    private String password;
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
    
    public void login(RestClient client) throws RestException, IOException, URISyntaxException{
        JSONObject req = new JSONObject();
        req.put("username", username);
        req.put("password", password);
        JSON json = client.post("/rest/auth/1/session", req);
        if (json instanceof JSONObject) {
            JSONObject jso = (JSONObject) json;
            jso = (JSONObject) jso.get("session");
            cookieName = (String)jso.get("name");
            token = (String)jso.get("value");
        }
    }

    public String getToken() {
        return token;
    }

	@Override
	public void logout(RestClient client) throws JiraException {
		//DO NOTHING
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
