
import { Router } from 'express'
import { DrugsController } from './drugs.controller'
import { MongooseDrugsDAO } from './drugs.dao'

const drugsDAO = new MongooseDrugsDAO()
const drugsController = new DrugsController(drugsDAO)

const drugsRouter = Router()

drugsRouter.get('/:drugName/indications', [], drugsController.queryAll.bind(drugsController))
drugsRouter.post('/:drugName/indications', [], drugsController.create.bind(drugsController))
drugsRouter.get('/:drugName/indications/:indicationId', [], drugsController.findById.bind(drugsController))
drugsRouter.patch('/:drugName/indications/:indicationId', [], drugsController.update.bind(drugsController))
drugsRouter.delete('/:drugName/indications/:indicationId', [], drugsController.delete.bind(drugsController))

export { drugsRouter }
