const PUBLIC_KEY_FILE = `${__dirname}/pub`
const PRIVATE_KEY_FILE = `${__dirname}/priv`
const keypair = require('keypair')
const fs = require('fs')

const KeysController = {

    /**
     * Generate a new SSH public/private key pair if there is not one present already
     * @param {Object} options
     *  {Boolean} force When true, it will re-generate the keys
     *
     * @returns {Promise<*>} {firstTimeKeys: Boolean, regenerated: Boolean}
     */
    async generateKeys(options = {force: false}) {
        return new Promise((resolve, reject) => {
            fs.access(PRIVATE_KEY_FILE, fs.constants.F_OK, (error) => {
                if (error || options.force) {

                    if (error) {
                        console.log('No SSH keys found, generating first time SSH keys.')
                    } else if (options.force) {
                        console.log('SSH keys present but forcing regeneration.')
                    }

                    const pair = keypair()

                    fs.writeFileSync(PUBLIC_KEY_FILE, pair.public, {mode: '0600'})
                    fs.writeFileSync(PRIVATE_KEY_FILE, pair.private, {mode: '0600'})
                }

                resolve({ firstTimeKeys: !!error, regenerated: options.force})
            })
        })

    },

    /**
     * Get the current public SSH key
     * @returns {Promise<String>}
     */
    async getPublicKey() {
        return fs.readFileSync(PUBLIC_KEY_FILE, 'utf8')
    },

    getPathToPrivateKey() {
        return PRIVATE_KEY_FILE
    }

}

module.exports = KeysController
