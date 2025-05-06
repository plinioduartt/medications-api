import bcrypt from 'bcryptjs'
import { User } from '../../../auth/user.model'

export async function usersSeed(): Promise<void> {
  const adminEmail = 'admin@admin.com'

  const existingAdmin = await User.findOne({ email: adminEmail })

  if (existingAdmin) return

  const hashedPassword = await bcrypt.hash('admin', 10)

  await User.create({
    name: 'Admin',
    email: adminEmail,
    password: hashedPassword,
    role: 'ADMIN',
  })

  console.log('Admin user created')
}
