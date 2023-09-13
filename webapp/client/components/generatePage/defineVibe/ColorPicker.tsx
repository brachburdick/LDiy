import React from 'react';
import { ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrentColorAC, updateOutgoingUniverseAC } from '../../../redux/actions/actions'; // Adjust the path to your actions
import {stateStoreType} from '../../../redux/reducers/index'

const ColorPicker = () => {
  const dispatch = useDispatch();
  const stageState = useSelector((state:stateStoreType) => state.stage);
  const currentColor = stageState.currentColor;
  let currentUniverse = JSON.parse(JSON.stringify(stageState.outgoingUniverse))
  const handleChangeComplete = (color) => {
    const { r, g, b, a } = color.rgb;
    console.log(r,g,b,a)
    dispatch(updateCurrentColorAC({ r, g, b, a }));

    // Assuming outgoingUniverse is an array of objects with r, g, b, a properties
    //create an updated universe
    //look through universe, check each identifier
    //if a match with r g b or a/dimmer, update this value
    for(let ch in currentUniverse){
        let thisIdent = currentUniverse[ch].identifier;
        switch(thisIdent){
            case 'r':
                currentUniverse[ch].value = r;
                break
            case 'g':
                currentUniverse[ch].value = g;
                break
            case 'b':
                currentUniverse[ch].value = b;
                break
            case 'dimmer':
                currentUniverse[ch].value = Math.floor(a*255);

                break
            default:


        }
    }
    

    
    dispatch(updateOutgoingUniverseAC(currentUniverse));
  };

  return <ChromePicker className = "widget" color={currentColor} onChangeComplete={handleChangeComplete} />;
};

export default ColorPicker;
