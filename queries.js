const Pool = require('C:/Program Files (x86)/nodejs/node_modules/pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'slidersm44',
  port: 5432
})
const HTTP_status = {
	ok: 200
}

async function getAdUnits(request, response) {
    //console.log(request.params.data);
    if (!request.params.data){
  	    throw error;
    }
	let query = buildQuery(JSON.parse(request.params.data)); // try
	await pool.query(query, (error, results) => {
		if (error) {
			throw error
		}
		if (request.headers.origin){
			response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
		}
		response.status(HTTP_status.ok).json(results.rows)
    })
}

async function createUpdateSite(request, response) {
    if (!request.params.data){
  	    throw error;
    }
    let data = JSON.parse(request.params.data);
	let createdAt = `'${data.created_at}'`;
	let updatedAt = `'${data.updated_at}'`;
	let domainVal = `'${data.domain}'`;
	let query = `INSERT INTO site VALUES (${domainVal}, ${data.active}, ${createdAt}, ${updatedAt}, null)
				 ON CONFLICT (domain) DO UPDATE SET domain = ${domainVal}, 
													active=${data.active}, 
													created_at = ${createdAt}, 
													updated_at = ${updatedAt}, 
													deleted_at = null`;
    //console.log('***** query *****', query);
	await pool.query(query, (error, results) => {
		if (error) {
			throw error
		}
		if (request.headers.origin){
			response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
		}
		//let result = {"success": true, }
		response.status(HTTP_status.ok).json(results.rows)
	})
}

async function createUpdateAdUnit(request, response) {
	if (!request.params.data){
		throw error;
	}
	let data = JSON.parse(request.params.data);
	let createdAt = `'${data.created_at}'`;
	let updatedAt = `'${data.updated_at}'`;
	let name = `'${data.name}'`;
	let codeVal = `'${data.code}'`;
	let params = `'${JSON.stringify(data.params)}'`;
	let sizes = `'${JSON.stringify(data.sizes)}'`;
	let query = `INSERT INTO ad_unit (user_id, site_id, name, code, active, params, sizes, created_at, updated_at, deleted_at) 
									VALUES	(${data.user_id}, 
											${data.site_id}, 
											${name}, 
											${codeVal}, 
											${data.active}, 
											${params}, 
											${sizes}, 
											${createdAt}, 
											${updatedAt}, 
											null)
			    ON CONFLICT (code) DO UPDATE SET user_id = ${data.user_id}, 
												site_id = ${data.site_id}, 
												name = ${name}, 
												code = ${codeVal}, 
												active = ${data.active}, 
												params = ${params}, 
												sizes = ${sizes}, 
												created_at = ${createdAt}, 
												updated_at = ${updatedAt}, 
												deleted_at = null`;
	//console.log('***** query *****', query);
	await pool.query(query, (error, results) => {
		if (error) {
			throw error
		}
		if (request.headers.origin){
			response.setHeader('Access-Control-Allow-Origin', request.headers.origin);
		}
		response.status(HTTP_status.ok).json(results.rows)
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
	createUpdateSite,
	createUpdateAdUnit
}