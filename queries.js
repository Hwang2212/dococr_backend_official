const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'db.jawezjhqjotikandcwbi.supabase.co',
  database: 'postgres',
  password: 'dococr2212!',
  port: 5432,
})

// Get All Customers
const getCustomers = (req, res) => {
    pool.query('SELECT * FROM customer ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

// Get All Customers
const getCustomersById = (req, res) => {
    const id = parseInt(req.params.id)
    pool.query('SELECT * FROM customer WHERE id = $1',[id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

module.exports = {
    getCustomers,
    getCustomersById
}