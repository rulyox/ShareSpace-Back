export const select = (email: string, pw: string): string =>
    `
    SELECT id, email, name
    FROM user
    WHERE email = "${email}" AND pw = "${pw}"
    ;`;

export const selectSaltByEmail = (email: string): string =>
    `
    SELECT salt
    FROM user
    WHERE email = "${email}"
    ;`;

export const selectByID = (id: number): string =>
    `
    SELECT *
    FROM user
    WHERE id = ${id}
    ;`;

export const selectByAccess = (access: string): string =>
    `
    SELECT *
    FROM user
    WHERE access = "${access}"
    ;`;

export const checkEmail = (email: string): string =>
    `
    SELECT id
    FROM user
    WHERE email = "${email}"
    ;`;

export const add = (access: string, email: string, pw: string, salt: string, name: string): string =>
    `
    INSERT INTO user
    VALUES (NULL, "${access}", "${email}", "${pw}", "${salt}", "${name}", NULL)
    ;`;

export const addProfileImage = (id: number, image: string): string =>
    `
    UPDATE user
    SET image = "${image}"
    WHERE id = ${id}
    ;`;
