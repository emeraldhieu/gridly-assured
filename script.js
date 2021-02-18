import http from 'k6/http';
import { check, sleep } from 'k6';

let apiKey = 'kvR5ewtW9kvjAr';
let viewId = '41wk9m9q0w8mnn';
let recordId = 'v1lxdoj84e0v9o';
let columnId = 'picture';
let fileName = 'pizza1.jpg';
let contentType = 'image/jpeg';
let filePath = `/Users/hieunguyen/Downloads/Photos/${fileName}`;

// Read file bytes.
let file = open(filePath, 'b');

export default function() {
    fetchRecords(apiKey, viewId);
    //uploadFile(apiKey, viewId, recordId, columnId, file, fileName, contentType);
}

function uploadFile(apiKey, viewId, recordId, columnId, file, fileName, contentType) {
    let uri = `http://localhost:7070/v1/views/${viewId}/files`;

    // Prepare FileData. See https://k6.io/docs/javascript-api/k6-http/filedata.
    let fileData = http.file(file, `${fileName}`, `${contentType}`);

    var body = {
        recordId: `${recordId}`,
        columnId: `${columnId}`,
        file: fileData
    };

    let params = {
        headers: {
            'Authorization': `ApiKey ${apiKey}`
        }
    };

    var res = http.post(uri, body, params);

    printLogs(res);

    check(res, {
        'status is 201': (r) => r.status == 201
    });
}

function fetchRecords(apiKey, viewId) {
    let uri = `http://localhost:7070/v1/views/${viewId}/records`;

    let params = {
        headers: {
            'Authorization': `ApiKey ${apiKey}`
        }
    };

    let res = http.get(uri, params);

    printLogs(res);

    check(res, {
        'status is 200': (r) => r.status == 200
    });
}

function printLogs(res) {
	// Print response headers.
    for (let p in res.headers) {
        if (res.headers.hasOwnProperty(p)) {
            console.log(p + ' : ' + res.headers[p]);
        }
    }

    console.log("status: " + res.status);
    console.log("body: " + res.body);
    console.log("errorCode: " + res.error_code);
}