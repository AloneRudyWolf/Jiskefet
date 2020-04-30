const http = require('http');
const mysql = require('mysql');
const url = require('url');
const fs = require('fs');
const path = require('path');
const SqlString = require('sqlstring');


let server_setup = require("./setup.json");
let my_db = undefined;

if(server_setup.http === undefined || server_setup.http.port === undefined)
{
    if(server_setup.http === undefined)
        console.warn("Setup has no \"http\" section! The default setup will be used.");
    else if(server_setup.http.port === undefined)
        console.warn("Setup has no \"http.port\" parameter! The default setup will be used.");

    server_setup.http =
    {
        port : 8124
    };
}


function connectMyDb()
{
    if(my_db === undefined)
    {
        my_db = mysql.createPool({
            connectionLimit : 5,
            host     : server_setup.mysql.host,
            user     : server_setup.mysql.user,
            password : server_setup.mysql.password,
            database : server_setup.mysql.db,
            charset  : 'UTF8MB4_UNICODE_CI',
            multipleStatements: true
        });
        for(let i = 0; i < 5; i++)
            dbQuery(null, "SET lc_time_names = 'ru_RU';", function(results1, fields1) {});
    }
}

function disconnectMyDb()
{
    if(my_db !== undefined)
    {
        my_db.end(function(err)
        {
            my_db = undefined;
        });
    }
    my_db = undefined;
}

function reconnectMyDb()
{
    disconnectMyDb();
    connectMyDb();
}

function errorMyDb(error, results, fields)
{
    if(error)
    {
        console.log("Error happen! " + error);
        reconnectMyDb();
    }
}

connectMyDb();


function sendReply(res, st, data, errmsg = "")
{
    if(!res)
        return;

    let reply;
    if(st === "error")
    {
        reply = {state : st, error : errmsg, reply : data};
        res.writeHead(418, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(reply));
    }
    else
    {
        reply = {state : st, info : errmsg, reply : data};
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(reply));
    }
}

function dbQuery(res, query, funk)
{
    my_db.query(query,
    function(error, results, fields)
    {
        try
        {
            if(error)
            {
                sendReply(res, "error", error, "Query has failed");
                return;
            }
            funk(results, fields);
        }
        catch(e)
        {
            if(error)
            {
                sendReply(res, "error", error, "Query has failed");
                return;
            }
            sendReply(res, "error", [], e.message);
        }
    });
}



function processReply(res, quest)
{
    /************************************************************
     *            Получить все данные таблицы run
     ************************************************************/
    if (quest.action === "getAllRuns")
    {
        dbQuery(res, 'SELECT * from run;',
        function (results1, fields1)
        {
            sendReply(res, "ok", results1, "Content of Run!");
        });
    }

    /************************************************************
     *            Получить одну строку таблицы run
     ************************************************************/
    else if (quest.action === "getRunData")
    {
        dbQuery(res, 'SELECT * from run WHERE run_number=' + SqlString.escape(quest.data.run_number) + ';',
        function (results1, fields1)
        {
            sendReply(res, "ok", results1, "Content of Run!");
        });
    }

    /************************************************************
     *            Получить все данные таблицы user
     ************************************************************/
    else if (quest.action === "getAllUsers")
    {
        dbQuery(res, 'SELECT * from user;',
            function (results1, fields1)
            {
                sendReply(res, "ok", results1, "Content of Run!");
            });
    }

    /************************************************************
     *                       Пустышка
     ************************************************************/

    else if (quest.action === "dummy")
    {
        let crap =
        {
            "data": [
                {
                    "x": [
                        [
                            2,
                            3
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            2,
                            3
                        ],
                        [
                            2,
                            3
                        ]
                    ]
                }
            ]
        };
        sendReply(res, "ok", crap, "It works!");
    }

    /************************************************************
     *                   Неизвестный запрос
     ************************************************************/
    else
    {
        sendReply(res, "error", [], "Unknown command " + quest.action);
    }
}

// maps file extention to MIME types
const mimeType =
{
    '.ico': 'image/x-icon',
    '.htm': 'text/html',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
};

let server = new http.Server(function(req, res)
{
    let inputData = '';
    //console.log(req.headers);

    if(req.method === "OPTIONS")
    {
        req.on('data', (data) =>
        {
            inputData += data;
        });

        req.on('end', () =>
        {
            inputData = "";
            let heads = {};
            heads["Access-Control-Allow-Origin"] = "*";
            heads["Access-Control-Allow-Headers"] = 'origin, content-type, accept';
            heads["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
            res.writeHead(200, heads);
            res.end();
        });
        return;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    if(req.method !== "POST" && req.method !== "GET")
    {
        req.on('data', (data) => {
            inputData += data;
        });

        req.on('end', () => {
            console.log(inputData);
            inputData = "";
            sendReply(res, "error", [], "Invalid method");
        });
        return;
    }

    if(req.method === "GET")
    {
        // parse URL
        const parsedUrl = url.parse(req.url);

        // extract URL path
        // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
        // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
        // by limiting the path to current directory only
        const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
        let pathname = path.join(__dirname, sanitizePath);

        fs.exists(pathname, function (exist)
        {
            if(!exist)
            {
                // if the file is not found, return 404
                res.statusCode = 404;
                res.end(`File ${pathname} not found!`);
                return;
            }

            // if is a directory, then look for index.html
            if (fs.statSync(pathname).isDirectory())
            {
                pathname += '/index.html';
            }

            // read file from file system
            fs.readFile(pathname, function(err, data)
            {
                if(err)
                {
                    res.statusCode = 500;
                    res.end(`Error getting the file: ${err}.`);
                }
                else
                {
                    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                    const ext = path.parse(pathname).ext;
                    // if the file is found, set Content-type and send data
                    res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
                    res.end(data);
                }
            });
        });
        return;
    }

    // If "POST"

    req.on('data', (data) => {
        inputData += data;
    });

    req.on('end', () => {
        try
        {
            let quest = JSON.parse(inputData);
            processReply(res, quest);
            inputData = "";
        }
        catch(e)
        {
            sendReply(res, "error", [], e.message);
            inputData = "";
        }
    });
});

server.listen(server_setup.http.port);
console.log("Listening HTTP on port " + server_setup.http.port + "...");

setInterval(function()
{
    if(global.gc)
    {
        global.gc();
    } else {
        console.log('Garbage collection unavailable.  Pass --expose-gc '
            + 'when launching node to enable forced garbage collection.');
    }
    console.log('Memory usage:', process.memoryUsage());
}, 1800000); //Every half of hour
