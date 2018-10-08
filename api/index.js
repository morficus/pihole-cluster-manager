const router = require('koa-router')({
    prefix: '/api'
})
const bodyparser = require('koa-bodyparser')
const NodeController = require('./controllers/nodes')
const ClusterController = require('./controllers/cluster')
const KeysController = require('./controllers/keys')

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
                ctx.body = { message: error.message, details: error.errors.map(err => err.message) }
                ctx.status = 500
            }
        })

    router.get('/nodes/sync', async (ctx) => {

        try {
            ctx.body = await ClusterController.syncAllLists()
        } catch (error) {
            ctx.status = error.status
            ctx.body = error
        }
    })
    router.get('/nodes/sync/whitelist', async (ctx) => {

        try {
            ctx.body = await ClusterController.syncWhiteList()
        } catch (error) {
            ctx.status = error.status
            ctx.body = error
        }
    })
    router.get('/nodes/sync/blacklist', async (ctx) => {

        try {
            ctx.body = await ClusterController.syncBlackList()
        } catch (error) {
            ctx.status = error.status
            ctx.body = error
        }
    })
    router.get('/nodes/sync/regexlist', async (ctx) => {

        try {
            ctx.body = await ClusterController.syncRegexList()
        } catch (error) {
            ctx.status = error.status
            ctx.body = error
        }
    })
    router.get('/nodes/sync/adlist', async (ctx) => {

        try {
            ctx.body = await ClusterController.syncAdList()
        } catch (error) {
            ctx.status = error.status
            ctx.body = error
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

    router.get('/nodes/:id/publickey', async (ctx) => {
        try {
            ctx.body = await NodeController.generatePublicKey(ctx.params.id)
            ctx.status = 200
        } catch (error) {
            ctx.body = { error }
            ctx.status = 500
        }
    })

    router.get('/admin/publickey', async (ctx) => {
        try {
            ctx.body = await KeysController.getPublicKey()
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
