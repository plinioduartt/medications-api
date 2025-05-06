import { Schema, model } from 'mongoose'

export interface IDrugIndication {
    indication: string
    icd10_code: string
    drug_name: string
}

const DrugIndicationSchema = new Schema<IDrugIndication>({
    indication: { type: String, required: true },
    icd10_code: { type: String, required: true },
    drug_name: { type: String, required: true }
})

export const DrugIndication = model<IDrugIndication>("DrugIndication", DrugIndicationSchema, "drug_indications")