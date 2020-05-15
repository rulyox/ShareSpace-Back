const select = (email: string, pw: string): string =>
    `SELECT *
    FROM user
    WHERE email = "${email}" AND pw = "${pw}";`;

const selectSaltByEmail = (email: string): string =>
    `SELECT salt
    FROM user
    WHERE email = "${email}";`;

const selectIdByAccess = (access: string): string =>
    `SELECT id
    FROM user
    WHERE access = "${access}";`;

const selectByID = (id: number): string =>
    `SELECT *
    FROM user
    WHERE id = ${id};`;

const checkEmail = (email: string): string =>
    `SELECT *
    FROM user
    WHERE email = "${email}";`;

const add = (access: string, email: string, pw: string, salt: string, name: string): string =>
    `INSERT INTO user
    VALUES (NULL, "${access}", "${email}", "${pw}", "${salt}", "${name}", NULL);`;

const addProfileImage = (id: number, image: string): string =>
    `UPDATE user
    SET image = "${image}"
    WHERE id = ${id}`;

export default {
    select,
    selectSaltByEmail,
    selectIdByAccess,
    selectByID,
    checkEmail,
    add,
    addProfileImage
};
