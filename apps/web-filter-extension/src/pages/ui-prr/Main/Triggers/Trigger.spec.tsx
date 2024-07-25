import {cleanup, render, screen} from "@testing-library/react";
import AiTriggers from "../../../../../../src/content/ui/prr/Main/Triggers";
import {PrrLevel} from "../../../../../../src/commons/types/PrrLevel";
import {HttpUtils} from "../../../../../../src/commons/utils/HttpUtils";

const callback = jest.fn(() =>{

});
describe('Triggers Screen', () => {

    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        cleanup();
    });

    test('Should return Inform component with AI', () => {
        jest.spyOn(HttpUtils,"getParameterValue").mockImplementation((name: string, queryString?: string)=> {
            if(name === 'ai'){
                return "true";
            } else if(name === 'status'){
                return "ask";
            }
            return null;
        });
        const aiTrigger = AiTriggers({level:PrrLevel.ONE, onTellMeMoreEvent:callback});
        render(aiTrigger);
        const span1 =document.getElementsByClassName("inform-section")
        expect(span1).toBeTruthy();
    });

    test('Should return Inform component', () => {
        jest.spyOn(HttpUtils,"getParameterValue").mockImplementation((name: string, queryString?: string)=> {
            if(name === 'ai'){
                return "false";
            } else if(name === 'status'){
                return "inform";
            }
            return null;
        });
        const aiTrigger = AiTriggers({level:PrrLevel.ONE, onTellMeMoreEvent:callback});
        render(aiTrigger);
        const span1 =document.getElementsByClassName("inform-section")
        expect(span1).toBeTruthy();

    });

    test('Should return Ask component', () => {
        jest.spyOn(HttpUtils,"getParameterValue").mockImplementation((name: string, queryString?: string)=> {
            if(name === 'ai'){
                return "false";
            } else if(name === 'status'){
                return "ask";
            }
            return null;
        });
        const aiTrigger = AiTriggers({level:PrrLevel.ONE, onTellMeMoreEvent:callback});
        render(aiTrigger);
        const span1 =document.getElementsByClassName("ask-section")
        expect(span1).toBeTruthy();

    });

    test('Should return Block component', () => {
        jest.spyOn(HttpUtils,"getParameterValue").mockImplementation((name: string, queryString?: string)=> {
            if(name === 'ai'){
                return "false";
            } else if(name === 'status'){
                return "block";
            }
            return null;
        });

        const aiTrigger = AiTriggers({level:PrrLevel.ONE, onTellMeMoreEvent:callback});
        render(aiTrigger);

        const blockHTML = document.body.innerHTML;
        expect(blockHTML).toEqual('<div>BLOCKED</div>');
    });

    test('Should return Default component', () => {
        jest.spyOn(HttpUtils,"getParameterValue").mockImplementation((name: string, queryString?: string)=> {
            if(name === 'ai'){
                return "false";
            } else if(name === 'status'){
                return "default";
            }
            return null;
        });
        const aiTrigger = AiTriggers({level:PrrLevel.ONE, onTellMeMoreEvent:callback});
        render(aiTrigger);

        const defaultHTML = document.body.innerHTML;
        expect(defaultHTML).toEqual('<div>DEFAULT</div>');
    });
});

