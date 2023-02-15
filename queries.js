const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw `error when getUsers : ${error}`;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw `error when getUserById : ${error}`;
    }
    if(results.rows.length < 1){
        response.send({
            info: "rows empty"
        });
    } else {
        response.status(200).json(results.rows);
    }
  });
};

const createUser = (request, response) => {
  const { name, email } = request.body;
//   console.log("create request body", request.body);
//   console.log("name", name);
//   console.log("email", email);

  pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email],
    (error, results) => {
      if (error) {
        throw `error when createUser : ${error}`;
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;

  pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id],
    (error, results) => {
      if (error) {
        throw `error when updateUser : ${error}`;
      }
      response.status(200).send({
        message: `User updated with ID: ${id}`,
        data: results
    });
    }
  );
};

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send({
        message: `User deleted with ID: ${id}`
    });
  });
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
