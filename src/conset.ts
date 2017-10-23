import { removeArrayItem } from "./utils"

export type Comparator<T> = (item: T) => string

export interface Conset<T> {
  map: Object
  order: string[]
  comparator: Comparator<T>
}

export namespace conset {
  export const create = <T>(
    comparator: Comparator<T>,
    arr: T[] = []
  ): Conset<T> => {
    let conset = {
      map: {},
      order: [],
      comparator: comparator
    }
    arr.forEach((item: T) => {
      add(item, conset)
    })
    return conset
  }

  export const remove = <T>(item: T, conset: Conset<T>): Conset<T> => {
    let itemIdx = conset.order.indexOf(conset.comparator(item))
    let hasItem = itemIdx > -1

    if (hasItem) {
      delete conset.map[conset.comparator(item)]
      conset.order = removeArrayItem(conset.order, itemIdx)
    }
    return conset
  }

  export const add = <T>(item: T, conset: Conset<T>): Conset<T> => {
    remove(item, conset)
    conset.map[conset.comparator(item)] = item
    conset.order.push(conset.comparator(item))
    return conset
  }

  export const contains = <T>(item: T, conset: Conset<T>): boolean => {
    return conset.map[conset.comparator(item)] !== undefined
  }

  export const getItems = <T>(conset: Conset<T>) => {
    let res: T[] = []
    conset.order.forEach(key => {
      res.push(conset.map[key])
    })
    return res
  }
}
