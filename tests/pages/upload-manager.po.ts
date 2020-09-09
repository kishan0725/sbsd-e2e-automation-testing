import { browser, element, by } from 'protractor';

export class UploadManager {

    getUploadsTable() {
        return element(by.xpath('//tbody[@class="tbody"]'));
    }

    getUploadManagerHeader() {
        return element(by.xpath('//div[@class="page-header-text"]'));
    }

    getRecentDataStatus() {
        return element(by.xpath('//table[@class="table"]/tbody/tr[1]/td[4]'));
    }

    getRecentDataError() {
        return element(by.xpath('//table[@class="table"]/tbody/tr[1]/td[6]'));
    }

    getErrorPopup() {
        return element(by.xpath('//div[@class="popup-wrapper"]'));
    }

    getErrorDetail() {
        return element(by.xpath('//tr/td[3]'));
    }

    getErrorCloseButton() {
        return element(by.xpath('//*[text()=" Close"]'));
    }

    getPagination() {
        return element(by.xpath('//ul[@class="pagination"]'));
    }
}