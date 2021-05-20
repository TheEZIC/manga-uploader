import Source from "../Source";
import ReadmangaAuthorizer from "./ReadmangaAuthorizer";
import ReadmangaUploader from "./ReadmangaUploader";

export default class ReadmangaSource extends Source {
    public name = "Readmanga";
    public baseLink = "https://readmanga.live/";

    protected loadAuthorizer = () => 
        this.authorizer = new ReadmangaAuthorizer(this);

    protected loadUploader = () => 
        this.uploader = new ReadmangaUploader();
}