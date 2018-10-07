const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: process.env.NODE_ENV !== 'PRODUCTION',
    // TODO: make the DB location configurable
    storage: `${__dirname}/pihole-cluster.db`
})

/**
 * Test DB connection (aka: was the sqlite files created) and sync table schemas
 * @returns {Promise<void>}
 */
async function init() {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });

    PiholeNodes.sync()
    Queries.sync()
}

// TODO: place each model in its own file
const PiholeNodes = sequelize.define('PiholeNodes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        default: Sequelize.UUIDV4
    },

    ip_address: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    },

    api_key: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    ssh_address: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    username: {
        type: Sequelize.TEXT,
        allowNull: false,
        default: 'pi'
    },
    
    display_name: {
        type: Sequelize.TEXT,
        unique: true
    },

    date_added: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    
    last_seen: {
        type: Sequelize.DATE
    },
    
    is_master: {
        type: Sequelize.BOOLEAN,
        default: false
    }
})

const Queries = sequelize.define('Queries', {
    indexes: [
        {
            fields: ['timestamp']
        },
        {
            fields: ['node_id', 'node_query_id']
        }
    ],
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    node_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'uniqueQueryPerNode',
        references: {
            model: PiholeNodes,
            key: 'id'
        }
    },
    
    node_query_id: {
        type: Sequelize.INTEGER,
        unique: 'uniqueQueryPerNode'
    },
    
    timestamp: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    type: {
        /*
            0 = AAAA
            1 = A
        */
        type: Sequelize.INTEGER,
        allowNull: false
    },

    status: {
        /*
           1 = Pi-holed (gravity)
           2 = OK (forwarded)
           3 = OK (cached)
           4 = Pi-holed (wildcard)
           5 = Pi-holed (blacklist)
        */
        type: Sequelize.INTEGER,
        allowNull: false
    },

    domain: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    client: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    forward: {
        type: Sequelize.TEXT,
        allowNull: false
    },
})

module.exports = {
    init,
    models: {
        PiholeNodes,
        Queries
    }
}
