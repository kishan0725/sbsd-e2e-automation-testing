import { browser, element, by } from 'protractor';

export class DataManagementPage {

    getTableBody() {
        return element(by.xpath('//tbody[@class="tbody"]'));
    }

    getCustomRangeButton() {
        return element(by.xpath('//button[text()="Custom range"]'));
    }
    
    getAugust25thDate() {
        return element(by.xpath('(//table/tbody/tr[5]/td[3])[2]'));
    }

    getDateApplyButton() {
        return element(by.xpath('//button[@class="btn"]'));
    }

    getDateRangePicker() {
        return element(by.xpath('//input[contains(@class,"input date-range-picker")]'));
    }

    getSubmitDropdown() {
        return element(by.cssContainingText('.widget-text','I want to submit'));
    }

    getSelfReportingTransactions() {
        return element(by.cssContainingText('.item-name','Self reporting transactions'));
    }
        
    getSpreadSheetUpload() {
        return element(by.cssContainingText('.item-name','Spreadsheet Upload'));
    }

    getUploadTransactionPopup() {
        return element(by.css('.popup-wrapper'));
    }

    getDownloadButton() {
        return element(by.cssContainingText('#save_image_titlebar_logo_live','Download'));
    }

    getChooseFileButton() {
        return element(by.xpath("//input[@type='file']"));
    }

    getUploadButton() {
        return element(by.xpath('//button[@class="btn btn-primary btn-blue"]'));
    }

    getUploadErrorMessage() {
        return element(by.xpath('//*[text()="Vendor Tax ID should contain only number [0-9] on Row No "]'));
    }

    getUploadErrorRow() {
        return element.all(by.xpath('(//*[text()="2"])[1]'));
    }

    getUploadManagerIcon() {
        return element(by.xpath('//a[@href="/management/upload"]'));
    }

    getNotificationBar() {
        return element.all(by.xpath('//div[@class="simple-notification-wrapper top right"]')).first();
    }

    getRecentVendorTaxID() {
        return element(by.xpath('//table[@class="table"]/tbody/tr[1]/td[5]'));
    }

    getRecentEditIcon() {
        return element.all(by.xpath('//a[@title="Edit"]')).first();
    }

    getEditContractID() {
        return element(by.xpath('//input[@formcontrolname="contractId"]'));
    }

    getEditVendorTaxID() {
        return element(by.xpath('//input[@formcontrolname="vendorId"]'));
    }

    getEditVendorName() {
        return element(by.xpath('//input[@formcontrolname="vendorName"]'));
    }

    getEditAmount() {
        return element(by.xpath('//input[@formcontrolname="amount"]'));
    }

    getEditTransactionDate() {
        return element(by.xpath('//input[@aria-label="Date input field"]'));
    }

    getEditNotes() {
        return element(by.xpath('//textarea[@formcontrolname="notes"]'));
    }

    getEditCancelButton() {
        return element(by.xpath('//*[text()=" Cancel"]'));
    }
}