import fs from 'fs'
import path from 'path'

const localesDir = '/home/creator/slovor-mp/packages/i18n/locales'
const languages = ['en', 'ru', 'sk', 'cs']

function getKeys(obj, prefix = '') {
  let keys = []
  for (const key in obj) {
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`))
    } else {
      keys.push(`${prefix}${key}`)
    }
  }
  return keys
}

const namespaces = fs
  .readdirSync(path.join(localesDir, 'en'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''))

console.log(
  `🔍 Checking ${namespaces.length} namespaces across ${languages.join(', ')}...`
)

namespaces.forEach((ns) => {
  const fileKeys = {}
  languages.forEach((lang) => {
    const filePath = path.join(localesDir, lang, `${ns}.json`)
    if (fs.existsSync(filePath)) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      fileKeys[lang] = getKeys(content)
    } else {
      console.log(`⚠️  Missing file: ${lang}/${ns}.json`)
      fileKeys[lang] = []
    }
  })

  // Compare keys
  const allKeys = new Set()
  languages.forEach((lang) => fileKeys[lang].forEach((k) => allKeys.add(k)))

  allKeys.forEach((key) => {
    languages.forEach((lang) => {
      if (!fileKeys[lang].includes(key)) {
        console.log(`❌ [${ns}] Missing key: "${key}" in ${lang}`)
      }
    })
  })
})
