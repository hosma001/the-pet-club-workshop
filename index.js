const pg = require('pg');
const client = new pg.Client('postgres://localhost/the_pet_shop_db');
const express = require('express');
const app = express();
const path = require('path');

const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
    DROP TABLE IF EXISTS pets;
    DROP TABLE IF EXISTS owners;
    CREATE TABLE owners(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE
    );
    CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE,
      owner_id INTEGER REFERENCES owners(id)
    );
    INSERT INTO owners(name) VALUES('Moe');
    INSERT INTO owners(name) VALUES('Lucy');
    INSERT INTO owners(name) VALUES('Ethyl');
    INSERT INTO owners(name) VALUES('Curly');
    INSERT INTO pets(name, owner_id) VALUES(
      'Fido', 
      (SELECT id FROM owners WHERE name='Moe')
      );
    INSERT INTO pets(name, owner_id) VALUES(
      'Rex', 
      (SELECT id FROM owners WHERE name='Lucy')
      );
    INSERT INTO pets(name) VALUES('Tiger');
    INSERT INTO pets(name, owner_id) VALUES(
      'Fluffy',
      (SELECT id FROM owners WHERE name='Lucy')
      );
  `;
  await client.query(SQL);
  console.log('create your tables and seed data');

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
