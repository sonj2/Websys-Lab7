var App = angular.module('visualApp', []);

App.controller('mainController', function ($scope, $http) {
    $scope.Return = function () {
        window.location.href = "/";
    }
    var link = window.location.href;
    $scope.symbols = [];
    $scope.symbolcounts = [];
    var colorWheel = ['rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'];
    var borderWheel = ['rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'];
    $http.get(link + '/pie').then((response) => {
        var data = response.data;
        var pieColors = [];
        var pieBorders = [];
        for (var key in data) {
            $scope.symbols.push(data[key]._id);
            $scope.symbolcounts.push(data[key].count);
            pieColors.push(colorWheel[key % colorWheel.length]);
            pieBorders.push(borderWheel[key % colorWheel.length]);
        }
        var ctx = $('#pieChart');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: $scope.symbols,
                datasets: [{
                    data: $scope.symbolcounts,
                    backgroundColor: pieColors,
                    borderColor: pieBorders,
                    borderWidth: 1
                }]
            }
        });
    });
    $http.get(link + '/line').then((response) => {
        var data = response.data;
        var symbol = data[0].symbol;
        data.sort((a, b) => { return a.t - b.t });
        var timeArray = [];
        var priceArray = [];
        var hpriceArray = [];
        var lpriceArray = [];
        for (var key in data) {
            timeArray.push(moment(new Date(data[key].t * 1000)));
            priceArray.push(data[key].c);
            hpriceArray.push(data[key].h);
            lpriceArray.push(data[key].l);
        }
        var colorArray = [];
        var borderArray = [];
        var temp = Math.floor(Math.random() * colorWheel.length);
        for (var i = 0; i < 3; i++) {
            colorArray.push(colorWheel[(temp + i) % colorWheel.length]);
            borderArray.push(borderWheel[(temp + i) % borderWheel.length]);
        }
        var ctx = $("#lineChart");
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeArray,
                datasets: [{
                    label: "Price of: " + symbol,
                    data: priceArray,
                    backgroundColor: colorArray[0],
                    borderColor: borderArray[0],
                }, {
                    label: "Top daily price of: " + symbol,
                    data: hpriceArray,
                    backgroundColor: colorArray[1],
                    borderColor: borderArray[1],
                }, {
                    label: "Bottom daily price of: " + symbol,
                    data: lpriceArray,
                    backgroundColor: colorArray[2],
                    borderColor: borderArray[2],
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }],
                }
            }
        })
    });
    $http.get(link + '/bar').then((response) => {
        var data = response.data;
        var timeArray = [];
        for (var key in data) {
            timeArray.push(new Date(data[key]._id * 1000));
        }
        var dataArray = [];
        var barColors = [];
        var barBorders = [];
        for (var key in timeArray) {
            var unique = true;
            var tempDate = timeArray[key];
            for (var k in dataArray) {
                if (dataArray[k].x.toDate().toDateString() == tempDate.toDateString()) {
                    dataArray[k].y += 1;
                    unique = false;
                    break;
                }
            }
            if (unique) {
                dataArray.push({ x: moment(new Date(tempDate.toDateString())), y: 1 });
                barColors.push(colorWheel[key % colorWheel.length]);
                barBorders.push(borderWheel[key % colorWheel.length]);
            }
        }
        //console.log(dataArray);
        var ctx = $('#barChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
                datasets: [{
                    label: "Daily API Calls",
                    barPercentage: 0.9,
                    barThickness: 30,
                    minBarLength: 2,
                    data: dataArray,
                    backgroundColor: barColors,
                    borderColor: barBorders,
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    });
});