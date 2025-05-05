import mongoose from "mongoose";

const DupixentMappingSchema = new mongoose.Schema({
    indication: { type: String, required: true },
    icd10_code: { type: String, required: true },
    drug_name: { type: String }
});

export const DupixentMapping = mongoose.model("DupixentMapping", DupixentMappingSchema, "dupixent_mappings");
