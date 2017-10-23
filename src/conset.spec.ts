import {expect} from 'chai'
import {conset, Conset} from './conset'

interface DummyItem {
    test: string,
    data: any[]
}

const dummy = <T>(key:string, data:T[]) => {
    return {
        test: key,
        data: data
    }
}

const isInstanceOfConset = <T>(obj:any): obj is Conset<T> => {
    return "map" in obj && "order" in obj && "comparator" in obj
}

const dummySet = () => {
    let myset = conset.create((item:DummyItem):string => {
        return item['test']
    }, [
        {test: "a", data: [1]},
        {test: "b", data: [1,2]},
        {test: "a", data: [1,2,3]},
        {test: "c", data: [1,2,3, 4]}
    ])
    return myset
}

describe('create function', ()=>{
    it("should create an empty conset if only comparator provided", ()=>{

        let myset = conset.create((item:DummyItem):string => {
            return item['test']
        })

        expect(isInstanceOfConset(myset)).to.be.equal(true)
        expect(myset.order).to.be.empty
        expect(myset.map).to.be.empty
         
    })

    it("should accept an intial set of values while discarding duplicates", () => {
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
        conset.remove({test: "a"}, myset)
        expect(myset.map["a"]).to.be.undefined
    })
    it("should fail silently if item not present", () => {
        let myset = dummySet()
        let originalLength = myset.order.length
        
        expect(conset.remove({test: 'key-not-present'}, myset))
            .to.not.throw
        expect(myset.map["key-not-present"]).to.be.undefined
        expect(myset.order.length).to.be.equal(originalLength)
        
    })
})

describe("add function", () => {
    it("should add a new value to the set", () => {
        let myset = conset.create((item:DummyItem):string => {
            return item['test']
        })
        expect(myset.order.length).to.be.equal(0)
        conset.add(dummy("key1", [1,2,3,4]), myset)
        expect(Object.keys(myset.map).length).to.be.equal(1)
        expect(myset.order.length).to.be.equal(1)
        
    })

    it("should override a previously existing key and put it at last position", () => {
        let myset = conset.create((item:DummyItem):string => {
            return item['test']
        })
        
        conset.add(dummy('x', [1,2,3]), myset)
        conset.add(dummy('y', [5,6,7]), myset)
        conset.add(dummy('z', [5,6,7]), myset)
        /*check initial order*/
        expect(myset.order.indexOf('x')).to.be.equal(0)
        expect(myset.order.indexOf('y')).to.be.equal(1)
        expect(myset.order.indexOf('z')).to.be.equal(2)

        /* ensure value is overriden */
        expect(myset.map['x'].data.length).to.be.equal(3)
        conset.add(dummy('x', [1]), myset)
        expect(myset.map['x'].data.length).to.be.equal(1)

        /* ensure order is changed */
        expect(myset.order.indexOf('y')).to.be.equal(0)
        expect(myset.order.indexOf('z')).to.be.equal(1)
        expect(myset.order.indexOf('x')).to.be.equal(2)
        
    })

    describe("constains function", () => {
        it("should return true if value exists, otherwise false", () => {
            let myset = dummySet()

            expect(conset.contains({test: "a", data: [1]}, myset)).to.be.equal(true)
            expect(conset.contains({test: "x", data: [1]}, myset)).to.be.equal(false)
            
        })
    })
})

describe("testing getItems function", () => {
    it("should return all items in set in order", () => {
        let myset = conset.create((item:DummyItem):string => {
            return item['test']
        })
        
        conset.add(dummy('x', [1,2,3]), myset)
        conset.add(dummy('y', [5,6,7]), myset)
        conset.add(dummy('z', [5,6,7]), myset)
        let items = conset.getItems(myset)
        expect(items.length).to.be.equal(myset.order.length)
        /*check  order*/
        let keys = items.map(item => {
            return item['test']
        })

        expect(keys.indexOf('x')).to.be.equal(0)
        expect(keys.indexOf('y')).to.be.equal(1)
        expect(keys.indexOf('z')).to.be.equal(2)

    })
})