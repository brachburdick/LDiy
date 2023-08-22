//quid roughly means "thing" or "what"
//didn't know what else to call this

import { initGenerator } from "@webpack-cli/generators";
import internal from "stream";
interface QuidConstructor {
    new (arg1: Quid | number, arg2?: string): Quid;
    createInstance(source: Quid): Quid;
  }

export class Quid{
    id:string;
    name:string;
    relationships: null | { [key: string]: string[] } = null;
    tx: number = 0;
    ty: number = 0;
    tz: number = 0;

    constructor(arg1, arg2 = null) {
        if (arg1 instanceof Quid) {
          // If the first argument is an instance of Quid, we use its properties
          for (let key in arg1){
                this[key] = arg1[key];
          }

          // ... copy other properties
        } else {
          // Otherwise, we treat arg1 as id and arg2 as name
          this.id = arg1;
          this.name = arg2;
            console.log('this ', this, ' should have name ', arg2)
        }
    }
    static createInstance(source: Quid): Quid {
        return new this(source);
      }
    
      setName(newName: string): Quid {
        const newQuid = (this.constructor as QuidConstructor).createInstance(this);
        newQuid.name = newName;
        return newQuid;
      }
      
    move(newTx:number|null = null, newTy:number|null = null, newTz:number|null = null):Quid {
        let updatedQuid = (this.constructor as QuidConstructor).createInstance(this);
        updatedQuid.tx = newTx;
        updatedQuid.ty = newTy;
        updatedQuid.tz = newTz;
        return updatedQuid;
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
            console.log('creating new quid with name', quid.name)
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