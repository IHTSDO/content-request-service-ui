package org.ihtsdotools.crs.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.ihtsdo.otf.im.domain.IHTSDOUser;
import org.ihtsdo.otf.im.sso.service.IHTSDOUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;

import com.atlassian.crowd.integration.springsecurity.user.CrowdUserDetails;

public class TokenFilter implements Filter {
	private static final String TOKEN_KEY = "dev-ims-ihtsdo";
	private IHTSDOUserDetailsService userService;
	
	public TokenFilter(IHTSDOUserDetailsService userService) {
		this.userService = userService;
	}
	
	@Override
	public void destroy() {

	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) req;
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null) {
			Cookie[] cookies = request.getCookies();
			String tokenKey = null;
			if(cookies != null) {
				for(Cookie cookie : cookies) {
					if(cookie.getName().equalsIgnoreCase(TOKEN_KEY)) {
						tokenKey = cookie.getValue();
						break;
					}
				}
			}
			if (!StringUtils.isEmpty(tokenKey)) {
				CrowdUserDetails crowdUser = userService.loadUserByToken(tokenKey);
				if(crowdUser != null) {
					IHTSDOUser user = IHTSDOUser.getInstance(crowdUser);
					auth = new UsernamePasswordAuthenticationToken(
							user, tokenKey, user.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			}
		}
		
		chain.doFilter(req, res);

	}

	@Override
	public void init(FilterConfig arg0In) throws ServletException {
		// TODO Auto-generated method stub

	}

	public void setUserService(IHTSDOUserDetailsService userService) {
		this.userService = userService;
	}


}
