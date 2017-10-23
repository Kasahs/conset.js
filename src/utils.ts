export const removeArrayItem = (arr: any[], idx: number) => {
  let copy = arr.slice()
  let temp = copy.splice(idx)
  temp.shift()
  copy = copy.concat(temp)
  return copy
}
