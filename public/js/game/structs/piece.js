var makePiece = function(name, desc, str, side){
  return {
    name: name,
    description: desc,
    strength: str,
    side: side
  }
}

module.exports = makePiece;