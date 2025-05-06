import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Program } from './program.model'
import { customNodeCache } from '../shared/utils/cache.util'

export class ProgramsController {
  /**
   * @swagger
   * /programs/:programId:
   *   get:
   *     summary: Get program details
   *     description: Returns details of a specific program by ID, with optional filtering by drug name.
   *     tags: [Program]
   *     parameters:
   *       - in: path
   *         name: programId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the program
   *       - in: query
   *         name: drugName
   *         required: false
   *         schema:
   *           type: string
   *         description: Filter drug indications by drug name
   *     responses:
   *       200:
   *         description: Program found
   *       400:
   *         description: Invalid program ID
   *       404:
   *         description: Program not found
   */
  async queryAll(req: Request, res: Response): Promise<void> {
    const { programId } = req.params
    const { drugName } = req.query

    if (!ObjectId.isValid(programId)) {
      res.status(400).json({ message: 'Invalid programId' })
      return
    }

    const cacheKey = `programs:queryAll:programId=${programId}:drugName=${drugName}`
    const cached = customNodeCache.get(cacheKey)

    if (cached) {
      res.status(200).json(cached)
      return
    }

    let query = Program.findById(programId)

    if (drugName) {
      query = query.populate({
        path: 'drugIndications',
        match: { drug_name: String(drugName).toLowerCase() },
      })
    } else {
      query = query.populate('drugIndications')
    }

    const program = await query

    if (!program) {
      res.status(404).json({ message: 'Program not found' })
      return
    }

    customNodeCache.set(cacheKey, program, 5 * 60 * 1000)

    res.status(200).json(program)
  }
}
