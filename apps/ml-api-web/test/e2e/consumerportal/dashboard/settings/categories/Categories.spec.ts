import { Page } from 'puppeteer';
import { Util } from '../../../../common/Util';
import { Urls } from '../../../../common/Urls';
import { SignInData } from '../../../../data/SignInData';
import { SignInXPaths } from '../../../signin/SignInXPaths';
import { ConsumerPortalXPaths } from '../../../ConsumerPortalXPaths';
import {CategoriesXPaths} from "./CategoriesXPaths";
import {CategoriesData} from "../../../../data/CategoriesData";

let util = new Util();
let signInData = new SignInData();
let categoriesData = new CategoriesData();
let page: Page;

describe('Consumer Portal => Sign In Page', () => {
    beforeEach(async () => {
        page = await util.pageViewPort();
    });

    describe('Categories Flow --> Check UI', () => {
        it(`Check the Kids, categories, radio buttons present %s`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
            await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
            await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
            expect(await util.isComponentVisible(page, ConsumerPortalXPaths.SETTINGS_BUTTON)).toBeTruthy();
            await util.clickOn(page, ConsumerPortalXPaths.SETTINGS_BUTTON);
            expect(await util.isComponentVisible(page, CategoriesXPaths.CATEGORIES_HEADING)).toBeTruthy();
            expect(await util.isComponentVisible(page, CategoriesXPaths.CHOOSE_FAMILY_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, CategoriesXPaths.SELECTED_KID_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, CategoriesXPaths.TABLE_HEADER(categoriesData.headerAlways,categoriesData.headerAllow))).toBeTruthy();
            expect(await util.isComponentVisible(page, CategoriesXPaths.TABLE_HEADER(categoriesData.headerAllow2,categoriesData.headerButInform))).toBeTruthy();
            expect(await util.isComponentVisible(page, CategoriesXPaths.TABLE_HEADER(categoriesData.headerAskFor,categoriesData.headerAccess))).toBeTruthy();
            expect(await util.isComponentVisible(page, CategoriesXPaths.TABLE_HEADER(categoriesData.headerNever,categoriesData.headerAllow))).toBeTruthy();
            for(let i=0; i< categoriesData.categoriesPresent.length;i++){
                expect(await util.isComponentVisible(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],'1'))).toBeTruthy();
                expect(await util.isComponentVisible(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],'2'))).toBeTruthy();
                expect(await util.isComponentVisible(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],'3'))).toBeTruthy();
                expect(await util.isComponentVisible(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],'4'))).toBeTruthy();
            }
             expect(await util.isComponentVisible(page, CategoriesXPaths.SAVE_DISABLED)).toBeTruthy();
        });
    });
});

describe('Categories Flow --> Check atleast one checkbox is checked ', () => {
    it(`Check on each category, atleast one checkbox is checked %s`, async () => {
        let checkedArray: boolean[] = [];
        for(let i=0; i< categoriesData.categoriesPresent.length;i++){
            for (let j=1; j<=4;j++){
                checkedArray[j-1] = await util.isChecked(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],`${j}`))
            }
            let flag = checkedArray.includes(true);
            expect(flag).toEqual(true);
            checkedArray = [];
        }
    });
});

describe('Categories Flow --> Select Other Kid ', () => {
    it(`Select Other Kid and check kid selected %s`, async () => {
        await util.clickOn(page, CategoriesXPaths.SELECTED_KID_INPUT);
        expect(await util.isComponentVisible(page, CategoriesXPaths.SELECT_KID(categoriesData.kids[1]))).toBeTruthy();
        await page.waitForTimeout(1000);
        await util.clickOn(page, CategoriesXPaths.SELECT_KID(categoriesData.kids[1]));
        await page.waitForTimeout(1000);
        expect(await util.isComponentVisible(page, CategoriesXPaths.KID_VISIBLE_INPUT(categoriesData.kids[1]))).toBeTruthy();
    });
});

describe('Categories Flow --> Change the settings ', () => {
    it(`Check Save button enabled if settings changed %s`, async () => {
        let checkedArray: boolean[] = [];
        let trueIndex: number;
        for(let i=0; i< categoriesData.categoriesPresent.length;i++){
            for (let j=1; j<=Math.floor(Math.random() * (4 - 1 + 1)) + 1;j++){
                checkedArray[j-1] = await util.isChecked(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],`${j}`))
            }
            trueIndex = checkedArray.indexOf(true);
            if(trueIndex===3){
                await util.clickOn(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],`${trueIndex}`));
            }else if (trueIndex === 0){
                trueIndex = trueIndex + 2;
                await util.clickOn(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],`${trueIndex}`));
            }else{
                trueIndex = trueIndex + 1;
                await util.clickOn(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],`${trueIndex+1}`));
            }
            checkedArray = [];
        }
        expect(await util.isComponentVisible(page, CategoriesXPaths.SAVE_ENABLED)).toBeTruthy();
        await util.clickOn(page, CategoriesXPaths.SAVE_ENABLED);
        expect(await util.isComponentVisible(page, CategoriesXPaths.CATEGORIES_STATUS_UPDATED_SUCCESSFULLY)).toBeTruthy();

    });
});


describe('Categories Flow --> On reloading, configuration remains same ', () => {
    it(`Reloading shouldn't change configuration %s`, async () => {
        let checkedArray: number[] = [];
        let flag: boolean;
        let validatedArray: number[] = [];
        for(let i=0; i< categoriesData.categoriesPresent.length;i++){
            for(let j=1; j<=4;j++){
                flag = await util.isChecked(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],`${j}`))
                if (flag===true){
                    checkedArray[i] = j;
                    break;
                }
            }
        }
        await page.reload();
        await page.waitForTimeout(5000);
        await util.clickOn(page, CategoriesXPaths.SELECTED_KID_INPUT);
        expect(await util.isComponentVisible(page, CategoriesXPaths.SELECT_KID(categoriesData.kids[1]))).toBeTruthy();
        await page.waitForTimeout(1000);
        await util.clickOn(page, CategoriesXPaths.SELECT_KID(categoriesData.kids[1]));
        await page.waitForTimeout(1000);
        expect(await util.isComponentVisible(page, CategoriesXPaths.KID_VISIBLE_INPUT(categoriesData.kids[1]))).toBeTruthy();
        for(let i=0; i< categoriesData.categoriesPresent.length;i++){
            for(let j=1; j<=4;j++){
                flag = await util.isChecked(page, CategoriesXPaths.CATEGORY_RADIO_BUTTON(categoriesData.categoriesPresent[i],`${j}`))
                if (flag===true){
                    validatedArray[i] = j;
                    break;
                }
            }
        }
        expect(checkedArray).toEqual(validatedArray);
    });
});

describe('Categories Flow --> Logout from account ', () => {
    it(`Logout from dashboard %s`, async () => {
        await util.clickOn(page, ConsumerPortalXPaths.LOGOUT_BUTTON);
        await page.close();
    });
});