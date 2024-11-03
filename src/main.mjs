/**
 * Created on: 2024/11/01
 *     Author: A.G.
 */

import Hapi from '@hapi/hapi';

import {
    dbNoteAdd,
    dbNoteDelete,
    dbNoteSelectAll
} from './query.mjs';

let server = new Hapi.Server({ port: 3000 });

let nonPersistent = [ 'true', '1', 'yes' ].includes(`${process.env.NON_PERSISTENT}`);

if (nonPersistent) {
    console.log('Starting server with non-persistent storage');
} else {
    console.log('Starting server with PostgreSQL database');
}

let records = [
    // {
    //     id: 1,
    //     timestamp: (new Date()).toISOString(),
    //     note: "Hello world!",
    //     deleted: false
    // }
];

server.route({
    method: 'GET',
    path: '/notes',
    handler: async (request, h) => {
        if (nonPersistent) {
            return records.filter(x => !x.deleted);
        } else {
            try {
                return await dbNoteSelectAll();
            } catch (cause) {
                console.error(`Exception in "GET /notes" handler:`, cause);
                return h.response({ error }).code(500);
            }
        }
    }
});

server.route({
    method: 'POST',
    path: '/notes',
    handler: async (request, h) => {
        if (nonPersistent) {
            let nextId = records.length > 0 ? records.slice(-1)[0].id + 1 : 1;
            let record = {
                note: '',
                ...request.payload,
                timestamp: (new Date()).toISOString(),
                deleted: false,
                id: nextId
            };
            records.push(record);
            return record;
        } else {
            try {
                let { note } = request.payload;
                return await dbNoteAdd({ note });
            } catch (error) {
                console.error(`Exception in "POST /notes" handler:`, cause);
                return h.response({ error }).code(500);
            }
        }
    }
});

server.route({
    method: 'DELETE',
    path: '/note/{id}',
    handler: async (request, h) => {
        let { id } = request.params;
        id = parseInt(id);
        if (nonPersistent) {
            let i = records.findIndex(x => x.id == id);
            records[i].deleted = true;
            return records[i];
        } else {
            try {
                return await dbNoteDelete(id);
            } catch (error) {
                console.error(`Exception in "DELETE /note/${id}" handler:`, cause);
                return h.response({ error }).code(500);
            }
        }
    }
});

await server.start();

process.on(`SIGINT`, async () => {
    console.log(`Terminating...`);
    await server.stop();
});
