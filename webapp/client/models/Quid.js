//quid roughly means "thing" or "what"
//didn't know what else to call this


export class Quid{

    constructor(id,name){
        this.id = id;
        this.name = name;
        this.relationships = {}; //should be an object with reference to quids
    }
    
    sharedMethod(){

    }

}
export class QuidCollection{
    constructor(quids){ //this requires data structure to be correct.
        this.byId = quids
        let idArr = [];
        Object.keys(quids).forEach((key)=>idArr.push(quids[key].id)); //grab id property of each object
        this.allIds =  idArr;
        this.quantity = idArr.length;
        this.interface = Quid;
    }

    add(quids,quant=1){ //needs to be an array of quid references. //optional quantity to account for multiples. default is 1.
        //assuming all info is appropriately filled out
        // quids.forEach((quid)=>{

        // })
        //now assume we have only id and name

        //now dont assume we have an id or name, the minimum information
    }

}