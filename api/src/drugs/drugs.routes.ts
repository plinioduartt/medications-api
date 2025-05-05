
import { Router } from 'express'
import { DrugsController } from './drugs.controller'
import { DrugsDAO } from './drugs.dao'

const drugsDAO = new DrugsDAO()
const drugsController = new DrugsController(drugsDAO)

const drugsRouter = Router()

drugsRouter.get('/:drug/mappings', [], drugsController.queryAll.bind(drugsController))

export { drugsRouter }
