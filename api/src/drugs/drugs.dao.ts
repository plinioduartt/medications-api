import { DrugIndication, IDrugIndication } from "./drugs.model"

export type CreateDrugIndicationRequest = {
  drugName: string
  indication: string
  icd10Code: string
}

export type UpdateDrugIndicationRequest = {
  indication: string
  icd10Code: string
}

export interface IDrugsDAO {
  findByIndicationId(indicationId: string): Promise<IDrugIndication | null>
  findByDrugNameAndIcd10Code(drugName: string, icd10code: string): Promise<IDrugIndication | null>
  queryAll(indication: string, icd10Code: string): Promise<IDrugIndication[]>
  create(data: CreateDrugIndicationRequest): Promise<IDrugIndication>
  updateByIndicationId(indicationId: string, data: Partial<UpdateDrugIndicationRequest>): Promise<IDrugIndication | null>
  deleteByIndicationId(indicationId: string): Promise<IDrugIndication | null>
}

export class MongooseDrugsDAO implements IDrugsDAO {
  async deleteByIndicationId(indicationId: string): Promise<IDrugIndication | null> {
    return DrugIndication.findByIdAndDelete(indicationId)
  }

  async updateByIndicationId(indicationId: string, data: Partial<UpdateDrugIndicationRequest>): Promise<IDrugIndication | null> {
    return DrugIndication.findByIdAndUpdate(
      indicationId,
      data,
      { new: true }
    )
  }

  async findByIndicationId(indicationId: string): Promise<IDrugIndication | null> {
    return await DrugIndication.findById(indicationId)
  }

  async findByDrugNameAndIcd10Code(drugName: string, icd10Code: string): Promise<IDrugIndication | null> {
    return DrugIndication.findOne({
      drug_name: drugName.toLowerCase(),
      icd10_code: icd10Code
    })
  }

  async create(data: CreateDrugIndicationRequest): Promise<IDrugIndication> {
    const entry = new DrugIndication({
      drug_name: data.drugName.toLowerCase(),
      indication: data.indication,
      icd10_code: data.icd10Code
    })
    await entry.save()
    return entry
  }

  async queryAll(indication: string, icd10code: string): Promise<IDrugIndication[]> {
    const filters: Record<string, RegExp> = {}
    if (indication) filters.indication = new RegExp(indication as string, "i")
    if (icd10code) filters.icd10_code = new RegExp(icd10code as string, "i")

    return (await DrugIndication.find(filters).exec())
      .map(item => ({
        indication: item.indication,
        drug_name: item.drug_name,
        icd10_code: item.icd10_code,
      }))
  }
}