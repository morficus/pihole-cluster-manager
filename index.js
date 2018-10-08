const Koa = require('koa');
const app = new Koa();
const db = require('./db')
const ClusterManager = require('./api/controllers/cluster')
db.init()
require('./api')(app)

// Disable caching
app.use(async (ctx, next) => {
    await next()
    ctx.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    ctx.set('Pragma', 'no-cache')
    ctx.set('Expires', 0)
})

// Try to generate new keys in case this is a first-time run
ClusterManager.generateKeys()
    .then(results => {
        if (results.firstTimeKeys) {
            console.log('This is the first time you run Pihole Cluster Manager, SSH keys have been generated')
        }
    })
    .catch(error => {
        console.error('There was an error generating the SSH keys, please check file permissions start the application again.')
        console.error(error)
    })

app.listen(3000);
