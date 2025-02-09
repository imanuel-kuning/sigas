'use server'

import db from '@/lib/database'

const collection = (await db())?.collection('posts')

export async function index() {
  const result = await collection?.find({}).sort({ _id: -1 }).toArray()
  return JSON.parse(JSON.stringify(result))
}
