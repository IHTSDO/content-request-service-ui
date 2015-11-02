/**
 * 
 */
package org.ihtsdotools.crs.dao;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Hunter Macdonald
 *
 */
@RunWith(org.springframework.test.context.junit4.SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:applicationContext.xml")
@Transactional
public class DaoTest {
	
	@Autowired
	RequestDao requestDao;
	
	@Autowired
	RequestItemDao requestItemDao;
	
	@Autowired
	ProjectDao projectDao;
	
	@Autowired
	StatusDao statusDao;

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	/**
	 * @throws java.lang.Exception
	 */
	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void daoShouldNotNull() {
		statusDao.findAll();
		requestDao.findAll();
		requestItemDao.findAll();
		projectDao.findAll();
	}

}
