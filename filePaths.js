'use strict'
console.log('current filename', __filename)
console.log('current dirname', __dirname)

'use strict'
const { readFileSync, fstat } = require('fs')
const contents = readFileSync(__filename)
console.log(contents)

'use strict'
const { readFileSync } = require('fs')
const contents = readFileSync(__filename, {encoding: 'utf8'})
console.log(contents)

'use strict'
const { join } = require('path')
const { readFileSync, writeFileSync } = require('fs')
const contents = readFileSync(__filename, {encoding: 'utf8'})
writeFileSync(join(__dirname, 'out.txt'), contents.toUpperCase())


'use strict'
const { createServer } = require('http')
const { Readable, Transform, pipeline } = require('stream')
const { opendir } = require('fs')

const createEntryStream = () => {
  let syntax = '[\n'
  return new Transform({
    writableObjectMode: true,//Enables object to be written
    readableObjectMode: false,
    transform (entry, enc, next) {
      next(null, `${syntax} "${entry.name}"`)
      syntax = ',\n'
    },
    final (cb) {
      this.push('\n]\n')
      cb()
    }
  })
}

createServer((req, res) => {
  if (req.url !== '/') {
    res.statusCode = 404
    res.end('Not Found')
    return
  }
  opendir(__dirname, (err, dir) => {
    if (err) {
      res.statusCode = 500
      res.end('Server Error')
      return
    }
    //Readable from returns a stream of iterable objects called dirStream
    const dirStream = Readable.from(dir)
    //This creates a transform stream
    const entryStream = createEntryStream()
    res.setHeader('Content-Type', 'application/json')
    //Takes the streams and pipes them one after the other
    pipeline(dirStream, entryStream, res, (err) => {
      if (err) console.error(err)
    })
  })
}).listen(3000)


//Reading current working directory
'use strict'
const { readdirSync, statSync } = require('fs')

const files = readdirSync('.')

for(const name of files) {
  const stat = statSync(name)
  const typeLabel = stat.isDirectory() ? 'dir':'file'
  const { atime,birthtime,ctime,mtime } = stat 
  console.log(typeLabel,name)
  console.log('atime:',atime.toLocaleString())
  console.log('ctime:',ctime.toLocaleString())
  console.log('mtime:',mtime.toLocaleString())
  console.log('birthtime:', birthtime.toLocaleString())
  console.groupEnd()
  console.log()
}
