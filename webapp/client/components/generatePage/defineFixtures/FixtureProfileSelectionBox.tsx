import React,{ useState, useEffect } from 'react';
import {stateStoreType} from '../../../redux/reducers/index';
import { useSelector, useDispatch } from 'react-redux';
import { addFixtureProfileAC, removeFixtureProfileAC, updateFixtureProfilesAC} from '../../../redux/actions/actions';

interface Props {
    index: number;
    // ... more props as needed, for instance dropdown options, checkbox state, etc.
}

const FixtureProfileSelectionBox: React.FC<Props> = ({ index }) => {
    let allFixtures = useSelector((state:stateStoreType) => state.stage.allFixtureProfiles)
    let allFixtureNames = Object.keys(allFixtures)
    // const [model, setModel] = useState(''); // Default value for model dropdown
    // const [channelModes, setChannelModes] = useState([]); // Options for channel mode dropdown
    // const [numChannels, setNumChannels] = useState(1); // Options for channel mode dropdown
    let defaultProfile = {
                            id: index,
                            name:"",
                            numChannels: 1,
                            r: "",
                            g: "",
                            b: "",
                            dimmer: "",
                            misc:"",
                            frontLight: false,
                            homeAddys: []
                        }

    const [profile, setProfile] = useState(defaultProfile);
    const dispatch = useDispatch();
    const allFixtureProfiles = useSelector((state:stateStoreType) => state.stage.allFixtureProfiles);
    
  

    const handleModelChange = (e) => {
        console.log('handle model change', e)
        const selectedModel = e.target.value;

        // Remove the previously selected profile
        // if (model !== '-' && allFixtureProfiles[model]) {
        //   dispatch(removeFixtureProfileAC({ id: model }));
        // }
        
        // // Add the newly selected profile
        // if (selectedModel !== '-' && allFixtureProfiles[selectedModel]) {
        //   dispatch(addFixtureProfileAC({ id: selectedModel, ...allFixtureProfiles[selectedModel] }));
        // }


        
        // setModel(selectedModel);
      };

  function updateProfile(e){
    const {name,value} = e.target;
    setProfile((profile)=>({
        ...profile,
        [name]:value,
    }));

  };

  function updateProfileFL(e){
    const {name,checked} = e.target;
    setProfile((profile)=>({
        ...profile,
        [name]:checked,
    }));

  };

 useEffect(() => {
//     if (model !== '-' /*&& allFixtures[model]*/) {
//       setNumChannels(allFixtures[model]); // Update channelModes based on selected model
//     } else {
//       setNumChannels(1); // Reset to empty array for "-" option
//     }
    if(profile.name){
        console.log('profile has changed');
    }
    dispatch(updateFixtureProfilesAC(profile))
   }, [profile]);


  function handleUpdate(e) {
    console.log('handleUpdate')

  }
  function handleDelete(e) {
    console.log('handleDelete')

  }

   const modelOptions = [ <option key="default" value="">
    - 
    </option>,
 ...Object.keys(allFixtures).map((f) => (
   <option key={f} value={f}>
     {f}
   </option>))]




    return (
        <div className="fixture-profile-box">
            <span className="fixture-bullet">{index + 1}</span>

            {/* <select className="model-dropdown">
                {modelOptions}
            </select>
             */}

            
                {/* <select value={model} onChange={(e) => handleModelChange(e)}>
                    <option value="-">-</option>
                    {Object.keys(allFixtures).map(profile => (
                    <option key={profile} value={profile}>{profile}</option>
                    ))}
                </select>
                <select>
                    {channelModes.length === 0 
                    ? <option>-</option> 
                    : channelModes.map((mode, index) => (
                        <option key={index} value={mode}>{mode}</option>
                    ))}
                </select> */}


        <div className = "input-group">
            <label>
                <span>Name:</span>
                <input name = "name" type="text" placeholder="Your Fixture Name" value={profile.name} onChange={updateProfile} />
            </label>
        </div>
        <div className = "input-group">
            <label>
                <span>Number of Channels:</span>
                <input name = "numChannels" type="number" placeholder="# of Channels" value={profile.numChannels} onChange={updateProfile} />
            </label>
        </div>
        <div className = "input-group">
            <label>
                <span>Red Channel:</span>
                <input name = "r" type="number" placeholder="R channel" value = {profile.r} onChange={updateProfile}/>
            </label>
        </div>
        <div className = "input-group">
            <label>
                <span>Green Channel:</span>
                <input name = "g" type="text" placeholder="G channel" value = {profile.g} onChange={updateProfile}/>
            </label>
        </div>
        <div className = "input-group">
            <label>
                <span>Blue Channel:</span>
                <input name = "b" type="number" placeholder="B Channel" value = {profile.b} onChange={updateProfile}/>
            </label>
        </div>
        <div className = "input-group">
            <label>
                <span>Master Dimmer Channel:</span>
                <input name = "dimmer" type="text" placeholder="Dimmer Channel" value = {profile.dimmer} onChange={updateProfile}/>
            </label>
        </div>
        <div className = "input-group">
            <label>
                <span>Misc:</span>
                <input name = "misc" type="text" placeholder="Misc Channel" value = {profile.misc} onChange={updateProfile}/>
            </label>
        </div>
        {/* <label>
                <input type= "checkbox" className="grouping-checkbox" checked = {profile.frontLight} onChange={updateProfileFL}/> Frontlight
        </label> */}
        <button onClick={handleDelete}>Delete</button>

        

        </div>
    );
};

export default FixtureProfileSelectionBox;
