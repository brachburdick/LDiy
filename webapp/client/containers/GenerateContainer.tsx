import React from 'react';
import DefineFixtures from '../components/generatePage/DefineFixtures';
import DefineUniverse from '../components/generatePage/DefineUniverse';
import DefineVibe from '../components/generatePage/DefineVibe';
import Output from '../components/generatePage/Output';

const GeneratePage: React.FC = () => {
    return (
        <div className="flex-container">
            <DefineFixtures />
            <DefineUniverse />
            <DefineVibe />
            <Output />
        </div>
    );
}

export default GeneratePage;
