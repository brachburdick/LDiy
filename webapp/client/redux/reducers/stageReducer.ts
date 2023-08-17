
import * as types from '../actions/actionTypes';
import {Quid, QuidCollection} from '../../models/Quid'
import Projector from '../../models/Projector'
import Group from '../../models/Group'
import Fixture from '../../models/Fixture'

//some shoe-in setup
let stageProjectors = new QuidCollection(Projector, ['p_001'])
let stageGroups = new QuidCollection(Group, ['g_001'])
let defaultFixtures = ['f_001', 'f_002', 'f_003']
let stageFixtures = new QuidCollection(Fixture, defaultFixtures)

type initialState = {
  projectors: QuidCollection<Projector>;
  groups: QuidCollection<Group>;
  fixtures: QuidCollection<Fixture>;

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

    default: {
      return state;
    }
  }
};

export default stageReducer;
