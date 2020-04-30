let ctx1 = document.getElementById('12').getContext('2d');
let myChart1 = new Chart(ctx1,
{
    type: 'doughnut',
    data: {
        labels: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            data: [90000, 91000, 86000, 88000, 82000, 77000, 75000, 80500, 79231, 78472, 77713, 76954, 76195],
            backgroundColor: ['rgba(0, 0, 255, 0.7)', 'rgba(0, 40 , 255, 0.7)', 'rgba(0, 80, 255, 0.7)', 'rgba(0, 120, 255, 0.7)', 'rgba(0, 160, 255, 0.7)', 'rgba(0, 200, 255, 0.7)', 'rgba(0, 240, 255, 0.7)', 'rgba(0, 255, 255, 0.7)', 'rgba(0, 255, 0, 0.4)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 255, 0, 0.6)', 'rgba(0, 255, 0, 0.7)', 'rgba(0, 255, 0, 0.8)'],
            borderWidth: 1
        }]
    },
    options: {scales: {yAxes: [{ticks: {beginAtZero: true}}]}}
});

let ctx2 = document.getElementById('13').getContext('2d');
let myChart2 = new Chart(ctx2,
{
    type: 'bar',
    data: {
        labels: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'WT Average Wages',
            data: [63798, 68956, 72485, 74561, 76801, 78949, 79965, 82247, 85627, 88073, 90520, 92967, 95414],
            backgroundColor: ['rgba(0, 0, 255, 0.7)', 'rgba(0, 40 , 255, 0.7)', 'rgba(0, 80, 255, 0.7)', 'rgba(0, 120, 255, 0.7)', 'rgba(0, 160, 255, 0.7)', 'rgba(0, 200, 255, 0.7)', 'rgba(0, 240, 255, 0.7)', 'rgba(0, 255, 255, 0.7)', 'rgba(0, 255, 0, 0.4)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 255, 0, 0.6)', 'rgba(0, 255, 0, 0.7)', 'rgba(0, 255, 0, 0.8)'],
            borderWidth: 1
        }]
    },
    options: {scales: {yAxes: [{ticks: {beginAtZero: true}}]}}
});

let ctx3 = document.getElementById('14').getContext('2d');
let myChart3 = new Chart(ctx3,
{
    type: 'polarArea',
    data: {
        labels: ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            data: [63798, 68956, 72485, 74561, 76801, 78949, 79965, 82247, 86521, 89652, 91567, 93861, 97123],
            backgroundColor: ['rgba(0, 0, 255, 0.7)', 'rgba(0, 40 , 255, 0.7)', 'rgba(0, 80, 255, 0.7)', 'rgba(0, 120, 255, 0.7)', 'rgba(0, 160, 255, 0.7)', 'rgba(0, 200, 255, 0.7)', 'rgba(0, 240, 255, 0.7)', 'rgba(0, 255, 255, 0.7)', 'rgba(0, 255, 0, 0.4)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 255, 0, 0.6)', 'rgba(0, 255, 0, 0.7)', 'rgba(0, 255, 0, 0.8)'],
            borderWidth: 1
        }]
    },
    options: {scales: {yAxes: [{ticks: {beginAtZero: true}}]}}
});
