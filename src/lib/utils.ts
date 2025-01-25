import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
//@ts-expect-error packaga doesn't include types
import { tfidf, tokenize } from 'mimir'
//@ts-expect-error packaga doesn't include types
import SMOTE from 'smote'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProvince(): { code: string; province: string }[] {
  return [
    {
      code: '11',
      province: 'Aceh',
    },
    {
      code: '12',
      province: 'Sumatera Utara',
    },
    {
      code: '13',
      province: 'Sumatera Barat',
    },
    {
      code: '14',
      province: 'Riau',
    },
    {
      code: '15',
      province: 'Jambi',
    },
    {
      code: '16',
      province: 'Sumatera Selatan',
    },
    {
      code: '17',
      province: 'Bengkulu',
    },
    {
      code: '18',
      province: 'Lampung',
    },
    {
      code: '19',
      province: 'Kepulauan Bangka Belitung',
    },
    {
      code: '21',
      province: 'Kepulauan Riau',
    },
    {
      code: '31',
      province: 'DKI Jakarta',
    },
    {
      code: '32',
      province: 'Jawa Barat',
    },
    {
      code: '33',
      province: 'Jawa Tengah',
    },
    {
      code: '34',
      province: 'Daerah Istimewa Yogyakarta',
    },
    {
      code: '35',
      province: 'Jawa Timur',
    },
    {
      code: '36',
      province: 'Banten',
    },
    {
      code: '51',
      province: 'Bali',
    },
    {
      code: '52',
      province: 'Nusa Tenggara Barat',
    },
    {
      code: '53',
      province: 'Nusa Tenggara Timur',
    },
    {
      code: '61',
      province: 'Kalimantan Barat',
    },
    {
      code: '62',
      province: 'Kalimantan Tengah',
    },
    {
      code: '63',
      province: 'Kalimantan Selatan',
    },
    {
      code: '64',
      province: 'Kalimantan Timur',
    },
    {
      code: '65',
      province: 'Kalimantan Utara',
    },
    {
      code: '71',
      province: 'Sulawesi Utara',
    },
    {
      code: '72',
      province: 'Sulawesi Tengah',
    },
    {
      code: '73',
      province: 'Sulawesi Selatan',
    },
    {
      code: '74',
      province: 'Sulawesi Tenggara',
    },
    {
      code: '75',
      province: 'Gorontalo',
    },
    {
      code: '76',
      province: 'Sulawesi Barat',
    },
    {
      code: '81',
      province: 'Maluku',
    },
    {
      code: '82',
      province: 'Maluku Utara',
    },
    {
      code: '91',
      province: 'Papua',
    },
    {
      code: '92',
      province: 'Papua Barat',
    },
    {
      code: '96',
      province: 'Papua Barat Daya',
    },
    {
      code: '93',
      province: 'Papua Selatan',
    },
    {
      code: '94',
      province: 'Papua Tengah',
    },
    {
      code: '95',
      province: 'Papua Pegunungan',
    },
  ]
}

export function convertToISOString(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toISOString().slice(0, 16)
}

export function vector(texts: string[], corpus: string[], size: number) {
  // Pre-compute word frequencies across all texts to avoid repeated calculations
  const wordFrequencies = new Map<string, number>()
  const textTokens: string[][] = []

  // First pass: tokenize all texts and count global word frequencies
  texts.forEach((text) => {
    const tokens = tokenize(text)
    textTokens.push(tokens)

    // Count unique words per document
    const uniqueWords = new Set<string>(tokens)
    uniqueWords.forEach((word) => {
      wordFrequencies.set(word, (wordFrequencies.get(word) || 0) + 1)
    })
  })

  // Process each text
  const result = texts.map((text, index) => {
    const tokens = textTokens[index]
    const wordScores = new Map<string, number>()

    // Calculate TF-IDF scores for unique words only
    const uniqueTokens = new Set(tokens)
    uniqueTokens.forEach((word) => {
      const score = tfidf(word, text, texts)
      wordScores.set(word, score)
    })

    // Convert to array and sort only once
    const sortedScores = Array.from(wordScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, size)
      .map(([, score]) => score)

    // Pad with zeros if needed
    while (sortedScores.length < size) {
      sortedScores.push(0)
    }

    return sortedScores
  })

  // Update result vector
  return result
}

export function smoteSampling(features: Features[], label: number, size: number) {
  const smote = new SMOTE(features.map(({ feature }) => feature))
  const newFeatures = smote.generate(size)
  const result = newFeatures.map((feature: number[]) => ({ feature, label }))
  return result
}
