import { DupixentMapping, DupixentMappingDTO } from "../database/models/dupixentMapping"

export interface IDrugsDAO {
    queryAll(indication: string, icd10code: string): Promise<DupixentMappingDTO[]>
}

export class DrugsDAO implements IDrugsDAO {
    async queryAll(indication: string, icd10code: string): Promise<DupixentMappingDTO[]> {
        const filters: Record<string, RegExp> = {}
        if (indication) filters.indication = new RegExp(indication as string, "i")
        if (icd10code) filters.icd10_code = new RegExp(icd10code as string, "i")

        return (await DupixentMapping.find(filters).exec())
            .map(item => ({
                _id: item._id,
                indication: item.indication,
                drug_name: item.drug_name,
                icd10_code: item.icd10_code,
            }))
    }
}