import { DrugIndication, IDrugIndication } from "./drugs.model"

export interface IDrugsDAO {
  queryAll(indication: string, icd10code: string): Promise<IDrugIndication[]>
}

export class MongooseDrugsDAO implements IDrugsDAO {
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