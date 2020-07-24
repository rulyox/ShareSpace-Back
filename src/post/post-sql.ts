export const selectById = (id: number): string =>
    `
    SELECT users.id AS user, users.access AS access, users.email AS email, users.name AS name, users.image AS profile,
        post.text AS text, DATE_FORMAT(post.time, '%Y. %m. %d. %H:%i') AS time
    FROM post
        INNER JOIN users ON users.id = post.user_id
    WHERE post.id = ${id}
    ;`;

export const selectIdByAccess = (access: string): string =>
    `
    SELECT id
    FROM post
    WHERE access = "${access}"
    ;`;

export const selectNumberOfPostByUser = (user: number): string =>
    `
    SELECT COUNT(*) as count
    FROM post
    WHERE user_id = ${user}
    ;`;

export const selectPostByUserInRange = (user: number, start: number, count: number): string =>
    `
    SELECT access
    FROM post
    WHERE user_id = ${user}
    ORDER BY id DESC
    LIMIT ${start}, ${count}
    ;`;

export const selectFeedInRange = (user: number, start: number, count: number): string =>
    `
    SELECT access
    FROM feed
    WHERE user_id = ${user}
    LIMIT ${start}, ${count}
    ;`;

export const add = (access: string, user: number, text: string): string =>
    `
    INSERT INTO post
    VALUES (NULL, "${access}", ${user}, "${text}", NULL)
    ;`;

export const addImage = (post: number, image: string): string =>
    `
    INSERT INTO post_image
    VALUES (NULL, ${post}, "${image}")
    ;`;

export const deleteById = (id: number): string =>
    `
    DELETE FROM post
    WHERE id = ${id}
    ;`;

export const selectImage = (post: number): string =>
    `
    SELECT image
    FROM post_image
    WHERE post_id = ${post}
    ;`;

export const checkImage = (post: number, image: string): string =>
    `
    SELECT image
    FROM post_image
    WHERE post_id = ${post} AND image = "${image}"
    ;`;

export const addLike = (post: number, user: number): string =>
    `
    INSERT INTO post_like
    VALUES (${post}, ${user})
    ;`;

export const deleteLike = (post: number, user: number): string =>
    `
    DELETE FROM post_like
    WHERE post_id = ${post} AND user_id = ${user}
    ;`;

export const selectLike = (post: number): string =>
    `
    SELECT users.access
    FROM post_like
        INNER JOIN users ON users.id = post_like.user_id
    WHERE post_like.post_id = ${post}
    ;`;

export const addComment = (access: string, post: number, user: number, comment: string): string =>
    `
    INSERT INTO post_comment
    VALUES (NULL, "${access}", ${post}, ${user}, "${comment}", NULL)
    ;`;

export const deleteComment = (access: string): string =>
    `
    DELETE FROM post_comment
    WHERE access = "${access}"
    ;`;

export const selectCommentByAccess = (access: string): string =>
    `
    SELECT post_comment.id, post_comment.access, post_comment.comment, DATE_FORMAT(post_comment.time, '%Y. %m. %d. %H:%i') AS time,
        users.access AS user
    FROM post_comment
        INNER JOIN users ON users.id = post_comment.user_id
    WHERE post_comment.access = "${access}"
    ;`;

export const selectCommentByPost = (post: number): string =>
    `
    SELECT post_comment.id, post_comment.access, post_comment.comment, DATE_FORMAT(post_comment.time, '%Y. %m. %d. %H:%i') AS time,
        users.access AS user
    FROM post_comment
        INNER JOIN users ON users.id = post_comment.user_id
    WHERE post_comment.post_id = ${post}
    ;`;
