const { json, response } = require('express'); //db connection
const { Z_DATA_ERROR } = require('zlib');

var Pool = require('pg').Pool
var pool = new Pool({
  user: 'shruti',
  host: 'localhost',
  database: 'postgres',
  password: 'shruti',
  port: 5432,
})
pool.connect(function (error) {

  if (error) {
    console.log("not able to connect to db");
  }
  else {
    console.log("connected")
  }
})

//get all the datasets

const getdatasets = (request, response) => {
  pool.query('SELECT * FROM datasets', (error, results) => {
    if (!error) {
      if (error) {
        response.send("unable to fetch the data")
      }
      response.status(200).json(results.rows)
    }
    else {
      response.status(500).json({ error: "failed to connect to db" })
    }
  });
};

//get the specified dataset

const getdatasetsbyid = async (request, response) => {
  const id = request.params.id
  //console.log(id);

  await pool.query('SELECT * FROM datasets where id=$1', [id], (error, results) => {

    if (!error) {
      if (results.rows.length == 0) {
        response.status(400).json({ error: "id not found" });
      }
      else {
        response.status(200).json(results.rows)
      }
    }
    else {
      response.status(500).json({ error: "failed to connect to db" })
    }
  });
};

//insert the datasets

const createdatasets = async (request, response) => {
  const { id, data_schema, router_config, status, created_by, updated_by, created_date, updated_date } = request.body;

  isrecexists = await pool.query(`SELECT * FROM datasets where id = '${id}'`)
  if (isrecexists.rows.length > 0) {
    response.status(400).json({ "errorMessage": "id already exists" })
  }
  else
    pool.query
      ('INSERT INTO datasets(id,data_schema,router_config,status,created_by,updated_by,created_date,updated_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', [id, data_schema, router_config, status, created_by, updated_by, created_date, updated_date],
        (error, results) => {
          //  if(!error)
          //  {
          if (error) {
            response.status(400).json({ "error": "unable to insert the record" });
          }
          else {
            response.status(200).json({ "message": `User added with ID: ${results.rows[0].id}` });
          }
          //  }
          //   else
          //   {
          //     response.status(500).json({"error":"failed to fetch the records"})
          //   }

        }
      );
};
const updatedatasets =async(request,response) => {
const id =request.params.id;
 const{status}=request.body;

 isrecexists = await pool.query(`SELECT * FROM datasets where id = '${id}'`)
 if (isrecexists.rows.length == 0) {
   response.status(400).json({ "errorMessage": "id doesnot  exists" })
 }
 else
  await pool.query('UPDATE datasets set status = $1 where id =$2',[status,id],(error, results) => {
  {
    if(error)
    {
      
      response.status(400).json({"error": "unable to update the record"})
    }
      else
      {
      response.status(200).json({"message":`user updated with ID:${id}`})
      }
    
    // else
    // {
    //     response.status(500).json({"error":"undefined error"});
    // }
  }
}
);
}


const deletedatasets = async (request, response) => {
  const id = request.params.id;
  
  isalreadydeleted = await pool.query(`SELECT * FROM datasets where id = '${id}'`)
  if (isalreadydeleted.rows.length == 0) {
    response.status(400).json({ "error": "id already deleted" })
  }
  else {
    await pool.query('DELETE FROM datasets WHERE id = $1', [id], (error, results) => {
        // if ((isrecexists.rows.length > 0)) {
        //   response.status(400).json({ "error": "unable to delete the record" })
        // }
        response.status(200).json({ "message": `User deleted with ID: ${id}` })
      }
     
    
    )
  }
  ;
};





module.exports =
{
  getdatasets,
  getdatasetsbyid,
  createdatasets,
  updatedatasets,
  deletedatasets

}