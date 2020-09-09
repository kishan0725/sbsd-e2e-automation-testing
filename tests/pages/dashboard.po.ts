import { browser, element, by } from 'protractor';

export class Dashboard {
    
    getDataManagementTab() {
        // return element(by.partialLinkText('Data Management'));
        return element(by.xpath('//div[text()="Data Management"]'));
    }

    getPageLoader() {
        return element(by.xpath('//div[@class="sk-cube1 sk-cube"]'));
    }
}