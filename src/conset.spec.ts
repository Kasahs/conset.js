import { expect } from "chai"
import * as conset from "./conset"

interface DummyItem {
  test: string
  data: any[]
}

const dummy = <T>(key: string, data: T[]) => {
  return {
    test: key,
    data: data
  }
}

const isInstanceOfConset = <T>(obj: any): obj is conset.Conset<T> => {
  return "map" in obj && "order" in obj && "hashFunction" in obj
}

const dummySet = () => {
  let myset = conset.create(
    (item: DummyItem): string => {
      return item["test"]
    },
    [
      { test: "a", data: [1] },
      { test: "b", data: [1, 2] },
      { test: "a", data: [1, 2, 3] },
      { test: "c", data: [1, 2, 3, 4] }
    ]
  )
  return myset
}

describe("create function", () => {
  it("should create an empty conset if only hashFunction provided", () => {
    let myset = conset.create((item: DummyItem): string => {
      return item["test"]
    })

    expect(isInstanceOfConset(myset)).to.be.equal(true)
    expect(myset.order).to.be.empty
    expect(myset.map).to.be.empty
  })

  it("should create set from an array and handle duplicates", () => {
    let myset = dummySet()
    expect(isInstanceOfConset(myset)).to.be.equal(true)
    expect(Object.keys(myset.map).length).to.be.equal(3)
    expect(myset.order.length).to.be.equal(3)
  })
})

describe("remove function", () => {
  it("should remove the item from map and order", () => {
    let myset = dummySet()
    expect(myset.map["a"]).to.be.not.undefined
    conset.remove(myset, { test: "a" })
    expect(myset.map["a"]).to.be.undefined
  })
  it("should fail silently if item not present", () => {
    let myset = dummySet()
    let originalLength = myset.order.length

    expect(conset.remove(myset, { test: "key-not-present" })).to.not.throw
    expect(myset.map["key-not-present"]).to.be.undefined
    expect(myset.order.length).to.be.equal(originalLength)
  })
})

describe("add function", () => {
  it("should add a new value to the set", () => {
    let myset = conset.create((item: DummyItem): string => {
      return item["test"]
    })
    expect(myset.order.length).to.be.equal(0)
    conset.add(myset, dummy("key1", [1, 2, 3, 4]))
    expect(Object.keys(myset.map).length).to.be.equal(1)
    expect(myset.order.length).to.be.equal(1)
  })

  it("should override an existing key and re-position it", () => {
    let myset = conset.create((item: DummyItem): string => {
      return item["test"]
    })

    conset.add(myset, dummy("x", [1, 2, 3]))
    conset.add(myset, dummy("y", [5, 6, 7]))
    conset.add(myset, dummy("z", [5, 6, 7]))
    /*check initial order*/
    expect(myset.order.indexOf("x")).to.be.equal(0)
    expect(myset.order.indexOf("y")).to.be.equal(1)
    expect(myset.order.indexOf("z")).to.be.equal(2)

    /* ensure value is overriden */
    expect(myset.map["x"].data.length).to.be.equal(3)
    conset.add(myset, dummy("x", [1]))
    expect(myset.map["x"].data.length).to.be.equal(1)

    /* ensure order is changed */
    expect(myset.order.indexOf("y")).to.be.equal(0)
    expect(myset.order.indexOf("z")).to.be.equal(1)
    expect(myset.order.indexOf("x")).to.be.equal(2)
  })

  describe("constains function", () => {
    it("should return true if value exists, otherwise false", () => {
      let myset = dummySet()

      expect(conset.contains(myset, { test: "a", data: [1] }))
        .to.be.equal(true)
      expect(conset.contains(myset, { test: "x", data: [1] }))
        .to.be.equal(false)
    })
  })
})

describe("testing getItems function", () => {
  it("should return all items in set in order", () => {
    let myset = conset.create((item: DummyItem): string => {
      return item["test"]
    })

    conset.add(myset, dummy("x", [1, 2, 3]))
    conset.add(myset, dummy("y", [5, 6, 7]))
    conset.add(myset, dummy("z", [5, 6, 7]))
    let items = conset.getItems(myset)
    expect(items.length).to.be.equal(myset.order.length)
    /*check  order*/
    let keys = items.map(item => {
      return item["test"]
    })

    expect(keys.indexOf("x")).to.be.equal(0)
    expect(keys.indexOf("y")).to.be.equal(1)
    expect(keys.indexOf("z")).to.be.equal(2)
  })
})
