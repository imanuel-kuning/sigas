'use server'

import { randomForest } from '@/lib/analysis'
import db from '@/lib/database'
import { Preprocessing } from '@/lib/preprocessing'
import { vector } from '@/lib/utils'
import { ObjectId } from 'mongodb'

const posts = (await db())?.collection('posts')
const dataset = (await db())?.collection('dataset')
const features = (await db())?.collection('features')

export async function index() {
  const post = JSON.parse(JSON.stringify(await posts?.find({}).toArray()))
  const feat = JSON.parse(JSON.stringify(await features?.find({}).toArray()))

  return { post, feat }
}

export async function classify(datas: Posts[], features: Features[]) {
  const texts = JSON.parse(JSON.stringify(await dataset?.find({}).toArray()))
  const stopword = datas.map((data) => new Preprocessing(data.text).clean().stem().stopword().print())
  const corpus = texts.map(({ text }: { text: string }) => text)

  const x_train = features.map(({ feature }) => feature)
  const y_train = features.map(({ label }) => label)

  const x_test = vector(stopword, corpus, 5)
  const y_prediction = randomForest(x_train, y_train, x_test)

  if (y_prediction) {
    datas.forEach(async (data, index) => {
      const _id = new ObjectId(data._id)
      await posts?.findOneAndUpdate({ _id }, { $set: { sentiment: y_prediction[index] === 1 ? 'positive' : 'negative' } })
    })
  }

  return 'Successfully classify posts'
}
