import { Schema, model } from 'mongoose'

export interface IDrug {
    indication: string
    icd10_code: string
    drug_name: string
}

const DrugSchema = new Schema<IDrug>({
    indication: { type: String, required: true },
    icd10_code: { type: String, required: true },
    drug_name: { type: String, required: true }
})

export const Drug = model<IDrug>("Drug", DrugSchema, "drugs")