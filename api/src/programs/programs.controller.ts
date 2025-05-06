import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { Program } from './program.model'

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

    res.status(200).json(program)
  }
}
