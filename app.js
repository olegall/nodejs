const modulesPath = 'C:/Program Files (x86)/nodejs/node_modules';
const express = require(`${modulesPath}/express`)
const bodyParser = require(`${modulesPath}/body-parser`)
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)
app.get('/', (request, response) => {
	response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get('/ad_unit/:data', db.getAdUnits)
app.put('/ad_unit/:data', db.createUpdateAdUnit)
app.put('/site/:data', db.createUpdateSite)
app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})