const fs = require('fs')
const path = require('path')

const visited = new Set()
const pathStack = []

function findPath(currentFile, targetFile) {
  if (visited.has(currentFile)) return null
  visited.add(currentFile)
  pathStack.push(currentFile)

  if (currentFile.endsWith(targetFile)) {
    return [...pathStack]
  }

  try {
    const content = fs.readFileSync(currentFile, 'utf8')
    const importRegex = /from\s+['"](.+?)['"]/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      let importPath = match[1]
      if (importPath.startsWith('@/')) {
        importPath = importPath.replace('@/', './')
      }

      let resolvedPath
      if (importPath.startsWith('.')) {
        resolvedPath = path.resolve(path.dirname(currentFile), importPath)
        if (!resolvedPath.endsWith('.ts') && !resolvedPath.endsWith('.tsx')) {
          if (fs.existsSync(resolvedPath + '.ts')) resolvedPath += '.ts'
          else if (fs.existsSync(resolvedPath + '.tsx')) resolvedPath += '.tsx'
          else if (fs.existsSync(path.join(resolvedPath, 'index.ts')))
            resolvedPath = path.join(resolvedPath, 'index.ts')
        }

        if (fs.existsSync(resolvedPath)) {
          const found = findPath(resolvedPath, targetFile)
          if (found) return found
        }
      }
    }
  } catch (e) {
    // console.error('Error reading', currentFile, e.message);
  }

  pathStack.pop()
  return null
}

const start = path.resolve('lib/api/listings/index.ts')
const target = 'lib/utils/analytics.ts'
const result = findPath(start, target)
if (result) {
  console.log('Path found:')
  result.forEach((p, i) => console.log('  '.repeat(i) + p))
} else {
  console.log('No path found between', start, 'and', target)
}
