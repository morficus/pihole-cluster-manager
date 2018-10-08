const KEY_FILE = `${__dirname}/keys.json`
const keypair = require('keypair')
const fs = require('fs')

const SystemController = {

    /**
     * Generate a new SSH public/private key pair if there is not one present already
     * @param {Object} options
     *  {Boolean} force When true, it will re-generate the keys
     *
     * @returns {Promise<*>} {firstTimeKeys: Boolean, regenerated: Boolean}
     */
    async generateKeys(options = {force: false}) {
        return new Promise((resolve, reject) => {
            fs.access(KEY_FILE, fs.constants.F_OK, (error) => {
                if (error || options.force) {

                    if (error) {
                        console.log('No SSH keys found, generating first time SSH keys.')
                    } else if (options.force) {
                        console.log('SSH keys present but forcing regeneration.')
                    }

                    const pair = keypair()
                    fs.writeFileSync(KEY_FILE, JSON.stringify(pair, null, 2))
                }

                resolve({ firstTimeKeys: !!error, regenerated: options.force})
            })
        })

    },

    /**
     * Get the current public SSH key
     * @returns {Promise<CryptoKey>}
     */
    async getPublicKey() {
        const content = fs.readFileSync(KEY_FILE, 'utf8')
        return JSON.parse(content).public
    }
}

module.exports = SystemController
