function getExtension(filename) {
  const parts = filename.name.split(".")
  return parts[parts.length - 1]
}

function isImage(filename) {
  var ext = getExtension(filename)
  switch (ext.toLowerCase()) {
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "png":
      //etc
      return true
  }
  return false
}
export default isImage
