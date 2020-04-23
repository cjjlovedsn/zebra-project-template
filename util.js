const fs = require('fs')
const path = require('path')

const glob = root => {
  const files = fs.readdirSync(root)
  const result = []
  for (const file of files) {
    const filepath = path.join(root, file)
    try {
      const stats = fs.statSync(filepath)
      if (stats.isDirectory()) {
        const res = glob(filepath)
        result.push(...res)
      } else {
        result.push(filepath)
      }
    } catch (error) {
      console.error(error)
    }
  }
  return result
}

module.exports = {
  glob: glob
}