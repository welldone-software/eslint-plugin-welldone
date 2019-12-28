module.exports = {
  isRelative(rawImportRequest) {
    return rawImportRequest[0] === '.'
  }
}
