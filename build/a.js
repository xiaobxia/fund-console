function sellDiffMap(diff) {
  if (diff > 35) {
    return 0.4
  }
  if (diff > 30) {
    return 0.35
  }
  if (diff > 25) {
    return 0.3
  }
  if (diff > 20) {
    return 0.25
  }
  if (diff > 15) {
    return 0.2
  }
  if (diff > 10) {
    return 0.15
  }
  if (diff > 5) {
    return 0.1
  }
  return 0
}

console.log(sellDiffMap(15))
