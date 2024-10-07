const { MongoClient, ServerApiVersion } = require("mongodb");

const dotenv = require("dotenv");

dotenv.config();

class MongodbManager {
    constructor(dbName, connectionStr) {
        this.client = new MongoClient(connectionStr, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        this.database = this.client.db(dbName);
    }
    async connect() {
        let isConnectSuccessfully = false;
        try {
            await this.client.connect();
            isConnectSuccessfully = true;
            this.isConnected = true;
            this.setupCollections();
        } catch (error) {
            await this.client.close();
        } finally {
            if (isConnectSuccessfully) {
                console.warn("Connect database successfully");
            } else {
                console.error("Error occurred when ping to the database");
            }
        }
    }
    setupCollections() {
        this.tasks = this.database.collection("tasks");
    }
    async ping() {
        // Connecting success doesn't mean the database working well too so we need ping()
        let status = false;
        try {
            const response = await this.database.command({ ping: 1 });
            status = response.ok === 1;
            return status;
        } catch {
            return status;
        } finally {
            if (status) {
                console.warn("Ping success");
            } else {
                console.error("Error occurred when ping to the database");
            }
        }
    }
    async close() {
        await this.client.close();
    }
}

const db = new MongodbManager("to-do-list", process.env.MONGODB_URI);

module.exports = {
    db,
};
