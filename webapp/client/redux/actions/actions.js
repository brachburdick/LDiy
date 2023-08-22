import * as types from './actions/actionTypes';

export const addQuidToCollectionAC = marketId => ({
  type: types.ADD_QUID_TO_COLLECTION,
  payload: marketId,
});

export const removeQuidFromCollectionAC = marketId => ({
  type: types.REMOVE_QUID_FROM_COLLECTION,
  payload: marketId,
});

export const RelateQuidAC = marketId => ({
  type: types.RELATE_QUID,
  payload: marketId,
});

export const DisownQuidAC = location => ({
  type: types.DISOWN_QUID,
  payload:location
});

export const selectThingAC = thing => ({
  type: types.SELECT_THING,
  payload: thing,
});
export const moveAC = quid =>({
  type: types.MOVE,
  payload: quid
})
