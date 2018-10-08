const db = require('../../db')
const Nodes = db.models.PiholeNodes

const NodeController = {

    /**
     * Add a new PiHole node
     *
     * @param {Object} newNodeInfo
     *  {String} displayName: human-friendly name (optional)
     *  {String} userName: Username for logging in to the remote node (defaults to "pi")
     *  {IP} ipAddress: Node's IP address
     *  {String} sshKey: Public ssh-key for remote Node (should be for use "pi")
     * @returns {Promise<Model>} The newly created node
     */
    async add(newNodeInfo) {
        const hasIpAddress = newNodeInfo.hasOwnProperty('ipAddress') && newNodeInfo['ipAddress'].length
        const hasSshKey = newNodeInfo.hasOwnProperty('sshKey') && newNodeInfo['sshKey'].length
        const defaults = {
            userName: 'pi'
        }

        if (!hasIpAddress || !hasSshKey) {
            throw new Error('An ssh-key and IP address must be provided')
        }

        const nodeInfo = Object.assign({}, defaults, newNodeInfo )

        return Nodes.create(nodeInfo)
    },

    /**
     * Returns all PiHole nodes
     *
     * @returns {Promise<Array<Model>>} A list of all nodes
     */
    async getAll() {
        const searchOptions = {
            attributes: ['id', 'ipAddress', 'lastSeen', 'displayName'],
            order: ['ipAddress']
        }
        return Nodes.findAll(searchOptions)
    },

    /**
     * Get a details about a single node
     * @param {String} nodeId Unique identifier
     * @returns {Promise<Model>}
     */
    async getById(nodeId) {
        const options = {
            attributes: ['id', 'ipAddress', 'lastSeen', 'displayName', 'username', 'isMaster', 'createdAt', 'updatedAt']
        }
        return Nodes.findById(nodeId, options)
    },

    /**
     * Update the info for a specific node. Only th passed in attributes will be updated.
     *
     * @param {String} nodeId Unique identifier
     * @param {Object} nodeInfo Any series of valid attributes that are available on a node
     * @returns {Promise<this>} The updated node info
     */
    async update({ nodeId, nodeInfo }) {
        const piholeNode = await Nodes.findById(nodeId)

        // by specifying what fields we want to update we make sure that we do not blow away anything not passed in
        return piholeNode.update(nodeInfo, {fields: Object.keys(nodeInfo)})
    },

    /**
     * Delete a node info
     * @param {String} nodeId Unique identifier
     * @returns {Promise<void>}
     */
    async delete(nodeId) {
        await Nodes.destroy({
            where: {
                id: nodeId
            }
        })
    }
}

module.exports = NodeController
