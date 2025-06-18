const fs = require('fs');
const path = require('path');

function getPath(file) {
  return path.join(__dirname, '../../data', file);
}

function read(file) {
  const filePath = getPath(file);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath);
  return JSON.parse(content);
}

function write(file, data) {
  const filePath = getPath(file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
