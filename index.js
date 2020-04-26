var tickerApp =  angular.module('tickerApp', []);
tickerApp.controller('mainController', function($scope){
    $scope.tableVis = true;
    $scope.printRdy = true;
    $scope.data = [];
    $scope.exportType = ["json", "csv", "xml"];
    $scope.apicall = function() {
        var symbol = $('#symbol').val();
        symbol = symbol.trim();
        var link = window.location.href;
        $.post(link + 'apicall', { symbol: symbol }, function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log("Quote added successfully.");
            }
        });
    }
    $scope.readDB = function() {
        var link = window.location.href;
        $.get(link + 'data', (data) => {
            $scope.data = data;
            $scope.tableVis = false;
            $scope.$apply();
        });
        $scope.printRdy = false;
    }
    $scope.export = function() {
        //console.log($scope.exportVar);
        var type = $scope.exportVar;
        var link = window.location.href;
        window.open(link + 'export/' + type);
        //$.get(link + 'export/' + type);
    }
    $scope.reset = function() {
        var link = window.location.href;
        $.post(link + 'reset', (result) => {
            console.log(result);
        });
        location.reload();
    }
    $scope.print = function() {
        window.print();
    }
    $scope.batchCall = function() {
        var input = $('#batch-text').val();
        input = input.trim();
        var symbols = input.split(";");
        var link = window.location.href;
        for (var key in symbols) {
            $.post(link + 'apicall', { symbol: symbols[key] }, function (err, res) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Quote added successfully.");
                }
                $("#installState").hide();
            });
        }
    }
    var link = window.location.href;
    $.get(link + 'test', (data) => { //Call batch/installation modal if DB has no data
        if(data == 0) {
            $("#batchCall").click();
        } else {
            $("#installState").hide();
        }
    });
});