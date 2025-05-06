import { Router } from 'express'
import { ProgramsController } from './programs.controller'

const programsController = new ProgramsController()

const programsRouter = Router()

programsRouter.get('/:programId', programsController.queryAll.bind(programsController))

export { programsRouter }