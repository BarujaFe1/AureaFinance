// scan-lite.mjs
import fs from 'fs'
import path from 'path'

// Diretórios que interessam ao projeto
const INCLUDE_DIRS = [
  'app',
  'features',
  'services',
  'lib',
  'db',
  'components',
]

// Arquivos raiz que interessam
const INCLUDE_ROOT_FILES = [
  'package.json',
  'tsconfig.json',
  'next.config.ts',
  'next.config.js',
  'next.config.mjs',
  'tailwind.config.ts',
  'tailwind.config.js',
  'middleware.ts',
]

// Pastas para pular mesmo dentro dos diretórios acima
const IGNORE_SUBDIRS = new Set([
  'node_modules', '.next', '.git', 'dist', 'build',
  '__tests__', 'test', 'tests', 'coverage',
  // Pula componentes shadcn/ui gerados (não escritos pelo dev)
  'ui',
])

// Extensões que importam
const VALID_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.sql', '.json',
])

// Arquivos para pular
const IGNORE_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb',
])

const OUTPUT_FILE = 'project-scan-lite.md'
const ROOT = process.cwd()
let output = ''
let fileCount = 0

function getLang(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  const map = {
    '.ts': 'typescript', '.tsx': 'tsx', '.js': 'javascript',
    '.jsx': 'jsx', '.json': 'json', '.sql': 'sql', '.mjs': 'javascript',
  }
  return map[ext] || 'text'
}

function readDir(dir) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch { return }

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const fullPath = path.join(dir, entry.name)
    const rel = path.relative(ROOT, fullPath)

    if (entry.isDirectory()) {
      if (IGNORE_SUBDIRS.has(entry.name)) continue
      readDir(fullPath)
    } else {
      if (IGNORE_FILES.has(entry.name)) continue
      const ext = path.extname(entry.name).toLowerCase()
      if (!VALID_EXTENSIONS.has(ext)) continue
      appendFile(fullPath, rel)
    }
  }
}

function appendFile(fullPath, rel) {
  try {
    const content = fs.readFileSync(fullPath, 'utf-8').trim()
    if (!content) return
    const lang = getLang(fullPath)
    output += `\n## \`${rel}\`\n\`\`\`${lang}\n${content}\n\`\`\`\n`
    fileCount++
  } catch { /* ignora binários */ }
}

// Arquivos da raiz
for (const name of INCLUDE_ROOT_FILES) {
  const fullPath = path.join(ROOT, name)
  if (fs.existsSync(fullPath)) appendFile(fullPath, name)
}

// Diretórios do projeto
for (const dir of INCLUDE_DIRS) {
  const fullPath = path.join(ROOT, dir)
  if (fs.existsSync(fullPath)) readDir(fullPath)
}

const header = `# Project Scan (lite) — ${path.basename(ROOT)}
> Gerado em: ${new Date().toLocaleString('pt-BR')}
> Arquivos capturados: ${fileCount}
> Pastas escaneadas: ${INCLUDE_DIRS.join(', ')}
> Componentes shadcn/ui (/components/ui) ignorados — gerados automaticamente

---
`

fs.writeFileSync(OUTPUT_FILE, header + output, 'utf-8')
const sizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)

console.log(`✅ Scan lite completo!`)
console.log(`📄 Arquivo: ${OUTPUT_FILE}`)
console.log(`📦 Tamanho: ${sizeKB} KB`)
console.log(`🗂️  Arquivos: ${fileCount}`)