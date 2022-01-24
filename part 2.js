board_phase = JXG.JSXGraph.initBoard('jxgbox-phase', {
  boundingbox: [-5, 50, 50, -5],
  axis: true,
  grid: false,
  showCopyright: false
});

alpha_slider_p = board_phase.createElement('slider', [
  [3.0, 45.0],
  [8.0, 45.0],
  [0.0, 0.42, 1.0]
], {
  name: 'a',
  strokeColor: 'black',
  fillColor: 'black'
});
alpha_text_p = board_phase.createElement('text', [5, 43.0, "a"], {
  fixed: true
});

beta_slider_p = board_phase.createElement('slider', [
  [13.0, 45.0],
  [18.0, 45.0],
  [0.0, 0.14, 1.0]
], {
  name: 'b',
  strokeColor: 'black',
  fillColor: 'black'
});
beta_text_p = board_phase.createElement('text', [15, 43.0, "b"], {
  fixed: true
});

gamma_slider_p = board_phase.createElement('slider', [
  [23.0, 45.0],
  [28.0, 45.0],
  [0.0, 0.79, 1.0]
], {
  name: 'c',
  strokeColor: 'black',
  fillColor: 'black'
});
gamma_text_p = board_phase.createElement('text', [25, 43.0, "c"], {
  fixed: true
});

delta_slider_p = board_phase.createElement('slider', [
  [33.0, 45.0],
  [38.0, 45.0],
  [0.0, 0.17, 1.0]
], {
  name: 'd',
  strokeColor: 'black',
  fillColor: 'black'
});
delta_text_p = board_phase.createElement('text', [35, 43.0, "d"], {
  fixed: true
});

prey_0 = board_phase.createElement('glider', [10, 0, board_phase.defaultAxes.x], {
  name: 'Preys',
  strokeColor: 'blue',
  fillColor: 'blue'
});
pred_0 = board_phase.createElement('glider', [0, 5, board_phase.defaultAxes.y], {
  name: 'Predators',
  strokeColor: 'red',
  fillColor: 'red'
});

info = ['a - the likelihood of fertility preys <br><br> b - the likelihood of victims when meeting a predator <br><br> c - the likelihood of the loss of predators with a lack of food <br><br> d - the likelihood of food for breeding sufficiency of predators'];

board_phase.create('legend', [20, 33], {labels: info, colors: 'blue', strokeWidth:25} );

var draw_data = null;

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

  return data
}


function ode_phase() {
  var I_phase = [0, 200];
  var N_phase = 5000;

  var f_phase = function(v_phase, p_phase) {
    var a = alpha_slider_p.Value();
    var b = beta_slider_p.Value();
    var c = gamma_slider_p.Value();
    var d = delta_slider_p.Value();

    var y_phase = [];

    var dv, dp;
    dv = v_phase * (a - b * p_phase);
    dp = p_phase * (-c + d * v_phase);

    return [dv, dp];
  };

  var x0_phase = [prey_0.X(), pred_0.Y()];

  var data_phase = solve_ode(x0_phase, I_phase, N_phase, f_phase);

  return data_phase;
}

var data_phase = ode_phase();

var prey_data = [];
var pred_data = [];

for (let i = 0; i < data_phase.length; ++i) {
  prey_data.push(data_phase[i][0]);
  pred_data.push(data_phase[i][1]);
}

draw_data = board_phase.createElement('curve', [prey_data, pred_data], {
  strokeColor: '#ff6600',
  strokeWidth: '2px'
});
draw_data.updateDataArray = function() {
  var func_data = ode_phase();
  this.dataX = [];
  this.dataY = [];

  for (let i = 0; i < func_data.length; ++i) {
    this.dataX[i] = func_data[i][0];
    this.dataY[i] = func_data[i][1];
  }
};
