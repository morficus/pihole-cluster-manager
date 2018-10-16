const NodesController = require('./nodes')
const KeysController = require('./keys')
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

const RPCController = {

    /**
     * Disable PiHole for a certain amount of time. If no time is provided, PiHole will be disabled until "enable" is called
     * @param {Array<UUID>} nodeIds List of node IDs
     * @param {Number} timeout Time (in seconds) to disable PiHole (optional)
     * @returns {Promise<{message: string, timeout: number, results: *}>}
     */
    async disablePihole(nodeIds, timeout = 0) {
        console.log(`Disabling nodes [${nodeIds}] for [${timeout}] seconds`)
        const results = await this._runCommand(nodeIds, '/pihole-disable.sh')

        if (timeout) {
            const time = timeout * 1000
            setTimeout(() => {
                console.log('Disable timeout is up')
                this.enablePihole(nodeIds)
            }, time)
        }

        return {message: 'disable complete', timeout, results}
    },

    /**
     * Enable PiHole on certain nodes
     * @param {Array<UUID>} nodeIds List of node IDs
     * @returns {Promise<{message: string, results: {message: string, results: any[]}}>}
     */
    async enablePihole(nodeIds) {
        console.log(`Enabling nodes [${nodeIds}]`)
        const results = await this._runCommand(nodeIds, '/pihole-enable.sh')

        return {message: 'enable complete', results}
    },

    /**
     * Restarts the DNS service
     * @param {Array<UUID>} nodeIds List of node IDs
     */
    async restartDns(nodeIds) {
        console.log(`Restarting DNS service for nodes [${nodeIds}]`)
        const results = await this._runCommand(nodeIds, '/pihole-restart-dns.sh')

        return {message: 'DNS restart complete', results}
    },

    /**
     * Reboots the device PiHOle is running on
     * @param {Array<UUID>} nodeIds List of node IDs
     */
    async reboot(nodeIds) {
        console.log(`Rebooting nodes [${nodeIds}] (actual device reboot)`)
        const results = await this._runCommand(nodeIds, '/pi-restart.sh')

        return {message: 'rPI reboot command sent', results}
    },

    /**
     * Updates PiHole to its most recent version
     * @param {Array<UUID>} nodeIds List of node IDs
     */
    async updatePihole(nodeIds) {
        console.log(`Updating PiHole on nodes [${nodeIds}]`)
        const results = await this._runCommand(nodeIds, '/pihole-update.sh')

        return {message: 'update complete', results}
    },

    /**
     *
     * @param {Array<UUID>} nodeIds List of node IDs
     * @param {String} script Path to script that is to be ran
     * @returns {Promise<{message: string, results: any[]}>}
     * @private
     */
    async _runCommand(nodeIds, script) {
        const nodes = nodeIds ? await NodesController.getByIds(nodeIds) : await NodesController.getAll()
        const scriptPath = `${__dirname}/../../scripts${script}`
        const privKeyPath = KeysController.getPathToPrivateKey()

        const remoteActions = nodes.map(async (node) => {
            try {
                const {stdout, stderr} = await execFile(scriptPath, [node.username, node.ipAddress, privKeyPath])
                console.log(`Ran ${script} on [${node.ipAddress}]`)
                return { node: `${node.ipAddress} (${node.displayName})`, status: 'success', stdout, stderr }
            } catch ({stdout, stderr, message}) {
                console.log(`Error running ${script} on [${node.ipAddress}] -- ${message}`)
                return { node: `${node.ipAddress} (${node.displayName})`, status: 'error', stdout, stderr }
            }
        })

        return Promise.all(remoteActions)
    }

}

module.exports = RPCController
