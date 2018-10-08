const fs = require('fs')
const Nodes = require('./nodes')
const KeysController = require('./keys')
const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

const SYNC_SCRIPTS = {
    whitelist: '/../../scripts/sync_white_list.sh',
    blacklist: '/../../scripts/sync_black_list.sh',
    regexlist: '/../../scripts/sync_regex_list.sh',
    adlist: '/../../scripts/sync_adlist.sh'
}

const LISTS = {
    whitelist: './lists/whitelist.txt',
    blacklist: './lists/blacklist.txt',
    regexlist: './lists/regexlist.txt',
    adlist: './lists/adlists.list'
}

const SystemController = {

    /**
     * Sync white list across all nodes
     * @returns {Promise<*|Promise<{message: string, results: any[]}>>}
     */
    async syncWhiteList () {
        console.log('Syncing white list')
        return this._syncList('whitelist')
    },

    /**
     * Sync black list across all nodes
     * @returns {Promise<*|Promise<{message: string, results: any[]}>>}
     */
    async syncBlackList () {
        console.log('Syncing black list')
        return this._syncList('blacklist')
    },

    /**
     * Sync regex list across all nodes
     * @returns {Promise<*|Promise<{message: string, results: any[]}>>}
     */
    async syncRegexList () {
        console.log('Syncing regex list')
        return this._syncList('regexlist')
    },

    /**
     * Sync adlist across all nodes
     * @returns {Promise<*|Promise<{message: string, results: any[]}>>}
     */
    async syncAdList () {
        console.log('Syncing adlist')
        return this._syncList('adlist', false)
    },


    /**
     * Sync all lists (white, black, regex and ad) across all nodes
     * @returns {Promise<any[]>}
     */
    async syncAllLists () {

        // syncs are called in series to make sure we do not perform multiple operations on the same node at the same
        // time since testing has shown that it causes intermittent failures or delays.
        const whiteList = await this.syncWhiteList()
        const blackList = await this.syncBlackList()
        const regexList = await this.syncRegexList()
        const adList = await this.syncAdList()

        return { whiteList, blackList, regexList, adList }
    },

    /**
     * Calls the proper list sync script against all nodes in the cluster.
     *
     * @param {String} listType The type of list to be synced
     * @param {Boolean} sendFileContent Flag to indicate if the file name or file content should be sent to the sync script
     * @returns {Promise<{message: string, results: any[]}>}
     * @private
     */
    async _syncList(listType, sendFileContent = true) {

        const privKeyPath = KeysController.getPathToPrivateKey()
        const nodes = await Nodes.getAll()
        const scriptPath = `${__dirname}${SYNC_SCRIPTS[listType]}`

        // some scripts require the content of the list file but others (adlist specifically) requires the name of the file
        let commandContent
        if (sendFileContent) {
            commandContent = fs.readFileSync(LISTS[listType], 'utf8')
            commandContent = commandContent.split('\n').join(' ')
        } else {
            commandContent = LISTS[listType]
        }

        // run the specific sync script for all configured nodes
        const promiseArray = nodes.map(async (node) => {
            try{
                const { stdout, stderr } = await execFile(scriptPath, [node.username, node.ipAddress, privKeyPath, commandContent])

                console.log(`Sync complete: ${listType} to ${node.ipAddress}`)
                return { node: `${node.ipAddress} (${node.displayName})`, status: 'success', stdout, stderr }
            } catch ({stdout, stderr, message}) {
                console.log(`Error trying to sync ${listType} to ${node.ipAddress} -- ${message}`)
                return { node: `${node.ipAddress} (${node.displayName})`, status: 'error', stdout, stderr }
            }
        })

        const results = await Promise.all(promiseArray)
        return { message: 'sync complete', results}
    }
}

module.exports = SystemController
