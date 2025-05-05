import mongoose, { Types } from "mongoose"

const DupixentMappingSchema = new mongoose.Schema({
    indication: { type: String, required: true },
    icd10_code: { type: String, required: true },
    drug_name: { type: String, required: true }
})

export const DupixentMapping = mongoose.model("DupixentMapping", DupixentMappingSchema, "dupixent_mappings")

export type DupixentMappingDTO = {
    _id?: Types.ObjectId
    indication: string
    icd10_code: string
    drug_name: string
}  