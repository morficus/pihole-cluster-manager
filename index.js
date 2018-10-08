const Koa = require('koa');
const app = new Koa();
const db = require('./db')

db.init()
require('./api')(app)

// Disable caching
app.use(async (ctx, next) => {
    await next()
    ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    ctx.set('Pragma', 'no-cache')
    ctx.set('Expires', 0)
})

app.listen(3000);
