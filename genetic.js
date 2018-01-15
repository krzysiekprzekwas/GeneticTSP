var isRunning = false;

var points = [];
var dna = [];
var bestDna = [];
var popSize = 1000;
var mutationRate = 0.20;

var fakeDna = [];

var generationsPerformance = [];

var population = [];
var fittness = [];

var currentDistance;;
var bestDistance;

//Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function swap(a, i, j)
{
	var tmp = a[i];
	a[i] = a[j];
	a[j] = tmp;
}

function normalizeFittness()
{
	var sum = 0;
	for (var i =0;i < popSize; ++i)
	{
		sum += fittness[i];
	}
	
	
	for (var i =0;i < popSize; ++i)
	{
		fittness[i] = fittness[i]/sum;
	}
}	

function pickOne(pop, prob)
{
	var index = 0;
	var r = Math.random(1);
	
	while (r>0)
	{
		r -= prob[index];
		index++;
	}
	
	index--;
	return pop[index].slice();
}

function mutate(order)
{
	var indexA = Math.floor(Math.random(order.length));
	var indexB = Math.floor(Math.random(order.length));
	
	swap(order,indexA,indexB);
}

function nextGeneration()
{
	var newPopulation = [];
	for (var i =0;i < popSize; ++i)
	{
		var ord = pickOne(population,fittness);
		mutate(ord);
		newPopulation[i] = ord;
	}
	
	population=newPopulation;
}

function evolve()
{
	
	fakeDna = shuffle(fakeDna);
		
		var d = calcDistance(fakeDna);
		
		redrawPoints(document.getElementById('currentAlgorithmPlot'),fakeDna);
		
		if(d < bestDistance)
		{
			bestDistance = d;
			document.getElementById("bestDistance").innerHTML = bestDistance;
			bestDna = fakeDna.slice();
			redrawPoints(document.getElementById('bestAlgorithmPlot'),bestDna);
		}
	
	//for (var i =0;i < popSize; ++i)
	//{
		
		//fittness[i] = 1/d;
	//}
	
	// normalizeFittness();
	
	// generationsPerformance.push(bestDistance);
	
	// nextGeneration();	
}

function plotProgress()
{
	var trace1 = {
  x: generationsPerformance,
  type: 'lines'
};
	var data = [trace1];

	Plotly.newPlot('preformanceAlgorithmPlot', data);
}

function StartAlgorithm() {
	isRunning = true;
	
	bestDistance = Infinity ;
	document.getElementById("bestDistance").innerHTML = bestDistance;
	
	
	for (var i =0;i < points.length; ++i)
	{
		dna.push(i);
	}
	
	for (var i =0;i < popSize; ++i)
	{
		dna = shuffle(dna);
		fakeDna = dna;
		population[i] = dna.slice();
	}
	plotProgress();
	setInterval(evolve,0);
	
}

function calcDistance(dnaArray){
	var sum = 0;
	for (var i=0;i < dnaArray.length-1; ++i)
		sum += Math.hypot(points[dna[i]][0]-points[dna[i+1]][0], points[dna[i]][1]-points[dna[i+1]][1]);
	return sum;
}

function redrawPoints(canvas, dna) {
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var i=0;i < dna.length; ++i)
	{
		ctx.fillStyle = "#34e54f"; 

		ctx.beginPath(); //Start path
		ctx.arc(points[dna[i]][0], points[dna[i]][1], 3, 0, Math.PI * 2, true);
		ctx.fill();
	}
	
	ctx.beginPath(); //Start path
	ctx.moveTo(points[dna[0]][0],points[dna[0]][1]);
	for (var i=1;i < dna.length; ++i)
	{
		ctx.lineTo(points[dna[i]][0], points[dna[i]][1]);
	}
	
	ctx.stroke();
}


function onDown(event){
	if (isRunning)
		return;
	
	var canvas = document.getElementById(event.target.id);
	
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top; 
     
	points.push([x,y])
	
	var ctx = canvas.getContext('2d');
	
	ctx.fillStyle = "#34e54f"; 

    ctx.beginPath(); //Start path
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.fill();
	
	document.getElementById("points").innerHTML += " | " + x + " " + y;
	
}


function createCanvases() {
	var bstAlPl = document.getElementById('bestAlgorithmPlot');
	var context = bstAlPl.getContext('2d');
	bstAlPl.addEventListener('mousedown',onDown,false);
}
window.onload = createCanvases;