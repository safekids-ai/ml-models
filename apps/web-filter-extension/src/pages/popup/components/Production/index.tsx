import 'antd/lib/select/style/index.css';
import 'antd/lib/slider/style/index.css';

import { Input } from 'antd';
import Select from 'antd/lib/select';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    setCategoryPRRThreshold,
    setImagesAnalyzeLimit, setInformEventTimeoutLimit,
    setInformEventVisitsLimit,
    setNLPAnalyzeLimit,
    setPrr1Limit,
    setPrr2Threshold
} from '../../redux/actions/settings';
import { RootState } from '../../redux/reducers';
import { SettingsState } from '../../redux/reducers/settings';
import { PRRThreshold } from '../../redux/store';

import { Container, DropdownRow } from './styles';
import {ChromeCommonUtils} from "../../../../shared/chrome/utils/ChromeCommonUtils";
import {EventType} from "../../../../shared/types/message_types";

const { Option } = Select;

export const Production: React.FC = () => {
    const logger = ChromeCommonUtils.getLogger();
    const defaultLanguage = { name: 'English', id: 'en', direction: 'ltr' };
    const { imageAnalyzeLimit, nlpAnalyzeLimit, prrThresholds, prrCategoryThreshold, prr1Limit, prr2Threshold,informEventVisitsLimit,informEventTimeoutLimit } = useSelector<RootState>(
        (state) => state.settings,
    ) as SettingsState;

    const dispatch = useDispatch();
    const [category, setCategory] = useState(prrCategoryThreshold.category);
    const [minML, setMinMl] = useState(prrCategoryThreshold.mlMin);
    const [minNLP, setMinNLP] = useState(prrCategoryThreshold.nlpMin);
    const [maxML, setMaxML] = useState(prrCategoryThreshold.mlMax);
    const [maxNLP, setMaxNLP] = useState(prrCategoryThreshold.nlpMax);

    const [prr1LimitValue] = useState(prr1Limit);
    const [prr2ThresholdValue] = useState(prr2Threshold);

    const [informEventVisitsLimitVal] = useState(informEventVisitsLimit);

    const [informEventTimeoutLimitVal] = useState(informEventTimeoutLimit);

    useEffect(() => {
        async function loadLanguage() {
            setLanguage(defaultLanguage);

            let value = await ChromeCommonUtils.readLocalStorage('language').catch((e)=>{logger.warn(`Failed to read language. ${e}`);});
            if(value){
                setLanguage(value);
            }

        }
        void loadLanguage();
    }, []);

    const [language, setLanguage] = useState(defaultLanguage);

    const updateLanguage = (lan: string) => {
        let language = defaultLanguage;
        if (lan === 'ar') {
            language = { name: 'Arabic', id: 'ar', direction: 'rtl' };
        }
        setLanguage(language);
        chrome.storage.local.set({ language }, function () {});
    };

    const handleChange = (e: any) => {
        const threshold = { category, mlMin: minML, nlpMin: minNLP, mlMax: maxML, nlpMax: maxNLP };
        dispatch(setCategoryPRRThreshold(threshold));
    };
    const updateCategory = (value: string) => {
        setCategory(value);
        const prrThreshold: PRRThreshold = prrThresholds[value.toUpperCase()];
        if (prrThreshold) {
            setMinNLP(prrThreshold.nlpMin);
            setMaxNLP(prrThreshold.nlpMax);
            setMinMl(prrThreshold.mlMin);
            setMaxML(prrThreshold.mlMax);
        }
    };
    const configureInformTest = () : void => {
        dispatch(setInformEventTimeoutLimit(0.25));
        dispatch(setInformEventVisitsLimit(7));
    }

    return (
        <Container>
            <DropdownRow>
                <span>Language</span>
                <Select  id={"languageField"} value={language?.id ? language.id : 'en'} onChange={(value) => updateLanguage(value)}>
                    <Option value="en">English</Option>
                    <Option value="ar">Arabic</Option>
                </Select>
            </DropdownRow>
            How many elements to process (At Max):
            <DropdownRow>
                <span>Images</span>
                <Select id={"imageAnalyzeId"} defaultValue={imageAnalyzeLimit} style={{ width: 70 }} onChange={(value) => dispatch(setImagesAnalyzeLimit(value))}>
                    <Option value="3">3</Option>
                    <Option value="5">5</Option>
                    <Option value="7">7</Option>
                    <Option value="10">10</Option>
                    <Option value="20">20</Option>
                    <Option value="50">50</Option>
                    <Option value="100">100</Option>
                </Select>
            </DropdownRow>
            <DropdownRow>
                <span>Text </span>
                <Select id={"nlpAnalyzeId"} style={{ width: 70 }} defaultValue={nlpAnalyzeLimit} onChange={(value) => dispatch(setNLPAnalyzeLimit(value))}>
                    <Option value="1">1</Option>
                    <Option value="3">3</Option>
                    <Option value="5">5</Option>
                    <Option value="7">7</Option>
                    <Option value="10">10</Option>
                    <Option value="20">25</Option>
                    <Option value="50">50</Option>
                    <Option value="100">100</Option>
                </Select>
            </DropdownRow>
            <span>PR Threshold </span>
            <DropdownRow>
                <span>Category</span>
                <Select
                    defaultValue={category}
                    id={"updateCategoryField"}
                    style={{ width: 150 }}
                    onChange={(value) => {
                        updateCategory(value);
                    }}
                >
                    <Option value="Porn">Porn</Option>
                    <Option value="Weapons">Weapons</Option>
                    <Option value="Self_Harm">Self-Harm</Option>
                    <Option value="Violence">Violence</Option>
                </Select>
            </DropdownRow>
            <span>Image</span>
            Min:
            <Input data-testid={"minMLField"} value={minML} type="text" style={{ width: '50px' }} onChange={(event) => setMinMl(event.target.value as unknown as number)} />
            Max:
            <Input data-testid={"maxMLField"} value={maxML} type="text" style={{ width: '50px' }} onChange={(event) => setMaxML(event.target.value as unknown as number)} />
            <span>NLP</span>
            Min:{' '}
            <Input data-testid={"minNLPField"} value={minNLP} type="text" style={{ width: '50px' }} onChange={(event) => setMinNLP(event.target.value as unknown as number)} />
            Max:{' '}
            <Input data-testid={"maxNLPField"} value={maxNLP} type="text" style={{ width: '50px' }} onChange={(event) => setMaxNLP(event.target.value as unknown as number)} />
            <br />
            <div>
                <button data-testid={"saveButton"}  value="Save" onClick={(event) => handleChange(event)}>
                    Save
                </button>{' '}
            </div>
            <span>PRR Settings </span>
            <DropdownRow>
                <span>PRR 1 Limit</span>
                <Select id={"prr1LimitField"} defaultValue={prr1LimitValue} style={{ width: 150 }} onChange={(value) => dispatch(setPrr1Limit(value))}>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                </Select>
            </DropdownRow>
            <DropdownRow>
                <span>PRR 2 Threshold (min)</span>
                <Select id={"prr2ThresholdField"} defaultValue={prr2ThresholdValue} style={{ width: 150 }} onChange={(value) => dispatch(setPrr2Threshold(value))}>
                    <Option value="2">2</Option>
                    <Option value="5">5</Option>
                    <Option value="10">10</Option>
                    <Option value="30">30</Option>
                    <Option value="60">60</Option>
                    <Option value="120">120</Option>
                </Select>
            </DropdownRow>
            Inform Category Prr
            <DropdownRow>
                <span>Visit Limit</span>
                <Select id={"informEventVisitsLimit"} defaultValue={informEventVisitsLimitVal} style={{ width: 150 }} onChange={(value) => dispatch(setInformEventVisitsLimit(value))}>
                    <Option title="visitLimit" value="5">5</Option>
                    <Option value="10">10</Option>
                    <Option value="35">35</Option>
                    <Option value="50">50</Option>
                </Select>
            </DropdownRow>
            <DropdownRow>
                <span>Timeout Limit</span>
                <Select id={"informEventTimeoutLimit"} defaultValue={informEventTimeoutLimitVal} style={{ width: 150 }} onChange={(value) => dispatch(setInformEventTimeoutLimit(value))}>
                    <Option title="visitTimeout" value="0.25">0.25</Option>
                    <Option value="1">1</Option>
                    <Option value="5">5</Option>
                    <Option value="10">10</Option>
                    <Option value="50">50</Option>
                </Select>
            </DropdownRow>
            <div>
                <button value="Delete Extension" onClick={() => configureInformTest()}>
                    Configure Inform Test
                </button>{' '}
            </div>
        </Container>
    );
};
