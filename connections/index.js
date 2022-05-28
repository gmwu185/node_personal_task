const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

console.log('NODE_ENV', process.env.NODE_ENV);

let DB = '';
if (process.env.NODE_ENV === 'production') {
  DB = process.env.DATABASE.replace(
    'myFirstDatabase',
    process.env.DATABASE_COLLECTIONS
  ).replace('<password>', process.env.DATABASE_PASSWORD);
} else if (process.env.NODE_ENV === 'dev') {
  DB = 'mongodb://localhost:27017/' + process.env.DATABASE_COLLECTIONS;
}

let serverPath =
  process.env.NODE_ENV === 'production'
    ? 'https://damp-shore-91853.herokuapp.com/'
    : 'http://localhost:3000';

mongoose
  .connect(DB)
  .then((response) => {
    console.log('資料庫連接成功');
    console.log(`serverPath ${serverPath}`);
  })
  .catch((error) => {
    console.log('資料庫連接錯誤', error);
  });
