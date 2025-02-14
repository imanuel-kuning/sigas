'use server'

import { confusionMatrix, randomForest, split } from '@/lib/analysis'

import db from '@/lib/database'
import { Preprocessing } from '@/lib/preprocessing'
import { smoteSampling, vector } from '@/lib/utils'

const dataset = (await db())?.collection('dataset')
const settings = (await db())?.collection('settings')
const features = (await db())?.collection('features')

export async function index() {
  const setting = JSON.parse(JSON.stringify(await settings?.find({}).limit(1).toArray()))

  const majorSize = parseInt(setting[0].dataset_size) * 0.6
  const minorSize = parseInt(setting[0].dataset_size) - majorSize

  const positive = JSON.parse(JSON.stringify(await dataset?.aggregate([{ $match: { sentiment: 'positive' } }, { $sample: { size: minorSize } }]).toArray()))
  const negative = JSON.parse(JSON.stringify(await dataset?.aggregate([{ $match: { sentiment: 'negative' } }, { $sample: { size: majorSize } }]).toArray()))

  const result = [...positive, ...negative]

  const res = result.map((data: PreprocessingData) => {
    const TP = new Preprocessing(data.text)
    data.clean = TP.clean().print()
    data.stem = TP.stem().print()
    data.stopword = TP.stopword().print()
    return data
  })

  return res
}

export async function vectorizer(data: PreprocessingData[]) {
  const setting = JSON.parse(JSON.stringify(await settings?.find({}).limit(1).toArray()))
  const texts = data.map(({ stopword }) => stopword)
  const features = vector(texts, texts, parseInt(setting[0].vector_size))
  const result = data.map(({ sentiment }, index) => {
    const feature = features[index]
    const label = sentiment == 'positive' ? 1 : 0
    return { feature, label }
  })

  const positive = result.filter(({ label }) => label == 1)
  const negative = result.filter(({ label }) => label == 0)

  const majorSize = parseInt(setting[0].dataset_size) * 0.75
  const minorSize = parseInt(setting[0].dataset_size) - majorSize

  const addsPositive = positive.length < minorSize ? smoteSampling(positive, 1, minorSize - positive.length) : []
  const addsNegative = negative.length < majorSize ? smoteSampling(negative, 0, majorSize - negative.length) : []

  return [...result, ...addsPositive, ...addsNegative]
}

export async function analysis(vector: Features[]) {
  const setting = JSON.parse(JSON.stringify(await settings?.find({}).limit(1).toArray()))
  const [x_train, y_train, x_test, y_test] = split(vector, parseFloat(setting[0].split_size))
  const y_prediction = randomForest(x_train, y_train, x_test)
  const result = confusionMatrix(y_test, y_prediction)

  return { accuracy: result.accuracy }
}

export async function store(data: Features[]) {
  await features?.deleteMany({})
  await features?.insertMany(data)
  return { message: 'Successfully store bulk data' }
}
