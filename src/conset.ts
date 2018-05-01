import { removeArrayItem } from "./utils"

type HashFunction<T> = (item: T) => string

interface Conset<T> {
  map: Object
  order: string[]
  hashFunction: HashFunction<T>
  
}

const create = <T>(
  hashFunction: HashFunction<T>,
  initialItems: T[] = []
): Conset<T> => {
  let conset: Conset<T> = {
    map: {},
    order: [],
    hashFunction: hashFunction,
  }
  
  initialItems.forEach((item: T) => {
    add(item, conset)
  })
  return conset
}

function* iter<T>(conset:Conset<T>): IterableIterator<T> {
  for(let i=0; i<conset.order.length; i++){
    yield conset.map[conset.order[i]]
  }
}

const remove = <T>(item: T, conset: Conset<T>): Conset<T> => {
  let itemIdx = conset.order.indexOf(conset.hashFunction(item))
  let hasItem = itemIdx > -1

  if (hasItem) {
    delete conset.map[conset.hashFunction(item)]
    conset.order = removeArrayItem(conset.order, itemIdx)
  }
  return conset
}

const add = <T>(item: T, conset: Conset<T>): Conset<T> => {
  remove(item, conset)
  conset.map[conset.hashFunction(item)] = item
  conset.order.push(conset.hashFunction(item))
  return conset
}

const size = <T>(conset: Conset<T>): number => {
  return conset.order.length
}

const contains = <T>(item: T, conset: Conset<T>): boolean => {
  return conset.map[conset.hashFunction(item)] !== undefined
}

const getItems = <T>(conset: Conset<T>) => {
  let res: T[] = []
  let items = iter(conset)
  for(let item of items) {
    res.push(item)
  }
  return res
}


export { HashFunction, Conset, create, add, remove, contains, getItems }
