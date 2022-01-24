// Loading and initializing the board ...
board = JXG.JSXGraph.initBoard('jxgbox', {
  boundingbox: [-4, 40.5, 95.5, -3.5],
  axis: true,
  grid: false,
  showCopyright: false
});


a_slider = board.createElement('slider', [
  [10.0, 38.5],
  [20.0, 38.5],
  [0.0, 0.3, 1.0]
], {
  name: 'a',
  strokeColor: 'black',
  fillColor: 'black'
});
a_text = board.createElement('text', [14, 37.5, "a"], {
  fixed: true
});

b_slider = board.createElement('slider', [
  [30.0, 38.5],
  [40.0, 38.5],
  [0.0, 0.28, 1.0]
], {
  name: 'b',
  strokeColor: 'black',
  fillColor: 'black'
});
b_text = board.createElement('text', [34, 37.5, "b"], {
  fixed: true
});

c_slider = board.createElement('slider', [
  [50.0, 38.5],
  [60.0, 38.5],
  [0.0, 0.7, 1.0]
], {
  name: 'c',
  strokeColor: 'black',
  fillColor: 'black'
});
c_text = board.createElement('text', [54, 37.5, "c"], {
  fixed: true
});

d_slider = board.createElement('slider', [
  [70.0, 38.5],
  [80.0, 38.5],
  [0.0, 0.3, 1.0]
], {
  name: 'd',
  strokeColor: 'black',
  fillColor: 'black'
});
d_text = board.createElement('text', [74, 37.5, "d"], {
  fixed: true
});


// Add point to preys...
startprey = board.createElement('glider', [0, 10, board.defaultAxes.y], {
  name: 'Preys',
  strokeColor: 'blue',
  fillColor: 'blue'
});

// Add point to predators...
startpred = board.createElement('glider', [0, 5, board.defaultAxes.y], {
  name: 'Predators',
  strokeColor: 'purple',
  fillColor: 'purple'
});

info = ['a - the likelihood of fertility preys <br><br> b - the likelihood of victims when meeting a predator <br><br> c - the likelihood of the loss of predators with a lack of food <br><br> d - the likelihood of food for breeding sufficiency of predators'];

board.create('legend', [8, 31], {labels: info, colors: 'blue', strokeWidth:25} );


var g3 = null;
var g4 = null;


// x0 - number of predators and preys(on y-axis).
// data contains the number of predators and prey...
function solve_ode(x0, I, N, f) {
  var data = [x0];
  
  var h = (I[1] - I[0]) / N;
  
  var x_0 = x0[0];
  var x_1 = x0[1];

  for (let i = 1; i < N; ++i) {


    k1_0 = h * f(data[i - 1][0], data[i - 1][1])[0];
    
    k2_0 = h * f(data[i - 1][0] + 0.5 * h, data[i - 1][1] + 0.5 * k1_0)[0];

    k3_0 = h * f(data[i - 1][0] + 0.5 * h, data[i - 1][1] + 0.5 * k2_0)[0];

    k4_0 = h * f(data[i - 1][0] + h, data[i - 1][1] + k3_0)[0];

  
    k1_1 = h * f(data[i - 1][0], data[i - 1][1])[1];

    k2_1 = h * f(data[i - 1][0] + 0.5 * h, data[i - 1][1] + 0.5 * k1_1)[1];

    k3_1 = h * f(data[i - 1][0] + 0.5 * h, data[i - 1][1] + 0.5 * k2_1)[1];

    k4_1 = h * f(data[i - 1][0] + h, data[i - 1][1] + k3_1)[1];

    // # Обновить следующее значение y
    // y = y + (1.0 / 6.0)*(k1 + 2 * k2 + 2 * k3 + k4)

    var dx_dt = data[i - 1][0] + (1.0 / 6.0)*(k1_0 + 2 * k2_0 + 2 * k3_0 + k4_0);

    var dy_dt = data[i - 1][1] + (1.0 / 6.0)*(k1_1 + 2 * k2_1 + 2 * k3_1 + k4_1);


    data.push([dx_dt, dy_dt]);


  }

  return data;
}



function ode() {
  var I = [0, 100];
  var N = 1000;

  var f = function(v, p) {
    var a = a_slider.Value();
    var b = b_slider.Value();
    var c = c_slider.Value();
    var d = d_slider.Value();

    var dv, dp;
    dv = v * (a - b * p);
    dp = p * (-c + d * v);

    return [dv, dp];
  };

  // initial state of the number of animals...
  var x0 = [startprey.Y(), startpred.Y()];

  var data = solve_ode(x0, I, N, f);

  var q = I[0];
  var h = (I[1] - I[0]) / N;
  for (let i = 0; i < data.length; i++) {
    data[i].push(q);
    q += h;
  }

  return data;
}


var data = ode();

var t = [];
var dataprey = [];
var datapred = [];
for (var i = 0; i < data.length; i++) {
  dataprey[i] = data[i][0];
  datapred[i] = data[i][1];
  t[i] = data[i][2];
}

g3 = board.createElement('curve', [t, datapred], {
  strokeColor: 'purple',
  strokeWidth: '2px'
});
g3.updateDataArray = function() {
  var data = ode();
  this.dataX = [];
  this.dataY = [];
  for (let i = 0; i < data.length; i++) {
    this.dataX[i] = t[i];
    this.dataY[i] = data[i][1];
  }
};

g4 = board.createElement('curve', [t, dataprey], {
  strokeColor: 'blue',
  strokeWidth: '2px'
});
g4.updateDataArray = function() {
  var data = ode();
  this.dataX = [];
  this.dataY = [];
  for (let i = 0; i < data.length; i++) {
    this.dataX[i] = t[i];
    this.dataY[i] = data[i][0];
  }
};
