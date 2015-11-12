package org.ihtsdotools.crs.security;


import org.ihtsdo.otf.im.domain.IHTSDOUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * User: huyle
 * Date: 2/21/2015
 * Time: 11:10 AM
 */
public class AuthenticationUtils {


   public static String getCurrentUserName() {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      if(authentication !=null && authentication.getPrincipal() != null) {
         return ((IHTSDOUser) authentication.getPrincipal()).getUsername();
      }
      return null;
   }


}
