const surveyHost = "http://" + window.location.hostname + ":1337";

function objDump(object, outStr = null, depth = 0)
{
    let out = outStr ? outStr : {oStr : ""};
    if(object && typeof(object) == "object")
    {
        for(let i in object)
        {
            let intent = "";
            for(let d = 0; d < depth; d++)
                intent += "\t";
            let sub = object[i];
            if(typeof(sub) == "object")
            {
                out.oStr += intent + i + ": {\n";
                objDump(sub, out, depth + 1);
                out.oStr += intent + "}\n";
            }
            else
                out.oStr += intent + i + ": " + sub + "\n";
        }
    }
    else
    {
        out.oStr = object;
    }
    return out.oStr;
}


function cb_overlay(client, funkOk, funkErr)
{
    if(client.readyState === 4)
    {
        let questionsReply = client.responseText;
        if (questionsReply)
        {
            try
            {
                let reply = JSON.parse(questionsReply);
                if(reply.state === "ok")
                {
                    funkOk(reply);
                }
                else
                {
                    alert("ОШИБКА СЕРВЕРА: " + reply.error + "\n\nПодробности: " + objDump(reply.reply));
                    funkErr(reply);
                }
            }
            catch(e)
            {
                alert("Исключение: " + objDump(e) + "\n\nВходные данные: " + objDump(questionsReply));
                funkErr({});
            }
            return;
        }
        alert("ОШИБКА: Потеря связи!");
        funkErr({});
    }
}




let client = new XMLHttpRequest();

function requestDummy()
{
    let data =
    {
        action: "dummy",
        data : {}
    };

    client.open("POST", surveyHost + "/");
    client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    client.onreadystatechange = requestDummy_cb;
    client.send(JSON.stringify(data));
}
function requestDummy_cb()
{
    cb_overlay(function(reply)
    {
        alert("ЛОВИ: " + objDump(reply));
    },
    function(reply)
    {
        alert("АААА, БОЛЬНА!!!: " + objDump(reply));
    });
}


let clientRunData = new XMLHttpRequest();
function getRunData()
{
    let data =
    {
        action: "getRunData",
        data : {
            run_number: document.getElementById('getDataId').value
        }
    };

    clientRunData.open("POST", surveyHost + "/");
    clientRunData.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    clientRunData.onreadystatechange = getRunData_cb;
    clientRunData.send(JSON.stringify(data));
}
function getRunData_cb()
{
    cb_overlay(clientRunData, function(reply)
        {
            let outDiv = document.getElementById('runDataDiv');
            outDiv.innerHTML = "";
            reply.reply.forEach(function(a, i, arr)
            {
                // a.<имя-поля как в JSON-е>
                chart1.data.datasets[0].data = [a.n_flps, a.n_epns, a.n_timeframes, a.n_subtimeframes, a.n_detectors];
                chart1.update();

                chart2.data.datasets[0].data = [a.n_flps, a.n_epns, a.n_timeframes, a.n_subtimeframes, a.n_detectors];
                chart2.update();

                chart3.data.datasets[0].data = [0, a.n_flps, 0];
                chart3.data.datasets[1].data = [0, a.n_epns, 0];
                chart3.data.datasets[2].data = [0, a.n_timeframes, 0];
                chart3.data.datasets[3].data = [0, a.n_subtimeframes, 0];
                chart3.data.datasets[4].data = [0, a.n_detectors, 0];
                chart3.update();

                chart4.data.datasets[0].data = [a.n_flps, a.n_epns, a.n_timeframes, a.n_subtimeframes, a.n_detectors];
                chart4.update();

                outDiv.appendChild(document.createTextNode("run_number: "));
                outDiv.appendChild(document.createTextNode(a.run_number));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("time_o2_start: "));
                outDiv.appendChild(document.createTextNode(a.time_o2_start));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("time_trg_start: "));
                outDiv.appendChild(document.createTextNode(a.time_trg_start));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("time_trg_end: "));
                outDiv.appendChild(document.createTextNode(a.time_trg_end));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("time_o2_end: "));
                outDiv.appendChild(document.createTextNode(a.time_o2_end));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("activity_id: "));
                outDiv.appendChild(document.createTextNode(a.activity_id));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("run_type: "));
                outDiv.appendChild(document.createTextNode(a.run_type));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("run_quality: "));
                outDiv.appendChild(document.createTextNode(a.run_quality));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("n_detectors: "));
                outDiv.appendChild(document.createTextNode(a.n_detectors));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("n_flps: "));
                outDiv.appendChild(document.createTextNode(a.n_flps));
                outDiv.appendChild(document.createElement('br'));


                outDiv.appendChild(document.createTextNode("n_epns: "));
                outDiv.appendChild(document.createTextNode(a.n_epns));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("n_timeframes: "));
                outDiv.appendChild(document.createTextNode(a.n_timeframes));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("n_subtimeframes: "));
                outDiv.appendChild(document.createTextNode(a.n_subtimeframes));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("bytes_read_out: "));
                outDiv.appendChild(document.createTextNode(a.bytes_read_out));
                outDiv.appendChild(document.createElement('br'));

                outDiv.appendChild(document.createTextNode("bytes_timeframe_builder: "));
                outDiv.appendChild(document.createTextNode(a.bytes_timeframe_builder));
                outDiv.appendChild(document.createElement('br'));
            });
        },
        function(reply)
        {
            alert("АААА, БОЛЬНА!!!: " + objDump(reply));
        });
}


let clientUsers = new XMLHttpRequest();
function getAllUsers()
{
    let data =
        {
            action: "getAllUsers",
            data : {}
        };

    clientUsers.open("POST", surveyHost + "/");
    clientUsers.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    clientUsers.onreadystatechange = getAllUsers_cb;
    clientUsers.send(JSON.stringify(data));
}
function getAllUsers_cb()
{
    cb_overlay(clientUsers, function(reply)
        {
            let outHead = document.getElementById('usersTableBody');
            outHead.innerHTML = "";

            {
                let tH = document.createElement("tr");

                let userIdTd = document.createElement("th");
                userIdTd.appendChild(document.createTextNode("#"));
                tH.appendChild(userIdTd);

                let externalIdTd = document.createElement("th");
                externalIdTd.appendChild(document.createTextNode("External ID"));
                tH.appendChild(externalIdTd);

                let samsIdTd = document.createElement("th");
                samsIdTd.appendChild(document.createTextNode("SAMS ID"));
                tH.appendChild(samsIdTd);

                outHead.appendChild(tH);
            }

            reply.reply.forEach(function(a, i, arr)
            {
                let tR = document.createElement("tr");

                let userIdTd = document.createElement("td");
                userIdTd.appendChild(document.createTextNode(a.user_id));
                tR.appendChild(userIdTd);

                let externalIdTd = document.createElement("td");
                externalIdTd.appendChild(document.createTextNode(a.external_id));
                tR.appendChild(externalIdTd);

                let samsIdTd = document.createElement("td");
                samsIdTd.appendChild(document.createTextNode(a.sams_id));
                tR.appendChild(samsIdTd);

                outHead.appendChild(tR);
            });
        },
        function(reply)
        {
            alert("АААА, БОЛЬНА!!!: " + objDump(reply));
        });
}
