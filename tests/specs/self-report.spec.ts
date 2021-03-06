import { UploadManager } from './../pages/upload-manager.po';
import { Dashboard } from './../pages/dashboard.po';
import { DataManagementPage } from './../pages/data-management.po';
import { LoginPage } from '../pages/login.po';
import { browser, ExpectedConditions, element, by } from 'protractor';
import { LoginCredentials } from '../../.env/login.env';
import XLSX from 'xlsx';


let login: LoginPage;
let dashboard: Dashboard;
let dataManagement: DataManagementPage;
let uploadManager: UploadManager;

// the path where the template file gets downloaded which inturn needs to be modified and uploaded to the application
var filePath = 'C:/Users/User/Downloads/SelfReportingTemplate.xls';

// login into the application with the valid email and password
const loginFunction = async (email: string, password: string) => {
    login.getUrl(); 
    await login.getLoginButton().click();
    await login.getEmail().sendKeys(email);
    await login.getPassword().sendKeys(password);
    await login.getSubmitButton().click();
}


// selecting date from the date picker
const selectDateRangePicker = async() => {
    dataManagement.getDateRangePicker().clear(); // clearing the pre-filled/default date 
    dataManagement.getDateRangePicker().click(); // clicking on the element to get the date selection options
    dataManagement.getCustomRangeButton().click();
    dataManagement.getAugust25thDate().click(); // this is what we have given each time while uploading the self reporting template
    dataManagement.getDateApplyButton().click();
    waitUntilLoadingStarts();
    waitUntilLoadingStops();
}

// waits for the loader to be visible
const waitUntilLoadingStarts = () => {
    browser.wait(ExpectedConditions.presenceOf(dashboard.getPageLoader()), 30000);
}

// waits for the loader to be invisible
const waitUntilLoadingStops = () => {
    browser.wait(ExpectedConditions.invisibilityOf(dashboard.getPageLoader()), 30000);
}

// writing single data to the specified cell in a given worksheet
const writeDataToCell = (worksheet:any, data:any, cell:string) => {
    XLSX.utils.sheet_add_aoa(worksheet, [[data]], {origin: cell});
}

// writing all the necessary date in the excel sheet
const writeToExcel = (filePath: string, AgencyCode: number, VendorTaxID: string, VendorName: string, TransactionDate: string, ContractID: string, Amount: number, Notes: string) => {
    var workbook = XLSX.readFile(filePath);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    writeDataToCell(worksheet, AgencyCode, 'A2');
    writeDataToCell(worksheet, VendorTaxID, 'B2');
    writeDataToCell(worksheet, VendorName, 'C2');
    writeDataToCell(worksheet, TransactionDate, 'D2');
    writeDataToCell(worksheet, ContractID, 'E2');
    writeDataToCell(worksheet, Amount, 'F2');
    writeDataToCell(worksheet, Notes, 'G2');
    XLSX.writeFile(workbook, filePath);
}

// uploading the Self Reporting excel file to the application
const testUploadStatus = async(filePath: string, AgenyCode: number, VendorTaxID: string, VendorName: string, TransactionDate: string, ContractID: string, Amount: number, Notes: string, Status: string) => {
    writeToExcel(filePath, AgenyCode, VendorTaxID, VendorName, TransactionDate, ContractID, Amount, Notes);
        dataManagement.getChooseFileButton().sendKeys(filePath);
        dataManagement.getUploadButton().click();
        waitUntilLoadingStarts();
        waitUntilLoadingStops();
        // waits for the processing bar, incase of valid data, or error bar, incase of invalid data
        browser.wait(ExpectedConditions.invisibilityOf(dataManagement.getNotificationBar()),10000);
        // go to the upload manager page
        dataManagement.getUploadManagerIcon().click();
        waitUntilLoadingStarts();
        waitUntilLoadingStops();
        // expecting the expected result (success for valid data, failed for invalid data)
        expect(await uploadManager.getRecentDataStatus().getText()).toEqual(Status);
        // For a successful transaction, verifying all the data in the excel sheet that matches with the pre-populated data in the Transaction table. 
        if(Status == 'success') {
            // go to the Data Management tab which has the Transaction table
            dashboard.getDataManagementTab().click();
            waitUntilLoadingStarts();
            waitUntilLoadingStops();
            selectDateRangePicker();
            // checking for the zeroes to be appended at the front of the VendorTaxID, if the length is less than the actual, which is 9
            if(VendorTaxID.length < 9) {
                expect(await dataManagement.getRecentVendorTaxID().getText()).toBe('001256789');
            }
            else {
                // waiting for the edit icon to be visible
                browser.wait(ExpectedConditions.elementToBeClickable(dataManagement.getRecentEditIcon()),15000);
                // clicking on the edit icon so that we can get all the transaction data and compares with the data in the Self Reporting file
                dataManagement.getRecentEditIcon().click();
                // getting values for all the fields
                dataManagement.getEditContractID().getAttribute('value').then((value) => {
                    expect(value).toBe(ContractID);
                });
                dataManagement.getEditVendorTaxID().getAttribute('value').then((value) => {
                    expect(value).toBe(VendorTaxID);
                });
                dataManagement.getEditVendorName().getAttribute('value').then((value) => {
                    expect(value).toBe(VendorName);
                });
                dataManagement.getEditAmount().getAttribute('value').then((value) => {
                    expect(value).toBe(Amount.toString() + ".00");
                });
                dataManagement.getEditTransactionDate().getAttribute('value').then((value) => {
                    expect(value).toBe(TransactionDate);
                });
                dataManagement.getEditNotes().getAttribute('value').then((value) => {
                    expect(value).toBe(Notes);
                });
                // closing the popup modal
                dataManagement.getEditCancelButton().click();
            }
        }
}

// opening the transaction popup where the Self Reporting files can be downloaded or uploaded
const openUploadTransactionPopup = () => {
    browser.getCurrentUrl().then((url)=>{
        // if the user not in the Data Management tab, click on the Data Management tab
        if (url != 'https://sbsd-dashboard-ui-qa.sbsd-va.net/management/transaction'){
            dashboard.getDataManagementTab().click();
            waitUntilLoadingStarts();
            waitUntilLoadingStops();
        }
    });
    // else click on the dropdown options to download/upload Self Reporting file
    browser.actions().mouseMove(dataManagement.getSubmitDropdown()).click().perform();
    browser.actions().mouseMove(dataManagement.getSelfReportingTransactions()).perform();
    browser.actions().mouseMove(dataManagement.getSpreadSheetUpload()).click().perform();
}
// Test suite for downloading the Self Reporting template file
describe('Upload Transaction - Download Template', async() => {

    var originalTimeout: number;

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        login = new LoginPage();
        dashboard = new Dashboard();
        dataManagement = new DataManagementPage();
        uploadManager = new UploadManager();
    });

    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('Should be able to download SelfReportingTemplate.xls file', async() => {
        // login into the application
        await loginFunction(LoginCredentials.email, LoginCredentials.password);
        // waiting twice for the loader to popup and disappear, as it's the actual behaviour of the application
        waitUntilLoadingStarts();
        waitUntilLoadingStops();
        waitUntilLoadingStarts();
        waitUntilLoadingStops();
        browser.wait(ExpectedConditions.elementToBeClickable(dashboard.getDataManagementTab()), 30000);
        // opening transaction popup for downloading the Self Reporting template file
        openUploadTransactionPopup();
        expect(await dataManagement.getDownloadButton().isPresent()).toBe(true);
        dataManagement.getDownloadButton().click();
        browser.sleep(5000); // to observe that the file is downloaded
    });
});

// Test suite for uploading the self reporting transaction file
describe("Upload Transaction - Upload the modified excel file", () => {

    it("Should upload the file successfully and pre-populate the data at transaction table for valid data", async() => {
        testUploadStatus(filePath, 301, '783628638', 'VIT', '08/25/2020', '1738', 100, 'Some Description', 'success');
    });

    it("Should fail to upload the file for invalid Agency Code", async() => {
        openUploadTransactionPopup();
        testUploadStatus(filePath, 385, '123456789', 'VCET', '08/25/2020', '', 100, '', 'failed');
        // to view the details of the error for a failed transaction
        uploadManager.getRecentDataError().click();
        browser.wait(ExpectedConditions.visibilityOf(uploadManager.getErrorDetail()), 15000);
        expect(await uploadManager.getErrorDetail().getText()).toBe('Agency code does not exist/is restricted for you. Please enter a valid agency code.');
        browser.wait(ExpectedConditions.elementToBeClickable(uploadManager.getErrorCloseButton()),15000);
        // closing the error popup
        uploadManager.getErrorCloseButton().click();
    });

    it("Should append 0 at the front of the VendorTaxID if the total number of digits is less than 9", async() => {
        openUploadTransactionPopup();
        testUploadStatus(filePath, 301, '1256789', 'VCET', '08/25/2020', '', 100, '', 'success');
    });

    it("Should not let us to upload by display error message for an invalid VendorTaxID", async() => {
        openUploadTransactionPopup();
        writeToExcel(filePath, 301, 'agdheribh', 'VCET', '08/25/2020', '', 100, '');
        dataManagement.getChooseFileButton().sendKeys(filePath);
        // getting the error message which is being displayed right below the choose file button
        expect(await dataManagement.getUploadErrorMessage().getText()).toBe('Vendor Tax ID should contain only number [0-9] on Row No');
        expect(await dataManagement.getUploadErrorRow().getText()).toEqual(['2']);
        // closing the upload transaction
        dataManagement.getEditCancelButton().click();
    });

    it("Should fail to upload the file for empty Vendor Name", async() => {
        openUploadTransactionPopup();
        testUploadStatus(filePath, 301, '123456789', '', '08/25/2020', '', 100, '', 'failed');
        uploadManager.getRecentDataError().click();
        browser.wait(ExpectedConditions.visibilityOf(uploadManager.getErrorDetail()), 15000);
        expect(await uploadManager.getErrorDetail().getText()).toBe("Vendor Name cannot be empty.");
        browser.wait(ExpectedConditions.elementToBeClickable(uploadManager.getErrorCloseButton()),15000);
        uploadManager.getErrorCloseButton().click();
    });

    it("Should fail to upload the file for the Transaction Date less than July 01 2020", async() => {
        openUploadTransactionPopup();
        testUploadStatus(filePath, 301, '123456789', 'VCET', '05/25/2020', '', 100, '', 'failed');
        uploadManager.getRecentDataError().click();
        browser.wait(ExpectedConditions.visibilityOf(uploadManager.getErrorDetail()), 15000);
        expect(await uploadManager.getErrorDetail().getText()).toBe("Invalid Transaction Date.");
        browser.wait(ExpectedConditions.elementToBeClickable(uploadManager.getErrorCloseButton()),15000);
        uploadManager.getErrorCloseButton().click();
    });

    it("Should fail to upload the file for the Transaction Date greater than current date", async() => {
        openUploadTransactionPopup();
        testUploadStatus(filePath, 301, '123456789', 'VCET', '09/15/2020', '', 100, '', 'failed');
        uploadManager.getRecentDataError().click();
        browser.wait(ExpectedConditions.visibilityOf(uploadManager.getErrorDetail()), 15000);
        expect(await uploadManager.getErrorDetail().getText()).toBe("Invalid Transaction Date.");
        browser.wait(ExpectedConditions.elementToBeClickable(uploadManager.getErrorCloseButton()),15000);
        uploadManager.getErrorCloseButton().click();
    });
});