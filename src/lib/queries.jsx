export const getPlayerInfoByAccountId = `
    SELECT p.id, p.name, p.head, p.gender, ha.avatar_id
    FROM player p
    LEFT JOIN head_avatar ha ON p.head = ha.head_id
    WHERE p.account_id = ?
  `;
  export const updateMoneyAccountId = `UPDATE account SET vnd = vnd + ? WHERE id = ?`