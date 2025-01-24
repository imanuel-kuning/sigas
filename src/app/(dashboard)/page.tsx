import { test } from '@/actions/test'

export default async function Home() {
  const response = await test()

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <pre>
          <code>{JSON.stringify(response.positive, null, 2)}</code>
        </pre>
      </div>
      <div>
        <pre>
          <code>{JSON.stringify(response.negative, null, 2)}</code>
        </pre>
      </div>
    </div>
  )
}
