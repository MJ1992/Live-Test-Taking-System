app.controller('SingleUserController', ['$http', 'DataSVC', '$routeParams', "$location",'$window', function ($http, DataSVC, $routeParams, $location,$window) {
    var main = this;
    this.userID = $routeParams.id;
    this.user = '';
    
    this.userData = '';
    this.averageScore = '';
    this.averagePercentage = '';
    this.numberOfTestTaken = '';

    if (!angular.fromJson($window.localStorage.currentUser).isAdmin){
        
        $location.path('/dashboard');
}
    
    this.getUserDetail= function () {

        DataSVC.getParticularUser(main.userID).then(function successCallback(response) {
           
            main.userData = response.data.data;
            main.numberOfTestTaken = main.userData.TestsTaken.length;
            var totalScored = 0;
            var totalScore = 0;

            main.userData.TestsTaken.forEach(function (test) {
                totalScore += test.totalPoints;
                totalScored += test.pointsScored;

            });
            if(main.numberOfTestTaken == 0){
                main.averageScore = 0;
            main.averagePercentage = 0;


            }else {
                main.averageScore = (totalScore / (main.numberOfTestTaken)).toFixed(2);
            main.averagePercentage = (totalScored * 100 / totalScore).toFixed(2);

            }
            


            //bar-chart
            var ctxB = document.getElementById("barChart").getContext('2d');
            var data = [];
            var labels = [];
            main.userData.TestsTaken.forEach(function (test) {
                data.push(test.percentage);
                labels.push(test.testId.name);
            });
            var myBarChart = new Chart(ctxB, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '% Percentage',
                        data: data,
                        backgroundColor: '#3F729B',
                        borderColor: '#3F729B',

                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });


           
        }, function errorCallBack(response) {
            console.log("Error");
        });


    };
    this.getUserDetail();
}]);