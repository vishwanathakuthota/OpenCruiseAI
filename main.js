
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carImage = new Image();
carImage.src = "car_topview.svg"; // Path to your SVG image

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);



const N = 1;
const cars = generateCars(N);

const savedBrain ={"levels":[{"inputs":[0,0,0,0,0.44562833595619755],"outputs":[0,1,1,0,0,1],"biases":[0.36100927621041445,-0.27756199116591895,-0.27326553600080605,0.21665174076580831,0.11875289633131743,-0.2732879424990858],"weights":[[-0.34607937779937425,-0.3886921178163049,0.5654070215651136,-0.23212680183030263,0.28904916805281716,-0.2164429332971871],[-0.5648330008149122,0.3837136186689996,0.3841941646169799,-0.17485493150383455,-0.45070581839548013,-0.48013162464677794],[0.1149405835051982,0.10071255027072798,0.3787995721135369,-0.026008690442152586,0.5784733406209249,-0.8350080525211196],[0.36847397363105283,-0.34164847645731794,-0.2744412465985897,0.13908654783013938,0.4352365686597979,0.3559789714589783],[-0.663449933807667,0.5383326588828454,-0.5414993577752283,0.2606862556930554,-0.3566456049500157,0.3679257002091365]]},{"inputs":[0,1,1,0,0,1],"outputs":[1,1,1,0],"biases":[0.23014061360391763,-0.3880226796880491,-0.62659608634341,0.5349491244140105],"weights":[[-0.12036805233218835,-0.18643508466995487,0.07188711433424282,0.10062107888514588,-0.10901695549042277,0.04733947448186526],[0.4432506664080679,-0.19797601565766593,-0.29338847279706753,0.406093803054641,-0.07868425592797923,0.008771110753734317],[-0.1706345264093358,-0.4784105560304507,0.08807740760844675,-0.0438320887829364,0.05642823613879486,0.08370554685181927],[-0.43277729103345186,-0.003816006404640658,0.577252586849365,0.5326207998391103,0.0764781603330121,0.1868185321857438],[0.6453316293832989,-0.045477324426544966,-0.11606768476083386,-0.3771180069607818,0.0650097276343684,0.12378207741432624],[0.31763702166857055,0.451282517065855,-0.37631308061947233,-0.5984685913605748,-0.07842849825420017,0.09766469966014364]]}]}
for (let i = 0; i < cars.length; i++) {
    cars[i].brain = savedBrain;
    if (i != 0) {
        NeuralNetwork.mutate(cars[i].brain, 0.03);
    }
}


const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -1100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -1300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -1500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -1700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -1900, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -2100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -2100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -2300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -2500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -2500, 30, 50, "DUMMY", 2),



    
];

animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
    
    
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars = [];
    for (let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    
    for (let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders,[]);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

     bestCar = cars.find(
        c => c.y == Math.min(
            ...cars.map(c => c.y)
        ));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx,"red");
    }

    carCtx.globalAlpha = 0.2;

    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }

    carCtx.globalAlpha = 1;

    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
};
