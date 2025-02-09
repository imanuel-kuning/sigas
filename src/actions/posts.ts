'use server'

import db from '@/lib/database'
import { ObjectId } from 'mongodb'

const collection = (await db())?.collection('posts')

export async function sentimentCount() {
  const positive = await collection?.countDocuments({ sentiment: 'positive' })
  const negative = await collection?.countDocuments({ sentiment: 'negative' })

  return { positive, negative }
}

export async function index() {
  const result = await collection?.find({}).sort({ _id: -1 }).toArray()
  return JSON.parse(JSON.stringify(result))
}

export async function get(id: string) {
  const _id = new ObjectId(id)
  const result = await collection?.findOne({ _id })
  return JSON.parse(JSON.stringify(result))
}

export async function count() {
  const result = await collection?.countDocuments()
  return result
}

export async function store(data: { text: string; location: string; date: string }) {
  await collection?.insertOne(data)
  return { message: 'Successfully store data' }
}

export async function storeMany(data: { text: string; location: string; date: string }[]) {
  await collection?.insertMany(data)
  return { message: 'Successfully store bulk data' }
}

export async function update(id: string, data: PostsData) {
  const _id = new ObjectId(id)
  await collection?.updateOne({ _id }, { $set: data })
  return { message: 'Successfully update data' }
}

export async function destroy(id: string) {
  const _id = new ObjectId(id)
  await collection?.deleteOne({ _id }, {})
  return { message: 'Successfully delete data' }
}
