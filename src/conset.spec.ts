import {expect} from 'chai'
import {conset, Conset} from './conset'

interface DummyItem {
    test: string,
    data: ["dummy", "values"]
}

const isInstanceOfConset = <T>(obj:any): obj is Conset<T> => {
    return "map" in obj && "order" in obj && "comparator" in obj
}

describe('testing create function', ()=>{
    it("should create an empty conset if only comparator provided", ()=>{

        let myset = conset.create((item:DummyItem):string => {
            return item['test']
        })

        expect(isInstanceOfConset(myset)).to.be.equal(true)
        expect(myset.order).to.be.empty
        expect(myset.map).to.be.empty
         
    })
})