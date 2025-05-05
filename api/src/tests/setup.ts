import dotenv from 'dotenv';
import path from 'node:path';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

dotenv.config({ path: path.resolve(__dirname, `../../.env.test`) });

let container: StartedTestContainer | undefined

export default async () => {
  console.log('Setting up testcontainers...')
  container = await new GenericContainer("mongo:latest")
    .withExposedPorts(27017)
    .start()

  const uri = `mongodb://${container.getHost()}:${container.getMappedPort(27017)}`;
  process.env.MONGODB_URI = uri
}

export {
  container
};

