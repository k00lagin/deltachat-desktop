const DeltaChat = require('deltachat-node')
const path = require('path')
const getLogins = require('../logins')
const C = require('deltachat-node/constants')
const { getConfigPath } = require('../../application-constants')
const log = require('../../logger').getLogger('main/deltachat/backup')

function backupExport (dir) {
  this._dc.importExport(C.DC_IMEX_EXPORT_BACKUP, dir)
}

function backupImport (backupFile) {
  log.debug('backupImport:', backupFile)
  const cwd = path.join(this.cwd, 'tmp')
  this._dc = new DeltaChat(cwd)
  this._dc.on(' DC_EVENT_IMEX_PROGRESS ', (args) => {
    log.debug('DC_EVENT_IMEX_PROGRESS', args)
  })
  this._dc.on('DC_EVENT_IMEX_FILE_WRITTEN', (filename, args) => {
    log.debug('DC_EVENT_IMEX_FILE_WRITTEN', filename, args)
    getLogins(cwd, (login) => {
      log.debug('getLogins callback', login)
    })
  })
  this._dc.importExport(C.DC_IMEX_IMPORT_BACKUP, backupFile)
  // log.debug('cwd', cwd)
}

module.exports = function () {
  this.backupExport = backupExport.bind(this)
  this.backupImport = backupImport.bind(this)
}
