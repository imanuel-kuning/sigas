'use server'

//@ts-expect-error packaga doesn't include types
import SMOTE from 'smote'

import db from '@/lib/database'

const dataset = (await db())?.collection('features')

export async function test() {
  const dataset_size = 500

  const positive = JSON.parse(
    JSON.stringify(
      await dataset
        ?.find({ label: 1 })
        .limit(dataset_size / 2)
        .toArray()
    )
  )
  const negative = JSON.parse(
    JSON.stringify(
      await dataset
        ?.find({ label: 0 })
        .limit(dataset_size / 2)
        .toArray()
    )
  )

  if (positive.length < dataset_size / 2) {
    const smote = new SMOTE(positive.map(({ feature }: { feature: number[] }) => feature))
    const newVectors = smote.generate(dataset_size / 2 - positive.length)
    console.log(newVectors)
  }

  return { positive, negative }
}
