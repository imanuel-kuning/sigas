import { MongoClient } from 'mongodb'

export default async function connection() {
  const url: string = process.env.MONGO_URI as string
  const client = new MongoClient(url)
  try {
    await client.connect()
    console.log('db connected!')
    const db = client.db('main')
    return db
  } catch (e) {
    console.log(e)
  }
}
