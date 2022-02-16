'use strict'
const assert = require('assert')
const { join, basename } = require('path')
const fs = require('fs')
//File name
const project = join(__dirname, 'project')
//Remove directory with sync method
try { fs.rmdirSync(project, {recursive: true}) } catch (err) {}
//Creates files
const files = Array.from(Array(5), () => {
  return join(project, Math.random().toString(36).slice(2))
})
files.sort()
//Creates project folder
fs.mkdirSync(project)
//Allows the file to be opened for writting and closed also
for (const f of files) fs.closeSync(fs.openSync(f, 'w'))

const out = join(__dirname, 'out.txt')


function exercise () {
  let files = fs.readdirSync(project);
  let fileToPrint = [];
  for(const file of files){
    basename(file);
    fileToPrint.push(basename(file))
  }
  fileToPrint.join();
  return fileToPrint;
}

let fileToPrint = exercise()

fs.writeFileSync(out,fileToPrint,(err)=>{
  console.log(err)
});

assert.deepStrictEqual(
  fs.readFileSync(out).toString().split(',').map((s) => s.trim()),
  files.map((f) => basename(f))
)
console.log('passed!')
