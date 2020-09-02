import { browser, element, by } from 'protractor';

export class LoginPage {

    getUrl() {
        browser.driver.manage().window().maximize();
        return browser.get('https://sbsd-dashboard-ui-qa.sbsd-va.net/report/dashboard');
    }

    getPageTitle() {
        return browser.getTitle();
    }

    getLoginButton() {
        return element(by.cssContainingText('.btn-primary', 'Login'));
    }

    getEmail() {
        return element(by.xpath('//input[@type="email"]'))
    }

    getPassword() {
        return element(by.xpath('//input[@type="password"]'))
    }

    getSubmitButton() {
        return element(by.xpath('//button[@type="submit"]'))
    }

    getErrorMessage() {
        return element(by.xpath('//div[@class="auth0-global-message auth0-global-message-error"]'))
    }

    getUserProfile() {
        return element(by.css('.user-profile'));
    }

}