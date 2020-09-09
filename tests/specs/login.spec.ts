import { LoginPage } from '../pages/login.po';
import { browser, ExpectedConditions } from 'protractor';
import { LoginCredentials } from '../../.env/login.env';

let login: LoginPage;

export const loginFunction = async function (email: string, password: string) {
    login.getUrl(); 
    await login.getLoginButton().click();
    await login.getEmail().sendKeys(email);
    await login.getPassword().sendKeys(password);
    await login.getSubmitButton().click();
}

describe('Login into the application', async() => {

    var originalTimeout: number;

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        login = new LoginPage();
    });

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('Should display error message for incorrect email ID', async() => {

        await loginFunction('test@gmail.com',LoginCredentials.password);
        // waits for the error message to be displayed
        browser.wait(ExpectedConditions.textToBePresentInElement(login.getErrorMessage(), "WRONG EMAIL OR PASSWORD."), 10000);
        expect(await login.getErrorMessage().isDisplayed()).toBe(true);
        expect(await login.getErrorMessage().getText()).toEqual("WRONG EMAIL OR PASSWORD.");

    });

    it('Should display error message for incorrect password', async() => {

        await loginFunction(LoginCredentials.email,'test123');
        // waits for the error message to be displayed
        browser.wait(ExpectedConditions.textToBePresentInElement(login.getErrorMessage(), "WRONG EMAIL OR PASSWORD."), 10000);
        expect(await login.getErrorMessage().isDisplayed()).toBe(true);
        expect(await login.getErrorMessage().getText()).toEqual("WRONG EMAIL OR PASSWORD.");

    });

    it('Should be logged in successfully', async() => {

        await loginFunction(LoginCredentials.email,LoginCredentials.password);
        // waits for the user profile element to be displayed
        browser.wait(ExpectedConditions.presenceOf(login.getUserProfile()), 10000);
        expect(await login.getUserProfile().isDisplayed()).toBe(true);

    });
});