
import * as types from '../actions/actionTypes';
import {Quid, QuidCollection} from '../../models/Quid'
import Projector from '../../models/Projector'
import Group from '../../models/Group'
import Fixture from '../../models/Fixture'

//some shoe-in setup
let myProj = new Projector('p_001', 'Projector 1', null, 300, 150,0)
let stageProjectors = new QuidCollection(Projector, {myProj})
// stageProjectors.add([new Projector('p_001', 'projector1')])
console.log('stageProjectors', JSON.stringify(stageProjectors))
let myGroup = new Group('g_001', 'Group 1', null, 0, 0, 0)
let stageGroups = new QuidCollection(Group, {myGroup})
// stageGroups.add([new Group('g_001','group1')])
console.log('stageGroups', JSON.stringify(stageGroups))

let defaultFixtures = {};
for(let i = 1; i<4; i++){
  let thisFix = new Fixture('f_00'+String(i),"Fixture "+i, null, 100*i, 50*i, 0);
  defaultFixtures[thisFix.id] =thisFix
}
let stageFixtures = new QuidCollection(Fixture, defaultFixtures)
console.log('stageFixtures', JSON.stringify(stageFixtures))

export interface channelObj{
  identifier: string,
  parentID: number|null,
  value:number
}
export interface colorObj{
  r: number,
  g: number,
  b: number,
  a: number
}

export interface fixtureProfileObj  {
  id: number,
  name: string,
  numChannels: number,
  r: number|null,
  g: number|null,
  b: number|null,
  dimmer: number|null,
  misc: number|null,
  frontLight: boolean,
  homeAddys: number[]
}


export type stateStageType = {
  projectors: QuidCollection<Projector>;
  groups: QuidCollection<Group>;
  fixtures: QuidCollection<Fixture>;
  currentSelection: QuidCollection<any> | Quid;
  // fixtureProfileCount: number;
  allFixtureProfiles: Object;
  myFixtureProfiles:{id: fixtureProfileObj};
  currentColor: colorObj;
  outgoingUniverse:channelObj[];
}

let uObj = {}
Array.from({length:255}, (_,i)=>i+1).forEach((ind)=>uObj[ind] = {identifier: "", parentId:null, value:0})

export const initialState = { 
  projectors: stageProjectors,
  groups: stageGroups,
  fixtures: stageFixtures,
  // fixtureProfileCount: 0,
  allFixtureProfiles: {},
  myFixtureProfiles :{},
  currentColor: { r: 0, g: 0, b: 0, a: 1 },
  outgoingUniverse: uObj
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
      console.log('MOVE called')

      //replace the quid in the relavent quid collection.
      let newQ = action.payload
      let byId
      let cat
      let col
      for(let qc in state){
        if (newQ instanceof state[qc].category){
        col = qc
        cat = state[qc].category
        byId = state[qc].byId
      }}
      let newQID = newQ.id;
      byId = {byId, newQID: newQ }

       let newQC = new QuidCollection(cat, byId)
      return {
        ...state,
        col: newQC

      };


    // case types.ADD_FIXTURE_PROFILE_COUNT:

    // return{
    //   ...state
    // }
      case types.UPDATE_FIXTURE_PROFILES:
        console.log('updating FP in reducer, ', action.payload, 'into ', state.myFixtureProfiles)
        let newMFP = {
          ...state.myFixtureProfiles,
          [action.payload.id]: action.payload}
          console.log('current MFP is ', newMFP)
      return{
        ...state,
       myFixtureProfiles: newMFP
      }

      case types.ADD_FIXTURE_PROFILE:
      console.log('adding fixture', action.payload.id)
      return {
        ...state,
        myFixtureProfiles: {
          ...state.myFixtureProfiles,
          [action.payload.id]: action.payload,
        }
      };
      
      case types.REMOVE_FIXTURE_PROFILE:
        console.log('removing fixture', action.payload.id)
        const newState = { ...state };
        delete newState.myFixtureProfiles[action.payload.id];
        return newState;
      
        case 'UPDATE_CURRENT_COLOR':
          return {
            ...state,
            currentColor: action.payload,
          };
        case 'UPDATE_OUTGOING_UNIVERSE':
          console.log('updating universe in reducer', action.payload)
          
          return {
            ...state,
            outgoingUniverse: action.payload,
          };

    default: {
      return state;
    }
  }
};

export default stageReducer;
