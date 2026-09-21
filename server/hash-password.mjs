// Generate a bcrypt hash for ADMIN_PASSWORD_HASH.
// Usage: npm run gen:hash -- "your-strong-password"
import bcrypt from 'bcrypt'

const password = process.argv[2]

if (!password || password.length < 8) {
  console.error('Usage: npm run gen:hash -- "your-strong-password" (min 8 characters)')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 10)
console.log(hash)
