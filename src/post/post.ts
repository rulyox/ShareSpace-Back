export class Post {

    private _userAccess: string;
    private _userName: string;
    private _userProfile: string;
    private _text: string;
    private _time: string;
    private _image: string[];

    constructor(userAccess: string, userName: string, userProfile: string, text: string, time: string, image: string[]) {
        this._userAccess = userAccess;
        this._userName = userName;
        this._userProfile = userProfile;
        this._text = text;
        this._time = time;
        this._image = image;
    }

    get userAccess(): string {
        return this._userAccess;
    }

    set userAccess(value: string) {
        this._userAccess = value;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get userProfile(): string {
        return this._userProfile;
    }

    set userProfile(value: string) {
        this._userProfile = value;
    }

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get time(): string {
        return this._time;
    }

    set time(value: string) {
        this._time = value;
    }

    get image(): string[] {
        return this._image;
    }

    set image(value: string[]) {
        this._image = value;
    }

}
