
import * as types from '../actions/actionTypes';
import {Quid, QuidCollection} from '../../models/Quid'
import Projector from '../../models/Projector'
import Group from '../../models/Group'
import Fixture from '../../models/Fixture'

//some shoe-in setup
let stageProjectors = new QuidCollection(Projector, ['P1'])
stageProjectors.add([new Projector('p_001', 'projector1')])
console.log(JSON.stringify(stageProjectors))
let stageGroups = new QuidCollection(Group, ['g_001'])
stageGroups.add([new Group('g_001','group1')])
console.log(JSON.stringify(stageGroups))

let defaultFixtures = [];
for(let i = 1; i<4; i++){
  defaultFixtures.push(new Fixture('f_00'+String(i),"fixture"+i))
}
let stageFixtures = new QuidCollection(Fixture, defaultFixtures)
console.log(JSON.stringify(stageFixtures))

export type initialState = {
  projectors: QuidCollection<Projector>;
  groups: QuidCollection<Group>;
  fixtures: QuidCollection<Fixture>;
  currentSelection: QuidCollection<any> | Quid;
}

const initialState = { 
  projectors: stageProjectors,
  groups: stageGroups,
  fixtures: stageFixtures,
};

const stageReducer = (state = initialState, action) => {

  console.log('REDUCER', action);
  switch (action.type) {
    case types.ADD_QUID_TO_COLLECTION:

      return {
        ...state
      };


    case types.REMOVE_QUID_FROM_COLLECTION:
      
      return {
        ...state,
      };



    case types.RELATE_QUID: 
      return {
        ...state
      };

    case types.DISOWN_QUID: 
    return {
      ...state
    };
    case types.SELECT_THING: 
    return {
      ...state
    };
    case types.MOVE: 
    return {
      ...state
    };

    default: {
      return state;
    }
  }
};

export default stageReducer;
