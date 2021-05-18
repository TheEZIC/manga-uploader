import Source from "../Source";
import MangalibAuthorizer from "./MangalibAuthorizer";
import MangalibUploader from "./MangalibUploader";

export default class MangalibSource extends Source {
    public name = "Mangalib";
    public baseLink = "https://mangalib.me/";

    protected loadAuthorizer = () => 
        this.authorizer = new MangalibAuthorizer(this);

    protected loadUploader = () => 
        this.uploader = new MangalibUploader();
}