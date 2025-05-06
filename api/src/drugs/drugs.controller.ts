import { HttpRequest, HttpResponse } from '../shared/types/dtos'
import { customNodeCache } from '../shared/utils/cache.util'
import { IsValidId } from '../shared/utils/is-valid-mongoose-object-id.util'
import { IDrugsDAO } from './drugs.dao'
import { createDrugIndicationSchema, updateDrugIndicationSchema } from './request-schemas/drugs'

export class DrugsController {
  constructor(private readonly drugsDAO: IDrugsDAO) { }

  /**
   * @swagger
   * /drugs/:drugName/indications:
   *   get:
   *       summary: Returns the drug indication mapping to ICD-10 code.
   *       description: Returns the drug indication mapping to ICD-10 code. Queryable by `indication` and `icd10code` query parameters.
   *       tags: [Drug]
   *       security:
   *         - BearerAuth: []
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
    const { drugName } = req.params
    const availableDrugs = ["dupixent"]
    if (!availableDrugs.includes(drugName.toLowerCase())) res.status(404).send("DRUG NOT FOUND")
    const { indication, icd10code } = req.query

    const cacheKey = `drugs:queryAll:drugName=${drugName}:indication=${indication}:icd10Code=${icd10code}`
    const cached = customNodeCache.get(cacheKey)

    if (cached) {
      res.status(200).json(cached)
      return
    }

    const results = await this.drugsDAO.queryAll(indication as string, icd10code as string)

    customNodeCache.set(cacheKey, results, 5 * 60 * 1000)

    res.status(200).json(results)
  }

  /**
   * @swagger
   * /drugs/:drugName/indications:
   *   post:
   *     summary: Create a drug indication mapping
   *     tags: [Drug]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: drugName
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - drugName
   *               - indication
   *               - icd10Code
   *             properties:
   *               drugName:
   *                 type: string
   *               indication:
   *                 type: string
   *               icd10Code:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created successfully
   */
  async create(req: HttpRequest, res: HttpResponse) {
    const { error } = createDrugIndicationSchema.validate(req.body, { abortEarly: false })

    if (error) {
      res.status(400).json({ errors: error.details.map(err => err.message) })
      return
    }

    const { drugName } = req.params
    const { indication, icd10Code } = req.body

    const existingIndication = await this.drugsDAO.findByDrugNameAndIcd10Code(drugName, icd10Code)

    if (existingIndication) {
      res.status(409).json({ message: 'Indication already exists for this drug and ICD-10 code' })
      return
    }

    const entry = await this.drugsDAO.create({ drugName, indication, icd10Code })
    res.status(201).json(entry)
  }

  /**
   * @swagger
   * /drugs/:drugName/indications/:indicationId:
   *   get:
   *     summary: Get a drug indication mapping by ID
   *     tags: [Drug]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: drugName
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: indicationId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Mapping found
   *       404:
   *         description: Not found
   */
  async findById(req: HttpRequest, res: HttpResponse) {
    const { drugName, indicationId } = req.params

    if (!IsValidId.isSatisfiedBy(indicationId)) {
      res.status(400).json({ message: 'Invalid indicationId' })
      return
    }

    const entry = await this.drugsDAO.findByIndicationId(indicationId)

    if (!entry || entry.drug_name.toLowerCase() !== drugName.toLowerCase()) {
      res.status(404).json({ message: 'Not found' })
      return
    }

    res.status(200).json(entry)
  }

  /**
   * @swagger
   * /drugs/:drugName/indications/:indicationId:
   *   patch:
   *     summary: Update a drug indication mapping
   *     tags: [Drug]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: drugName
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: indicationId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               indication:
   *                 type: string
   *               icd10Code:
   *                 type: string
   *     responses:
   *       200:
   *         description: Updated successfully
   *       404:
   *         description: Not found
   */
  async update(req: HttpRequest, res: HttpResponse) {
    const { error } = updateDrugIndicationSchema.validate(req.body, { abortEarly: false })

    if (error) {
      res.status(400).json({ errors: error.details.map(err => err.message) })
      return
    }

    const { drugName, indicationId } = req.params

    if (!IsValidId.isSatisfiedBy(indicationId)) {
      res.status(400).json({ message: 'Invalid indicationId' })
      return
    }

    const entry = await this.drugsDAO.findByIndicationId(indicationId)
    if (!entry || entry.drug_name.toLowerCase() !== drugName.toLowerCase()) {
      res.status(404).json({ message: 'Not found' })
      return
    }

    const { icd10Code, ...restBody } = req.body
    const updateData = { ...restBody, icd10_code: icd10Code }

    const update = await this.drugsDAO.updateByIndicationId(indicationId, updateData)

    if (!update) {
      res.status(404).json({ message: 'Not found' })
      return
    }

    res.status(200).json(update)
  }

  /**
   * @swagger
   * /drugs/:drugName/indications/:indicationId:
   *   delete:
   *     summary: Delete a drug indication mapping
   *     tags: [Drug]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: drugName
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *       - name: indicationId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Deleted successfully
   *       404:
   *         description: Not found
   */
  async delete(req: HttpRequest, res: HttpResponse) {
    const { drugName, indicationId } = req.params

    if (!IsValidId.isSatisfiedBy(indicationId)) {
      res.status(400).json({ message: 'Invalid indicationId' })
      return
    }

    const entry = await this.drugsDAO.findByIndicationId(indicationId)

    if (!entry || entry.drug_name.toLowerCase() !== drugName.toLowerCase()) {
      res.status(404).json({ message: 'Not found' })
      return
    }

    const deleted = await this.drugsDAO.deleteByIndicationId(indicationId)

    if (!deleted) {
      res.status(404).json({ message: 'Not found' })
      return
    }
    res.status(204).send()
  }
}
