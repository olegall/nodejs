const Pool = require('C:/Program Files (x86)/nodejs/node_modules/pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'slidersm44',
  port: 5432
})

async function getAdUnits(request, response) {
  //console.log(request.params.data);
  // if no data
  let query = buildQuery(JSON.parse(request.params.data)); // try
  await pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

async function createSite(request, response) {
  // if no data
  
  let data = JSON.parse(request.params.data);
  //let result = await getSiteById(data.id);
  //console.log('***** result *****', result);
  let createdAt = `'${data.created_at}'`;
  let updatedAt = `'${data.updated_at}'`;
  let domain = `'${data.domain}'`;
  //let query = `INSERT INTO site VALUES (${data.id}, ${domain}, ${data.active}, ${createdAt}, ${updatedAt}, null)`; // try
  let query = `INSERT INTO site VALUES (${data.id}, ${domain}, ${data.active}, ${createdAt}, ${updatedAt}, null) 
			   ON CONFLICT (id) DO UPDATE SET id = ${data.id}, 
											domain = ${domain}, 
											active=${data.active}, 
											created_at = ${createdAt}, 
											updated_at = ${updatedAt}, 
											deleted_at = null`;
  //console.log('***** query *****', query);
  await pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

async function getSiteById(id) {
  // if no data
  let query = `SELECT * FROM site WHERE id = ${id}`; // try
  return await pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
	console.log('***** getSiteById *****', id, results.rows);
    return results.rows;
  })
}

function buildQuery(params) {
	let query = 'SELECT * FROM ad_unit';
	if (params.adUnitIds){
		for (let id = 0; id < params.adUnitIds.length; id++){
			if (id < params.adUnitIds.length){
				let word = query.includes('WHERE') ? 'AND' : 'WHERE';
				query += ` ${word} id = ${id}`;
			}
		}
	}
	if (params.site){
		let word = query.includes('WHERE') ? 'AND' : 'WHERE';
		query += ` ${word} site_id = ${params.site}`;
	}
	if (params.userId){
		let word = query.includes('WHERE') ? 'AND' : 'WHERE';
		query += ` ${word} user_id = ${params.userId}`;
	}
	return `${query};`;
}

//function checkParam

module.exports = {
  getAdUnits,
  createSite
}