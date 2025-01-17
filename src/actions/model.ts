'use server'

import { confusionMatrix, randomForest, split } from '@/lib/analysis'
import db from '@/lib/database'
import { Preprocessing } from '@/lib/preprocessing'
import { vector } from '@/lib/utils'

const training = (await db())?.collection('training')
const settings = (await db())?.collection('settings')
const features = (await db())?.collection('features')

export async function index() {
  const setting = JSON.parse(JSON.stringify(await settings?.find({}).limit(1).toArray()))

  const result = await training?.aggregate([{ $sample: { size: parseInt(setting[0].dataset_size) } }]).toArray()
  const json = JSON.parse(JSON.stringify(result))

  const res = json.map((data: PreprocessingData) => {
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
  return result
}

export async function analysis(vector: Vector[]) {
  const setting = JSON.parse(JSON.stringify(await settings?.find({}).limit(1).toArray()))
  const [x_train, y_train, x_test, y_test] = split(vector, parseFloat(setting[0].split_size))
  const y_prediction = randomForest(x_train, y_train, x_test)

  const result = confusionMatrix(y_test, y_prediction)

  return result
}

export async function store(data: Features[]) {
  await features?.deleteMany({})
  await features?.insertMany(data)
  return { message: 'Successfully store bulk data' }
}
