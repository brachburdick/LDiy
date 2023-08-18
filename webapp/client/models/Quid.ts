//quid roughly means "thing" or "what"
//didn't know what else to call this

import { initGenerator } from "@webpack-cli/generators";
import internal from "stream";


export class Quid{
    id:string;
    name:string;
    relationships: null | { [key: string]: string[] } = null;
    tx: number;
    ty: number;
    tz: number;

    constructor(id : string,name:string){
        this.id = id;
        this.name = name;
        this.relationships = {}; //should be an object with reference to quids
    }
    
    relate(){

    }

}

type QuidDictionary<T> = null | { [key: string]: T };



export class QuidCollection<T extends Quid>{
    byId: QuidDictionary<T> = null
    //This is unconventional for TS but I want to allow for future, unforseen categories; so I am generalizing quidCollection category
    //category is a constructor which will return an instance of type T
    category: new (id:string, name:string) => T ;
    allIds:null | string[] = null;
    quantity: number;
    tx: number;
    ty: number;
    tz: number;
    
    //instantiating a new collection requires a class and an optional quidDictionary
    constructor(categoryClass: new(id:string, name:string) => T, quids: null|string[] = null){
        this.category = categoryClass;

        const byId: { [key: string]: T } = {};
        const idArr: string[] = [];
        
        for (const quid in quids) {
            const thisQuid = quids[quid]
            byId[quid] = new categoryClass(quid, quid)
            idArr.push(quid);
        }
        
        this.byId = byId;
        this.allIds = idArr;
        this.quantity = idArr.length;
    }

    // I want functionality outside of the context of redux,
    // so I'll be defining methods carefully
    // to ensure data immutability

    add(quids: T[]): QuidCollection<T> {

        const newById = { ...this.byId };
        const newAllIds = [...(this.allIds || [])];

        for (let quid of quids) {
            newById[quid.id] = quid;
            newAllIds.push(quid.id);
        }

        const updatedQC = new QuidCollection(this.category);
        updatedQC.byId = newById;
        updatedQC.allIds = newAllIds;
        updatedQC.quantity = Object.keys(newById).length;

        return updatedQC;
      }



      remove(quids: T[]): QuidCollection<T> {

        const newById = { ...this.byId };
        const newAllIds = [...(this.allIds || [])];

        for (let quid of quids) {
            
            delete newById[quid.id]
            const index = newAllIds.indexOf(quid.id);
            newAllIds.splice(index, 1);
        }

        const updatedQC = new QuidCollection(this.category);
        updatedQC.byId = newById;
        updatedQC.allIds = newAllIds;
        updatedQC.quantity = Object.keys(newById).length;

        return updatedQC;
      }


}