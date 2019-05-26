const path = require('path')
const series = require('run-series')
const fs = require('fs')
const DeltaChat = require('deltachat-node')
const log = require('../logger').getLogger('main/logins')

function getLogins (dir, cb) {
  log.debug('getLogins', dir)
  const tasks = []
  fs.readdir(dir, (err, files) => {
    if (err) return cb(err)
    files.forEach(filename => {
      if (!fs.existsSync(path.join(dir, filename, 'db.sqlite'))) return
      const fullPath = path.join(dir, filename)
      if (fs.statSync(fullPath).isDirectory()) {
        tasks.push(getConfig(fullPath))
      }
    })
    series(tasks, (err, logins) => {
      if (err) return cb(err)
      cb(null, logins.filter(i => {
        return i && typeof i.addr === 'string'
      }).map(i => i.addr))
    })
  })
}

function getConfig (cwd) {
  return next => {
    DeltaChat.getConfig(cwd, next)
  }
}

module.exports = getLogins
