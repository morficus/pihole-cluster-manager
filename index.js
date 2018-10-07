const Koa = require('koa');
const app = new Koa();
const db = require('./db')

db.init()

app.listen(3000);
