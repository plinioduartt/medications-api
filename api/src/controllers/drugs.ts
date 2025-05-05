import { DupixentMapping } from '../database/models/dupixentMapping'
import { HttpRequest, HttpResponse } from '../types/dtos'

export class DrugsController {
  constructor() { }

  /**
   * @swagger
   * /drugs/:drug/mappings:
   *   get:
   *       summary: Returns the drug indication mapping to ICD-10 code.
   *       description: Returns the drug indication mapping to ICD-10 code. Queryable by `indication` and `icd10code` query parameters.
   *       tags: [Drug]
   *       parameters:
   *         - in: query
   *           name: indication
   *           required: true
   *           schema:
   *             type: string
   *           description: Indication and Usage
   *         - in: query
   *           name: icd10code
   *           required: true
   *           schema:
   *             type: string
   *           description: ICD-10 Code
   *         - in: path
   *           name: drug
   *           required: true
   *           schema:
   *             type: string
   *           description: Name of drug
   *       responses:
   *           200:
   *               description: Success
   *               content:
   *                 application/json:
   *                   schema:
   *                       type: array
   *                       items:
   *                          allOf:
   *                          - type: object
   *                            properties:
   *                              _id:
   *                                type: string
   *                                description: ID of the mapping
   *                              drug_name:
   *                                type: string
   *                                description: Drug name
   *                              indication:
   *                                type: string
   *                                description: Indication and Usage
   *                              icd10_code:
   *                                type: string
   *                                description: ICD-10 Code for a indication and usage
   */
  async queryAll(req: HttpRequest, res: HttpResponse): Promise<void> {
    try {
      const { drug } = req.params
      if (drug.toLowerCase() !== "dupixent") res.status(404).send("DRUG NOT FOUND")

      const { indication, icd10code } = req.query

      const filters: Record<string, RegExp> = {}
      if (indication) filters.indication = new RegExp(indication as string, "i")
      if (icd10code) filters.icd10_code = new RegExp(icd10code as string, "i")

      const results = await DupixentMapping.find(filters).exec()
      res.json(results)
    } catch (error) {
      console.error("Failed to fetch mappings", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  }
}
