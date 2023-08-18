import {Quid, QuidCollection} from './Quid'
class Fixture extends Quid{
    tx : number;
    ty: number;
    tz: number
    constructor(id,name){
        super(id,name)
        this.tx = 0;
        this.ty = 0;
        this.tz = 0
    }
    sharedMethod(){

    }

}

export default Fixture;