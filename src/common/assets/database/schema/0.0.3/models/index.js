/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const fs = require('fs');
const path = require("path");
var files = fs.readdirSync(path.resolve(__dirname, "./"))
const schemaModels = []

files.forEach(key => {
  if (key === 'index.js') return
  // schemaModels[key.replace(/(\.\/|\.js)/g, '')] = key
  schemaModels.push(key.replace(/(\.\/|\.js)/g, ''))
})

console.log("files", files)
console.log("schemaModels", schemaModels)
module.exports =schemaModels