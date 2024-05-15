import { log } from "console";
import { MongoClient, ServerApiVersion } from "mongodb";
import { DB_COLLECTIONS } from "./collections.enum";

/**
 * A wrapper for working with any database
 * Currently set up with mongoDB only
 */
export default class DatabaseClient {
	private _client: MongoClient;
	private _database: string;

	constructor(uri: string, db: string) {
		this._client = new MongoClient(uri, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
		this._database = db;
	}

	//== CONNECTION
	async connect() {
		this._client.connect();
		try {
			await this._client.db(this._database).command({ ping: 1 });
		} catch (error) {
			console.log(error); //FIX: This error should be handled
			return false;
		}
		return true;
	}

	async close() {
		await this._client.close();
	}
	//== INSERT
	async insert(collection: DB_COLLECTIONS, data: any) {
		await this.getCollection(collection).insertOne(data);
	}
	//== DELETE
	async delete(collection: DB_COLLECTIONS, filter: any) {
		await this.getCollection(collection).findOneAndDelete(filter);
	}
	//== UPDATE
	async update(collection: DB_COLLECTIONS, filter: any, data: any) {
		await this.getCollection(collection).findOneAndReplace(filter, data);
	}
	//== SEARCH
	find(collection: string, filters: any) {
		return this.getCollection(collection).find(filters);
	}
	async findOne(collection: string, filters: any) {
		return await this.getCollection(collection).findOne(filters);
	}

	async has(collection: string, filters: any) {
		return (await this.findOne(collection, filters)) ? true : false;
	}

	// ==
	private getCollection(collection: string) {
		return this._client.db(this._database).collection(collection);
	}
}
