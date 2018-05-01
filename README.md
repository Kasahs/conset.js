[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/conset)
# conset.js  
An ordered conditional set (you can provide your own hash) for typescript/javascript

### Features
* Provide your own hash function which returns a string. This will be used as the identifier of the item.
* Maintain order.
* Newly added values override existing ones and update order.
* Barebones functional API.
* get intersection
* [TODO] append and prepend.

### Usage

```ts
import * as conset from 'conset'

interface MyItem {
	id:string
	data:any[]
}

function myhash(item:MyItem):string {
	return item['id']
}

let myset = conset.create(myhash)

conset.add(myset, {id: 1, data: ["whatever", "something"]})
conset.add(myset, {id: 2, data: ["something", "whatever"]})
conset.add(myset, {id: 3, data: ["something", "whatever", "balls"]})

conset.getItems(myset)
/* 
[
	{id: 1, data: ["whatever", "something"]}
	{id: 2, data: ["something", "whatever"]}
	{id: 3, data: ["something", "whatever", "balls"]}
] 
*/

conset.contains(myset, {id: '3'}) 
/*
true
*/
conset.remove(myset, {id: 3}) 
conset.getItems(myset)
/* 
[
	{id: 1, data: ["whatever", "something"]}
	{id: 2, data: ["something", "whatever"]}
] 
*/

for(let item of conset.iter(myset)) {
	console.dir(item)
}
/*
{id: 1, data: ["whatever", "something"]}
{id: 2, data: ["something", "whatever"]}
*/

var c = conset.create((item) => {return item['a']}, [{a:1}, {a:2}, {a:7}])
var d = conset.create((item) => {return item['a']}, [{a:1}, {a:2}, {a:3}])
conset.getItems(conset.intersect(c,d))
/*
[ { a: 1 }, { a: 2 } ]
*/
```

### API overview [TODO use JSDoc for this]
```ts
declare type HashFunction<T> = (item: T) => string;
interface Conset<T> {
    map: Object;
    order: string[];
    hashFunction: HashFunction<T>;
}
declare const create: <T>(hashFunction: HashFunction<T>, initialItems?: T[]) => Conset<T>;
declare function iter<T>(conset: Conset<T>): IterableIterator<T>;
declare const remove: <T>(conset: Conset<T>, item: T) => Conset<T>;
declare const add: <T>(conset: Conset<T>, item: T) => Conset<T>;
declare const contains: <T>(conset: Conset<T>, item: T) => boolean;
declare const getItems: <T>(conset: Conset<T>) => T[];
declare const size: <T>(conset: Conset<T>) => number;
declare const intersect: <T>(smaller: Conset<T>, larger: Conset<T>) => Conset<T>;
```

