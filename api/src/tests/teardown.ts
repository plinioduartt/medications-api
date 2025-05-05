import { container } from './setup'

export default async () => {
  console.log('Tearing down testcontainers...')
  await container?.stop()
}

