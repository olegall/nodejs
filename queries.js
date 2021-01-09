const Pool = require('C:/Program Files (x86)/nodejs/node_modules/pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'slidersm44',
  port: 5432,
})

const getUsers = (request, response) => {
  console.log(request.url);
  pool.query('SELECT * FROM ad_unit', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getUsers
}