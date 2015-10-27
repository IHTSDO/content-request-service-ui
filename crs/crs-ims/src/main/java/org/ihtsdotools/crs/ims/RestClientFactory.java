/**
 * 
 */
package org.ihtsdotools.crs.ims;

import java.util.List;

import org.apache.http.HttpHost;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.conn.HttpClientConnectionManager;
import org.apache.http.conn.routing.HttpRoute;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author Hunter Macdonald
 *
 */
public class RestClientFactory implements FactoryBean<RestTemplate> {

	private PoolingHttpClientConnectionManager connectionManager;
	
	/**
	 * 
	 */
	public RestClientFactory(PoolingHttpClientConnectionManager connectionManager, 
			String hostName, int maxConnections) {
		connectionManager.setMaxPerRoute(new HttpRoute(new HttpHost(hostName)), maxConnections);
	}

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.FactoryBean#getObject()
	 */
	public RestTemplate getObject() throws Exception {
		CloseableHttpClient httpClient = HttpClientBuilder.create()
			    .setConnectionManager(connectionManager)
			    .setDefaultRequestConfig(RequestConfig.DEFAULT).build();
		HttpComponentsClientHttpRequestFactory clientFactory = 
				new HttpComponentsClientHttpRequestFactory(httpClient);
		RestTemplate restTemplate = new RestTemplate(clientFactory);
		List<HttpMessageConverter<?>> converters = restTemplate.getMessageConverters();
		for (HttpMessageConverter<?> converter : converters) {
			if (converter instanceof MappingJackson2HttpMessageConverter) {
				MappingJackson2HttpMessageConverter jsonConverter = 
						(MappingJackson2HttpMessageConverter) converter;
				jsonConverter.setObjectMapper(new ObjectMapper());
			}
		}
		return restTemplate;
	}

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.FactoryBean#getObjectType()
	 */
	public Class<?> getObjectType() {
		return RestTemplate.class;
	}

	/* (non-Javadoc)
	 * @see org.springframework.beans.factory.FactoryBean#isSingleton()
	 */
	public boolean isSingleton() {
		return false;
	}

	public HttpClientConnectionManager getConnectionManager() {
		return connectionManager;
	}

}
