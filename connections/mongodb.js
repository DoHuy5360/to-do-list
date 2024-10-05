
import { MongoClient, ServerApiVersion } from 'mongodb';

import dotenv from 'dotenv'

dotenv.config()

class MongodbManager {
    constructor(dbName, connectionStr) {
        this.client = new MongoClient(connectionStr, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        this.database = this.client.db(dbName)
    }
    async connect() {
        // Connect the client to the server	(optional starting in v4.7)
        try {
            await this.client.connect();
            this.de = this.database.collection("de")
        } catch (error) {
            console.warn("Fail to connect mongodb");
            await this.client.close();
        }
    }
    async ping() {
        // Connecting success doesn't mean the database working well too so we need ping()
        let status = false
        try {
            const response = await this.database.command({ ping: 1 });
            status = response.ok === 1;
            return status;
        }
        catch {
            return status;
        }
        finally {
            if(status){
                console.warn("Ping success");
            }else{
                console.error("Error occurred when ping to the database");
            }
        }
    }
    async close(){
        await this.client.close();  
    }
}

const db = new MongodbManager("to-do-list", process.env.MONGODB_URI)
await db.connect()
await db.ping()
await db.close()
