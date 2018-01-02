[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/conset)
# conset.js  
An ordered conditional set (you can provide your own hash) for typescript/javascript

### Features
* Provide your own hash function which returns a string. This will be used as the identifier of the item.
* Maintain order.
* Newly added values override existing ones and update order.
* Barebones functional API.
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

conset.add({id: 1, data: ["whatever", "something"]}, myset)
conset.add({id: 2, data: ["something", "whatever"]}, myset)
conset.add({id: 3, data: ["something", "whatever", "balls"]}, myset)

conset.getItems(myset)
/* 
[
	{id: 1, data: ["whatever", "something"]}
	{id: 2, data: ["something", "whatever"]}
	{id: 3, data: ["something", "whatever", "balls"]}
] 
*/

conset.contains({id: '3'}, myset) 
// true
conset.remove({id: 3}, myset) 
conset.getItems(myset)
/* 
[
	{id: 1, data: ["whatever", "something"]}
	{id: 2, data: ["something", "whatever"]}
] 
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
declare const remove: <T>(item: T, conset: Conset<T>) => Conset<T>;
declare const add: <T>(item: T, conset: Conset<T>) => Conset<T>;
declare const contains: <T>(item: T, conset: Conset<T>) => boolean;
declare const getItems: <T>(conset: Conset<T>) => T[];
```

