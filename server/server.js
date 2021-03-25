const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const port = 3000;

// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use((req,res,next)=>{
	
	// Website you wish to allow to connect

res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

// Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
	
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});


//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'synergy'
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
 
//show all countries
app.get('/api/countries',(req, res) => {
  let sql = "select distinct country from cities";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

//show 
app.get('/api/cities/:country',(req, res) => {
  let sql = "select * from cities where country like'%"+req.params.country+"%' and id in (select cId from facilities)";
  console.log('==> '+ sql );
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/api/cities/:country/:city',(req, res) => {
  let sql = "select * from cities where country like'%"+req.params.country+"%' and id in (select cId from facilities) AND city like '%"+ req.params.city+"%'";
  console.log('==> '+ sql );
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/facilities/name/:name',(req, res) => {
  let sql = "select * from facilities where facName like '%"+req.params.name+"%'";
  console.log('==> '+ sql );
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/facilities/category',(req, res) => {
  let sql = "select * from fac_categ where IdFacCat in (select facCatId from facilities)";
  console.log('==> '+ sql );
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/facilities/category/:category',(req, res) => {
  let sql = "select * from fac_categ where facCatName like '%"+req.params.category+"%' and IdFacCat in (select facCatId from facilities)";
  console.log('==> '+ sql );
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/:city/facilities/category/:category',(req, res) => {
  let sql = "select * from fac_categ c, facilities f, cities a where c.idFacCat=f.facCatId and f.cId=a.id and a.city='"+ req.params.city+"' and facCatName like '%"+ req.params.category+"%'";
  console.log('==> '+ sql );
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

/* 
//add new product
app.post('/api/products',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//update product
app.put('/api/products/:id',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
//Delete product
app.delete('/api/products/:id',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.params.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

*/

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'});
});

 
//Server listening
app.listen(port,() =>{
  console.log('Server started on port ' +port +'...');
});
