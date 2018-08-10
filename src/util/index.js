const {download} = require('subdb-node')
const fs = require('fs')
const recursive = require("recursive-readdir")
const path = require("path")

const vidExts = [".avi", ".mp4", ".mkv", ".mpg", ".mpeg", ".mov", ".rm", ".vob", ".wmv", ".flv", ".3gp",".3g2"]
const isVideo = (filePath) => {
	return vidExts.includes(path.extname(filePath))
}

const isDirectory = (filePath) => {
	return fs.lstatSync(filePath).isDirectory()
}
window.global.download = download
window.global.recursive = recursive
window.global.path = path
window.global.isVideo = isVideo
window.global.isDirectory = isDirectory