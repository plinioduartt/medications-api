import { DrugIndication } from '../../../drugs/drugs.model'
import { Program } from '../../../programs/program.model'

export async function programsSeed() {
  try {
    const existingCount = await Program.countDocuments()
    if (existingCount > 0) {
      console.log('Ignoring seed.')
      return
    }

    const indications = await DrugIndication.find({ drug_name: 'dupixent' }).limit(5)

    if (indications.length === 0) {
      console.log('No drug indications found in the database.')
      return
    }

    const program = new Program({
      name: 'Default Program',
      description: 'This program groups drugs indications for Dupixent.',
      drugIndications: indications.map(ind => ind._id),
    })

    await program.save()

    console.log('Program created successfully')
  } catch (error) {
    console.log("Error seeding program", error)
  }
}

