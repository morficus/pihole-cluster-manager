const db = require('../../db')
const Nodes = db.models.PiholeNodes
const KeysController = require('./keys')
const forge = require('node-forge')
const Sequelize = require('sequelize');
const Op = Sequelize.Op


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
        const defaults = {
            userName: 'pi'
        }

        if (!hasIpAddress) {
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
            attributes: ['id', 'ipAddress', 'lastSeen', 'displayName', 'username'],
            order: ['ipAddress']
        }
        return Nodes.findAll(searchOptions)
    },

    /**
     * Get a details about a single node
     * @param {UUID} nodeId Unique identifier
     * @returns {Promise<Model>}
     */
    async getById(nodeId) {
        const options = {
            attributes: ['id', 'ipAddress', 'lastSeen', 'displayName', 'username', 'isMaster', 'createdAt', 'updatedAt']
        }
        return Nodes.findById(nodeId, options)
    },

    /**
     * Get details for all nodes in the lis
     * @param {Array<UUID>} nodeIds List of unique node IDs
     * @returns {Promise<Array<Model>>}
     */
    async getByIds(nodeIds) {
        const result = await Nodes.findAll({
            where: {
                id: {
                    [Op.or]: nodeIds
                }
            }
        })

        return result.map(r => r.dataValues)
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
     * @param {UUID} nodeId Unique identifier
     * @returns {Promise<void>}
     */
    async delete(nodeId) {
        await Nodes.destroy({
            where: {
                id: nodeId
            }
        })
    },

    /**
     * Generates a public key with the specific username and IP address for a particular node.
     * The public key is generated based off the cluster system's keys.
     * @param {UUID} nodeId Unique identifier
     * @returns {Promise<the>}
     */
    async generatePublicKey(nodeId) {
        KeysController.getPublicKey()
        const promiseArray = await Promise.all([this.getById(nodeId), KeysController.getPublicKey()])
        const node = promiseArray[0]
        const key = promiseArray[1]
        const publicKey = forge.pki.publicKeyFromPem(key);
        return forge.ssh.publicKeyToOpenSSH(publicKey, `${node.username}@${node.ipAddress}`);
    }
}

module.exports = NodeController
