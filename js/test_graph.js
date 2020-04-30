function update()
{
    let clock = document.getElementById('clock');

    let date = new Date(); // (*)
    let hours = date.getHours();
    if (hours < 10) hours = '0' + hours;
    clock.children[0].innerHTML = hours;

    let minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    clock.children[1].innerHTML = minutes;

    let seconds = date.getSeconds();
    if (seconds < 10) seconds = '0' + seconds;
    clock.children[2].innerHTML = seconds;
}

let timerId;

function clockStart() { // запустить часы
  timerId = setInterval(update, 1000);
  update(); // (*)
}

function clockStop() {
  clearInterval(timerId);
  timerId = null;
}

let chart1 = null;
let chart2 = null;
let chart3 = null;
let chart4 = null;

function initGraphs()
{
    let ctx21 = document.getElementById('myChart').getContext('2d');
    chart1 = new Chart(ctx21, {
        type: 'doughnut',
        data: {
            labels: ['nFlps', 'nEpns', 'nTimeframes', 'nSubtimeframes', 'nDetectors', ],
            datasets: [{
                data: [0,0,0,0,0],
                backgroundColor: [
                    'rgba(255, 206, 86)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 99, 132)',
                    'rgba(75, 192, 192)',
                    'rgba(112, 128, 144)'
                ]
            }]
        },

// Configuration options go here
        options: {}
    });


    let ctx22 = document.getElementById('badGraph').getContext('2d');
    chart2 = new Chart(ctx22, {
        type: 'polarArea',
        data: {
            labels: ['nFlps', 'nEpns', 'nTimeframes', 'nSubtimeframes', 'nDetectors',],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 206, 86)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 99, 132)',
                    'rgba(75, 192, 192)',
                    'rgba(112, 128, 144)',]
            }]
        },

// Configuration options go here
        options: {}
    });

    let ctx23 = document.getElementById('20').getContext('2d');
    Chart.defaults.global.defaultFontColor = 'white';
    chart3 = new Chart(ctx23, {
// The type of chart we want to create
        type: 'line',
        options: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white'
                }
            }
        },
        data: {
            labels: ['March', 'April', 'May'],
            datasets: [{
                label: 'nFlps',
                data: [0, 0, 0],
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 0.5)',
                borderWidth: 3,
                fill: 2,
            }, {
                label: 'nEpns',
                data: [0, 0, 0],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 0.7)',
                borderWidth: 3,
                fill: 'false',
            }, {
                label: 'nTimeframes',
                data: [0, 0, 0],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 3,
                fill: -1,
            }, {
                label: 'nSubtimeframes',
                data: [0, 0, 0],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 0.5)',
                borderWidth: -3,

            }, {
                label: 'nDetectors',
                backgroundColor: 'rgba(112, 128, 144, 0.3)',
                borderColor: 'rgba(112, 128, 144, 0.5)',
                borderWidth: 3,
                fill: 'end',
                data: [0, 0, 0]
            }]
        }
    });

    let ctx4 = document.getElementById('poLar').getContext('2d');
    chart4 = new Chart(ctx4,
        {
            type: 'bar',
            data: {
                labels: ['nFlps', 'nEpns', 'nTimeframes', 'nSubtimeframes', 'nDetectors',],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(0, 0, 255, 0.7)',
                        'rgba(0, 40 , 255, 0.7)',
                        'rgba(0, 80, 255, 0.7)',
                        'rgba(0, 120, 255, 0.7)',
                        'rgba(0, 160, 255, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {scales: {yAxes: [{ticks: {beginAtZero: true}}]}}
        });

}
