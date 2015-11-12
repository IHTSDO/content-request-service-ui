/**
 * 
 */
package org.ihtsdotools.crs.ws;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Hunter Macdonald
 *
 */
@RestController
@RequestMapping("/api/project")
public class ProjectController {

	@RequestMapping(value = "/hi", method = RequestMethod.GET)
	public String greeting(){
		return "Hello, Fox";
	}
	
	@RequestMapping(value = "/topsecret", method = RequestMethod.GET, headers = "Accept=application/json")
	@ResponseBody
	public Map<String, String> getTopSecret(){
		Map<String, String> map = new HashMap<>();
		map.put("TOPSECRET_KEY", "Sorry! No one know");
		return map;
	}
}
