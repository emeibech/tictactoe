const gameObj = (() => {
    const gameboard = [];

    //get the boxes' data attributes and push them to gameboard array
    const getBoxes = (() => {
        document.querySelectorAll('.gameboard > div')
            .forEach(box => gameboard.push(Number(box.getAttribute('data-box'))));
    })();

    //event: get input from client
    const getInput = () => {
        document.querySelector('.gameboard').addEventListener('click', processInput);
    }

    //process input
    const processInput = (e) => {
        //get the target box data attribute number
        const boxNumber = e.target.getAttribute('data-box');

        //check if target box's number is inside the gameboard array
        const isActive = gameboard.includes(Number(boxNumber));
        
        //if target box's number is inside the array, remove it and replace with null
        if(isActive == true) {
            gameboard.splice(boxNumber, 1, null);
            console.log(e.target);
            gameFlow.changeTurn();
            console.log(player1.playerIsActive)
            console.log(player2.playerIsActive)
        }
    }

    return {
        getBoxes,
        gameboard,
        getInput,
        processInput,
    }
})();

const player = () => {

    let playerIsActive = null;

    const markedBox = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
    }

    const playerMove = (e) => {
        console.log(e.target.getAttribute('data-box'));
    }

    return {
        playerIsActive,
        markedBox,
        playerMove,
    }
}

//create players
const player1 = player();
const player2 = player();

const gameFlow = (() => {
    
    //set player turn
    const setTurn = (() => {
        player1.playerIsActive = true;
        player2.playerIsActive = false;
    })();

    //swicth turn when board is marked
    const changeTurn = () => {
        const nullCounter = gameObj.gameboard.filter(e => e == null);
        if(!(nullCounter.length % 2 == 0)) {
            console.log('hey')
            player1.playerIsActive = false;
            player2.playerIsActive = true;
        }
        if(nullCounter.length % 2 == 0) {
            player1.playerIsActive = true;
            player2.playerIsActive = false;
        }
    }

    return {
        changeTurn,
    }
})();

gameObj.getInput();