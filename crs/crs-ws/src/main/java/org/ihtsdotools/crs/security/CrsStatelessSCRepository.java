/**
 * 
 */
package org.ihtsdotools.crs.security;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpRequestResponseHolder;
import org.springframework.security.web.context.SecurityContextRepository;

/**
 * @author Hunter Macdonald
 *
 */
public class CrsStatelessSCRepository implements SecurityContextRepository {
	private static final Logger LOGGER = LoggerFactory.getLogger(CrsStatelessSCRepository.class);
	public static final String TOKEN_KEY = "dev-ims-ihtsdo";

	/* (non-Javadoc)
	 * @see org.springframework.security.web.context.SecurityContextRepository#loadContext(org.springframework.security.web.context.HttpRequestResponseHolder)
	 */
	@Override
	public SecurityContext loadContext(HttpRequestResponseHolder rh) {
		return SecurityContextHolder.getContext();
	}

	@Override
	public void saveContext(SecurityContext context, HttpServletRequest request, HttpServletResponse response) {
		// Do nothing
	}

	@Override
	public boolean containsContext(HttpServletRequest request) {
		return SecurityContextHolder.getContext().getAuthentication() != null;
	}

}
