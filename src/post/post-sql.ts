const add = (user: number, text: string): string =>
    `INSERT INTO post
    VALUES (NULL, ${user}, "${text}", NULL);`;

const addImage = (post: number, image: string): string =>
    `INSERT INTO post_image
    VALUES (NULL, ${post}, "${image}");`;

const selectNumberOfPostByUser = (user: number): string =>
    `SELECT COUNT(*) as count
    FROM post
    WHERE user = ${user};`;

const selectPostByUserInRange = (user: number, start: number, count: number): string =>
    `SELECT id
    FROM post
    WHERE user = ${user}
    ORDER BY id DESC
    LIMIT ${start}, ${count};`;

const selectPostData = (id: number): string =>
    `SELECT user.id AS user, user.name AS name, user.image AS profile, post.text AS text
    FROM post, user
    WHERE post.user = user.id AND post.id = ${id};`;

const selectPostImage = (post: number): string =>
    `SELECT image
    FROM post_image
    WHERE post = ${post};`;

const selectImageFile = (post: number, image: string): string =>
    `SELECT image
    FROM post_image
    WHERE post = ${post} AND image = "${image}";`;

const selectFeedInRange = (user: number, start: number, count: number): string =>
    `SELECT post
    FROM feed
    WHERE user = ${user}
    LIMIT ${start}, ${count};`;

export default {
    add,
    addImage,
    selectNumberOfPostByUser,
    selectPostByUserInRange,
    selectPostData,
    selectPostImage,
    selectImageFile,
    selectFeedInRange
};
