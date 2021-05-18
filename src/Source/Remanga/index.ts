import Source from "../Source";
import RemangaAuthorizer from "./RemangaAuthorizer";
import RemangaUploader from "./RemangaUploader";

export default class RemangaSource extends Source {
    public name = "Remanga";
    public baseLink = "https://remanga.org/";

    protected loadAuthorizer = () =>
        this.authorizer = new RemangaAuthorizer(this);

    protected loadUploader = () =>
        this.uploader = new RemangaUploader();
}