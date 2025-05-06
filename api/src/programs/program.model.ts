import mongoose, { Schema } from 'mongoose'

const ProgramSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    drugIndications: [{ type: Schema.Types.ObjectId, ref: 'DrugIndication' }]
  },
  { timestamps: true }
)

export const Program = mongoose.model('Program', ProgramSchema)
