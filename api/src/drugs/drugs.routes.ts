
import { Router } from 'express'
import { DrugsController } from './drugs.controller'
import { MongooseDrugsDAO } from './drugs.dao'

const drugsDAO = new MongooseDrugsDAO()
const drugsController = new DrugsController(drugsDAO)

const drugsRouter = Router()

drugsRouter.get('/:drug/mappings', [], drugsController.queryAll.bind(drugsController))

export { drugsRouter }
