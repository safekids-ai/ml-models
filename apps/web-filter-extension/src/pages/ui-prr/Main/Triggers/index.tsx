import React from 'react';
import { PrrStatus } from '../../../../shared/types/PrrStatus';

import {PrrLevel} from "../../../../shared/types/PrrLevel";
import { HttpUtils } from '../../../../shared/utils/HttpUtils';

import AskScreen from './Ask';
import InformScreen from './Inform';
import InformAIScreen from './InformAI';


type Props = {
    level: PrrLevel;
    onTellMeMoreEvent: () => void;
};

const AiTriggers = ({ level, onTellMeMoreEvent }: Props) => {
    const status = HttpUtils.getParameterValue('status') as PrrStatus; // inform/ask/block
    const ai = HttpUtils.getParameterValue('ai');
    const getAiTriggeredScreen = () => {
        if (ai === 'true') {
            return <InformAIScreen level={level} onTellMeMoreEvent={onTellMeMoreEvent} />;
        }
        switch (status) {
            case 'ask':
                return <AskScreen level={level} onTellMeMoreEvent={onTellMeMoreEvent} />;
            case 'inform':
                return <InformScreen level={level} onTellMeMoreEvent={onTellMeMoreEvent} />;
            case 'block':
                return <>BLOCKED</>;
            default:
                return <>DEFAULT</>;
        }
    };
    return <>{getAiTriggeredScreen()}</>;
};

export default AiTriggers;
