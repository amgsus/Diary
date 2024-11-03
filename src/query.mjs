/**
 * Created on: 2024/11/03
 *     Author: A.G.
 */

import { pool } from "./database.mjs";

// -----------------------------------------------------------------------------
// ----------------------------------------------------------------- Generic ---
// -----------------------------------------------------------------------------

function
prepareStatement(obj, joining = true) 
{
    let k = Object.entries(obj).filter((e) => e[1] !== 'id'); // All fields except Identity

    let valueMasks = k.map((_, i) => `$${i+1}`);

    if (joining) {
        valueMasks = valueMasks.join(', ');
    }

    let fields = k.map((s) => `"${s[0]}"`);

    if (joining) {
        fields = fields.join(', ');
    }

    let values = k.map((s) => s[1]);

    return {
        fields,
        valueMasks,
        values
    };
}

export async function dbGenericTableAdd(table, data) {
    let { 
        fields,
        valueMasks,
        values
    } = prepareStatement(data);

    let q = `INSERT INTO public."${table}" (${fields}) VALUES (${valueMasks}) RETURNING *;`;

    let result = await pool.query(q, values);
    return result.rows[0] ?? {};
}

export async function dbGenericTableUpdate(table, id, data) {
    let { fields, valueMasks, values } = prepareStatement(data, false);

    let valueSets = fields.map((name, i) => `${name} = ${valueMasks[i]}`).join(', ');

    let q = `UPDATE public."${table}" SET ${valueSets} WHERE "id" = $${valueMasks.length+1} RETURNING *;`;

    let result = await pool.query(q, [ ...values, id ]);
    return result.rows[0] ?? {};
}

export async function dbGenericTableSelectAll(table) {
    let result = await pool.query(`SELECT * from public."${table}" WHERE "deleted" = false ORDER BY "id" ASC`);
    return result.rows;
}

export async function dbGenericTableSelect(table, id) {
    let result = await pool.query(`SELECT * from public."${table}" WHERE "id" = $1 ORDER BY "id" ASC`, [ id ]);
    return result.rows[0] ?? {};
}

export async function dbGenericTableMarkDeleted(table, id) {
    let result = await pool.query(`UPDATE public."${table}" SET "deleted" = true WHERE "id" = $1 RETURNING *;`, [ id ]);
    return result.rows[0] ?? {};
}

// -----------------------------------------------------------------------------
// ------------------------------------------------------------------- Notes ---
// -----------------------------------------------------------------------------

export async function dbNoteSelectAll() {
    let result = await pool.query(`SELECT * FROM public."note" WHERE "deleted" = false ORDER BY "timestamp" DESC;`);
    return result.rows;
}

export async function dbNoteAdd(data) {
    return dbGenericTableAdd('note', data); 
}

export async function dbNoteDelete(id) {
    return dbGenericTableMarkDeleted('note', id); 
}
