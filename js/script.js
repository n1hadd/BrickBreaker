function drawIt() {
    var dx = 1;
    var dy = 4;
    var r = 10;
    var canvas = document.getElementById("canvas");
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var x = WIDTH/2;
    var y = HEIGHT/2;
    var ctx;
    var tocke = 0;
    var score = 0;
    var HIGH_SCORE;
    var HIGH_TIME;
    var scores = [];
    

    var ball = new Image();
    ball.src = 'images/ball.png'; 

    
    
    function init() {
        ctx = canvas.getContext("2d");
        return intervalId = setInterval(draw, 10);
        sekunde = 0;
        izpisTimer = "00:00";
        intTimer = setInterval(timer, 1000);
    }

    function win(){
        Swal.fire({
          title: "Congratulations!",
          text: "You have won the game!",
          confirmButtonText: "PLAY AGAIN",
          confirmButtonColor: "#243e67",
          customClass: {
                    title: "custom-title",
                },
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }
    
      function end(){
        Swal.fire({
          title: "Game Over!",
          text: "Sorry, you have lost the game. Better luck next time!",
          confirmButtonText: "TRY AGAIN",
          confirmButtonColor: "#243e67",
          customClass: {
                    title: "custom-title",
                },
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      }


    /*function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }*/

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    //END LIBRARY CODE
    function draw() {
        clear();
        //circle(x, y, 10);
        ctx.drawImage(ball, x, y, 10, 10);
        if (x + dx > (WIDTH - r) || x + dx < (0 + r))
            dx = -dx;
        if (y + dy > (HEIGHT - r) || y + dy < (0 + r))
            dy = -dy;
        x += dx;
        y += dy;
    }
    init();

    var paddlex;
    var paddleh;
    var paddlew;

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 15;
        paddlew = 75;
    }

    
    function draw() {
        clear();
        //circle(x, y, 10);
        ctx.drawImage(ball, x, y, 15, 15);
        //premik ploščice levo in desno
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 5;
            } else {
                paddlex = WIDTH - paddlew;
            }
        } else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        }
        var paddle = new Image();
        paddle.src = 'images/paddle.png';

        //rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
        ctx.drawImage(paddle, paddlex, HEIGHT-paddleh, paddlew,paddleh);

        

        var opeka = new Image();
        opeka.src = 'images/tile_blue.png';

        var opeka2 = new Image();
        opeka2.src = 'images/tile_blue_broken.png';

        


        var hit = false;
        //riši opeke
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if(bricks[i][j] == 2){
                    ctx.drawImage(opeka, (j * (BRICKWIDTH + PADDING)) + 30, (i * (BRICKHEIGHT + PADDING)) + 30, BRICKWIDTH, BRICKHEIGHT);
                }
                else if(bricks[i][j]==1){
                    ctx.drawImage(opeka2, (j * (BRICKWIDTH + PADDING)) + 30, (i * (BRICKHEIGHT + PADDING)) + 30, BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }

        rowheight = BRICKHEIGHT + PADDING + r /2; //Smo zadeli opeko?
        colwidth = BRICKWIDTH + PADDING + r / 2;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        //Če smo zadeli opeko, vrni povratno kroglo in označi
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 2) {
            dy = -dy;
            bricks[row][col] = 1;
            hit = true;
            score +=50;
            $("#score").html(score);
            
        }
        else if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
            dy = -dy;
            bricks[row][col] = 0;
            tocke += 1; //v primeru, da imajo opeko večjo utež lahko prištevate tudi npr. 2 ali 3; pred tem bi bilo smiselno dodati še kakšen pogoj, ki bi signaliziral mesta opek, ki imajo višjo vrednost
            $("#tocke").html(tocke);
            score +=100;
            $("#score").html(score);
            if(tocke == 40){
                win();
            }
            
        }
        


        if (x + dx > WIDTH - r || x + dx < r)
            dx = -dx;
        if (y + dy < 0 + r)
            dy = -dy;
        else if (y + dy > HEIGHT - 3*r) {
            start = false;
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                dy = -dy;
                start = true;
            } else if (y + dy > HEIGHT - 15) {
                clearInterval(intervalId);
                end();
            }
        }
        x += dx;
        y += dy;
    }
    init_paddle();

    var rightDown = false;
    var leftDown = false;

    //nastavljanje leve in desne tipke
    function onKeyDown(evt) {
        if (evt.keyCode == 39)
            rightDown = true;
        else if (evt.keyCode == 37) leftDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 39)
            rightDown = false;
        else if (evt.keyCode == 37) leftDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    var canvasMinX;
    var canvasMaxX;

    function init_mouse() {
        canvasMinX = $("canvas").offset().left;
        canvasMaxX = canvasMinX + WIDTH - paddlew;
    }

    function onMouseMove(evt) {
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            paddlex = evt.pageX - canvasMinX;
        }
    }
    $(document).mousemove(onMouseMove);


    init_mouse();

    
    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 9;
        NCOLS = 7;
        BRICKWIDTH = (WIDTH/NCOLS) - 10;
        BRICKHEIGHT = 25;
        PADDING = 1;
        bricks = new Array(NROWS);
        var TARGET = NROWS * NCOLS-23;
        $("#target").html(TARGET);
        for (i=0; i < NROWS; i++) {
          bricks[i] = new Array(NCOLS);
          for (j=0; j < NCOLS; j++) {
            if(i == 0 && j==3 || i == 1 && j== 1 ||i == 1 && j==5 ||i == 2 && j==0 ||i == 2 && j==3 ||i == 2 && j==6 ||i == 3 && j== 2||i == 3 && j==3 ||i == 3 && j==4 ||i == 4 && j== 1 ||i == 4 && j==2 ||i == 4 && j==3 ||i == 4 && j==4 ||i == 4 && j==5 ||i == 5 && j==2 ||i == 5 && j==3 ||i == 5 && j==4 ||i == 6 && j==0 ||i == 6 && j==3 ||i == 6 && j== 6||i == 7 && j== 1 ||i == 7 && j==5 ||i == 8 && j==3 ){
                bricks[i][j] = 0;
            }
            else{
                bricks[i][j] = 2;
            }
        }
        }
      }
      initbricks();
    
    //timer
    var sekunde = 0;
    var sekundeI;
    var minuteI;
    var intTimer;
    var izpisTimer;
    var start = true;
    //timer
    function timer() {
        if (start == true) {
            sekunde++;
            sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
            minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
            izpisTimer = minuteI + ":" + sekundeI;
            $("#cas").html(izpisTimer);
        } else {
            sekunde = 0;
            //izpisTimer = "00:00";
            $("#cas").html(izpisTimer);
        }
    }
    setInterval(timer, 1000);
}