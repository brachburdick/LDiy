
import * as types from '../actionTypes';

const initialState = {
  
    fixtures: {
      byId: {
        f_001: {
          id: 'f_001',
          name: 'Fixture 1',
          groups: ['group1']
        },
        f_002: {
          id: 'f_002',
          name: 'Fixture 2',
          groups: ['group1']
        },
        f_003: {
          id: 'f_003',
          name: 'Fixture 3',
          groups: ['group1']
        },
      },
      allIds: ['f_001', 'f_002', 'f_003']
    },
    
    groups: {
      byId: {
        'g_001': {
          id: 'g_001',
          name: 'Group A',
          fixtures: ['f_001', 'f_002', 'f_003'],
          projectors: ['projector1']
        },
      },
      allIds: ['group1']
    },
  
    projectors: {
      byId: {
        'p_001': {
          id: 'p_001',
          name: 'Projector 1',
          groups: ['group1']
        },
      },
      allIds: ['projector1']
    }
  
  

};

const stageReducer = (state = initialState, action) => {

 
  //console.log(locationText.getAttribute('placeholder'));
  console.log('REDUCER', action);
  switch (action.type) {
    case types.ADD_FIXTURE:

      return {
        ...state
      };


    case types.ADD_GROUP:
      
      return {
        ...state,
      };



    case types.DELETE_FIXTURE: 
      return {
        ...state
      };

    case types.DELETE_GROUP: 
    return {
      ...state
    };



    case types.ADD_FIXTURE_TO_GROUP:
      return {
        ...state
      };

    case types.CONNECT_PROJECTOR_TO_GROUP:
      return {
        ...state
      };

      

    default: {
      return state;
    }
  }
};

export default marketsReducer;
