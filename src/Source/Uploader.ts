export default abstract class Uploader {
    public async upload() {
        await this.gotoUploadPage();
        await this.attachFiles();
        await this.uploadFiles();
    }

    protected abstract gotoUploadPage(): Promise<void>;
    protected abstract attachFiles(): Promise<void>;
    protected abstract uploadFiles(): Promise<void>;
}