import bodyParser from 'body-parser'
import 'dotenv/config'
import express, { Express } from 'express'
import { Server } from 'http'
import swaggerUi from 'swagger-ui-express'
import { userRouter } from './auth/auth.routes'
import { swaggerSpec } from './docs/swagger'
import { drugsRouter } from './drugs/drugs.routes'
import { programsRouter } from './programs/programs.routes'
import { MongoDBDatabase } from './shared/database/mongodb.configuration'
import { authenticate } from './shared/middlewares/auth.middleware'
import { rateLimit } from './shared/middlewares/rate-limit.middleware'

type App = Express
interface IHttpServer {
  app: App
  server: Server
  open(port: number): void
}

export class ExpressServer implements IHttpServer {
  static instance: ExpressServer
  public app!: App
  public server!: Server

  private constructor() {
    this.init()
  }

  private init(): void {
    const app = express()
    app.use(bodyParser.json())
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    app.use(rateLimit({ maxRequests: 100, timeWindow: 1000 }))
    this.app = app
    this.setupRoutes()
    this.unhandledOperations()
    this.gracefulShutdown()
  }

  static getInstance(): ExpressServer {
    if (this.instance) return this.instance
    this.instance = new ExpressServer()
    return this.instance
  }

  private setupRoutes(): void {
    this.app.use('/programs', [authenticate], programsRouter)
    this.app.use('/drugs', [authenticate], drugsRouter)
    this.app.use('/auth', userRouter)
  }

  public open(port: number): void {
    try {
      this.server = ExpressServer.getInstance().app.listen(port, () => {
        console.log(`Express App Listening on Port ${port}`)
        console.log(`Swagger documentation available on /api-docs`)
        console.log(`Visual database admin is available on http://localhost:8081/ (check readme for credentials)`)
      })
    } catch (error) {
      console.error(`An error occurred: ${JSON.stringify(error)}`)
      process.exit(1)
    }
  }

  private close(): void {
    this.server?.close(async (serverError: unknown) => {
      if (serverError) {
        console.log(`Error when trying to close server. Details: ${JSON.stringify(serverError)}`)
        MongoDBDatabase.close()
        process.exit(1)
      } else {
        console.log('Server closed succesfully')
        MongoDBDatabase.close()
        process.exit(0)
      }
    })
  }

  private unhandledOperations(): void {
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      console.log(`Unhandled promise detected: ${String(promise)} and reason ${String(reason)}`)
      throw reason
    })
    process.on('uncaughtException', async (error: Error) => {
      console.log(`Unhandled error detected: ${String(error.message)}`)
      console.log(`
          ************ START STACK ************ \n
          ${String(error.stack)} \n
          ************ END STACK ************`)
      this.close()
    })
  }

  private gracefulShutdown(): void {
    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT']
    exitSignals.forEach((signal: string) => {
      process.on(signal, () => {
        console.log(`Closing server conection by signal: ${signal}...`)
        this.close()
      })
    })
  }
}
