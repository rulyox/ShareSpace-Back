export const selectFollowing = (id: number): string =>
    `
    SELECT users.access AS access
    FROM follow
        INNER JOIN users ON users.id = follow.following_id
    WHERE follow.follower_id = ${id}
    ;`;

export const selectFollower = (id: number): string =>
    `
    SELECT users.access AS access
    FROM follow
        INNER JOIN users ON users.id = follow.follower_id
    WHERE follow.following_id = ${id}
    ;`;

export const checkFollowing = (follower: number, following: number): string =>
    `
    SELECT following_id
    FROM follow
    WHERE follower_id = ${follower} AND following_id = ${following}
    ;`;

export const addFollow = (follower: number, following: number): string =>
    `
    INSERT INTO follow
    VALUES ("${follower}", "${following}")
    ;`;

export const deleteFollow = (follower: number, following: number): string =>
    `
    DELETE FROM follow
    WHERE follower_id = "${follower}" AND following_id = "${following}"
    ;`;
