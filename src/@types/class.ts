export class User {

    id: number;
    access: string;
    email: string;
    name: string;
    image: string;

    constructor(id: number, access: string, email: string, name: string, image: string) {
        this.id = id;
        this.access = access;
        this.email = email;
        this.name = name;
        this.image = image;
    }

}
