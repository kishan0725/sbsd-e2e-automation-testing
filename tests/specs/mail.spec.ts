import { MailPage } from '../pages/mail.po';
import { browser, by, element } from 'protractor';

describe('Mail accept', () => {
    let page: MailPage;

    beforeEach(() => {
        page = new MailPage();
    });

    it('to check the page title', function () {
        browser.ignoreSynchronization = true;
        page.navigateTo();
        browser.driver.getTitle().then(function (pageTitle) {
            expect(pageTitle).toEqual('Mailosaur');
        });
    });

    it('should allow me to login', () => {
        element(by.xpath('//*[@id="TextInputField-0"]')).sendKeys('swethaa.rathakrishnan@coda.global');
        element(by.xpath('//*[@id="TextInputField-1"]')).sendKeys('Qwerty!2345');
        element(by.xpath('//*[@id="root"]/div/div[3]/div/form/div[3]/button')).click();
        return browser.driver.wait(function () {
            return browser.driver.getCurrentUrl().then(function (url) {
                return /index/.test(url);
            });
        }, 10000);
    });
});



