'use server'
import db from '@/lib/database'
import { ObjectId } from 'mongodb'

const collection = (await db())?.collection('settings')

export async function index() {
  const result = await collection?.find({}).limit(1).toArray()
  return JSON.parse(JSON.stringify(result))[0]
}

export async function update(id: string, data: Settings) {
  const _id = new ObjectId(id)
  await collection?.updateOne({ _id }, { $set: data })
  return { message: 'Successfully update settings' }
}
