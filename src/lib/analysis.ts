import { RandomForestClassifier } from 'ml-random-forest'
import { ConfusionMatrix } from 'ml-confusion-matrix'
//@ts-expect-error packaga doesn't include types
import trainTestSplit from 'train-test-split'

export function split(vector: Vector[], ratio: number) {
  const x = vector.map(({ feature }) => feature)
  const y = vector.map(({ label }) => label)
  const [x_train, x_test] = trainTestSplit(x, ratio)
  const [y_train, y_test] = trainTestSplit(y, ratio)
  return [x_train, y_train, x_test, y_test]
}

export function randomForest(x_train: number[][], y_train: number[], x_test: number[][]) {
  const classifier = new RandomForestClassifier({ nEstimators: 100 })
  classifier.train(x_train, y_train)
  return classifier.predict(x_test)
}

export function confusionMatrix(y_test: number[], y_prediction: number[]) {
  const cm = ConfusionMatrix.fromLabels(y_test, y_prediction)
  return { ...cm, accuracy: cm.getAccuracy() }
}
