-- Order by rating based on calculated upvotes and downvotes
SELECT id
FROM (
    SELECT id, upvotes - (downvotes * 0.75) AS rating
    FROM (
        SELECT
            option_option.id AS id,
            SUM(CASE WHEN vote_vote.up = true THEN 1 END) AS upvotes,
            coalesce(SUM(CASE WHEN vote_vote.up = false THEN 1 END), 0) AS downvotes
            FROM option_option INNER JOIN vote_vote ON option_option.id = vote_vote.option_id
            GROUP BY option_option.id
    ) AS t
) AS t
ORDER BY rating;

-- Order option by calculated rating
SELECT * FROM option_option
ORDER BY
(
    SELECT upvotes - (downvotes * 0.75) AS rating
    FROM (
        SELECT
            SUM(CASE WHEN vote_vote.up = true THEN 1 ELSE 0 END) AS upvotes,
            SUM(CASE WHEN vote_vote.up = false THEN 1 ELSE 0 END) AS downvotes
        FROM vote_vote WHERE vote_vote.option_id = option_option.id
    ) as t
) DESC;