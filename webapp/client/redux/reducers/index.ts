
import { combineReducers } from 'redux';
import stageReducer from './stageReducer';


const reducers = combineReducers({
   stage: stageReducer,
});

export default reducers;

