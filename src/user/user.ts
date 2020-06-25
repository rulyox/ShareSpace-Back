export class User {

    private _id: number;
    private _access: string;
    private _email: string;
    private _name: string;
    private _image: string;

    constructor(id: number, access: string, email: string, name: string, image: string) {
        this._id = id;
        this._access = access;
        this._email = email;
        this._name = name;
        this._image = image;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get access(): string {
        return this._access;
    }

    set access(value: string) {
        this._access = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get image(): string {
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }

}
