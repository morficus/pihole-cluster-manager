const router = require('koa-router')({
    prefix: '/api'
})
const bodyparser = require('koa-bodyparser')
const NodeController = require('./controllers/nodes')
const ClusterController = require('./controllers/cluster')

module.exports = function(app) {

    router.get('/', (ctx) => {
        ctx.body = 'Hello, world'
    })

    router.get('/nodes', async (ctx) => {
        try {
            ctx.body = await NodeController.getAll()
            ctx.status = 200
        } catch(error) {
            ctx.body = { error: error.message }
            ctx.status = 500
        }
    })
        .post('/nodes', async (ctx) => {
            try {
                ctx.body = await NodeController.add(ctx.request.body)
                ctx.status = 201
            } catch(error) {
                ctx.body = { error: error.message }
                ctx.status = 500
            }
        })

    router.get('/nodes/:id', async (ctx) => {
        try {
            const nodeInfo = await NodeController.getById(ctx.params.id)

            if (nodeInfo) {
                ctx.body = nodeInfo
                ctx.status = 200
            } else {
                ctx.body = { error: 'No node found with that ID'}
                ctx.status = 404
            }

        } catch(error) {
            ctx.body = { error: error.message }
            ctx.status = 500
        }
    })
        .post('/nodes/:id', async (ctx) => {
            try {
                const requestObj = {
                    nodeId: ctx.params.id,
                    nodeInfo: ctx.request.body
                }
                ctx.body = await NodeController.update(requestObj)
                ctx.status = 200
            } catch(error) {
                ctx.body = { error: error.message }
                ctx.status = 500
            }
        })
        .delete('/nodes/:id', async (ctx) => {
            try {
                await NodeController.delete(ctx.params.id)
                ctx.status = 204
            } catch(error) {
                ctx.body = { error: error.message }
                ctx.status = 500
            }
        })

    router.get('/admin/publickey', async (ctx) => {
        try {
            ctx.body = await ClusterController.getPublicKey()
            ctx.status = 200
        } catch (error) {
            ctx.status = 500
            ctx.body = {error: 'Can not find public key. Something must be terribly wrong.'}
        }
    })

    // Automatically parse JSON data in POST calls.
    app.use(bodyparser())
    // Enable these routes within our Koa instance.
    app.use(router.routes())
}
