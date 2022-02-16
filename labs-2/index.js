'use strict'
const assert = require('assert')
const { join , basename} = require('path')
const fs = require('fs')
const { promisify } = require('util')
const timeout = promisify(setTimeout)
const project = join(__dirname, 'project')
try { fs.rmdirSync(project, {recursive: true}) } catch (err) {
  console.error(err)
}
fs.mkdirSync(project)

let answer = ''

async function writer () {
  const { open, chmod, mkdir } = fs.promises
  const pre = join(project, Math.random().toString(36).slice(2))
  const handle = await open(pre, 'w')
  await handle.close()
  await timeout(500)
  exercise(project)
  const file = join(project, Math.random().toString(36).slice(2))
  const dir = join(project, Math.random().toString(36).slice(2))
  const add = await open(file, 'w')
  await add.close()
  await mkdir(dir)
  await chmod(pre, 0o444)
  await timeout(500)
  assert.strictEqual(
    answer, 
    file, 
    'answer should be the file (not folder) which was added'
  )
  console.log('passed!')
  process.exit()
}

writer().catch((err) => {
  console.error(err)
  process.exit(1)
})


function exercise (project) {
  //Initializes a unique set of array
  const files = new Set(fs.readdirSync(project))
  fs.watch(project, (evt, filename) => {
    try {
      const filepath = join(project, filename)
      const stat = fs.statSync(filepath)
      let present = files.has(filename);
      let modifiedtime = stat.mtimeMs;
      let createdtime = stat.ctimeMs;
     if(!stat.isDirectory()){
      if((present === false)&&(modifiedtime === createdtime)){
        answer = filepath;
      }
     }
    } catch (err) {
      console.log(err);
    } 
  })
}