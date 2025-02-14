import { RandomForestClassifier } from 'ml-random-forest'
import { ConfusionMatrix } from 'ml-confusion-matrix'
//@ts-expect-error packaga doesn't include types
import trainTestSplit from 'train-test-split'

export function split(vector: Features[], ratio: number) {
  const x = vector.map(({ feature }) => feature)
  const y = vector.map(({ label }) => label)
  const seed = Math.floor(Math.random() * 100)
  const [x_train, x_test] = trainTestSplit(x, ratio, seed)
  const [y_train, y_test] = trainTestSplit(y, ratio, seed)
  return [x_train, y_train, x_test, y_test]
}

export function randomForest(x_train: number[][], y_train: number[], x_test: number[][]) {
  const options = {
    nEstimators: 300,
  }
  const classifier = new RandomForestClassifier(options)
  classifier.train(x_train, y_train)
  return classifier.predict(x_test).map((e) => Math.round(e))
}

export function confusionMatrix(y_test: number[], y_prediction: number[]) {
  const cm = ConfusionMatrix.fromLabels(y_test, y_prediction)
  return { ...cm, accuracy: cm.getAccuracy() }
}
