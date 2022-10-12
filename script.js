const gameObj = (() => {
    const gameboard = [];

    const nullCounter = () => {
        return gameboard.filter(e => e == null);
    }

    //get the boxes' data attributes and push them to gameboard array above
    const getBoxes = () => {

        document.querySelectorAll('.gameboard > div')
            .forEach(box => gameboard.splice(Number(box.getAttribute('data-box')), 1, Number(box.getAttribute('data-box'))));
    };

    return {
        gameboard,
        nullCounter,
        getBoxes,
    }
})();

gameObj.getBoxes();
//factory function for creating player objects
const player = () => {

    let playerIsActive = null;

    const markedBoxes = [];

    return {
        playerIsActive,
        markedBoxes,
    }
}

//create players
const player1 = player();
const player2 = player();

//control players' turns
const gameFlow = (() => {
    
    //set player turn
    const setTurn = (() => {
        player1.playerIsActive = true;
        player2.playerIsActive = false;
    })();

    //switch turn when board is marked
    const changeTurn = () => {
        if(!(gameObj.nullCounter().length % 2 == 0)) {
            player1.playerIsActive = false;
            player2.playerIsActive = true;
        }
        if(gameObj.nullCounter().length % 2 == 0) {
            player1.playerIsActive = true;
            player2.playerIsActive = false;
        }
    }

    return {
        changeTurn,
    }
})();

const gameLogic = (() => {

    //process input
    const processInput = (e) => {
        //get the target box data attribute number
        const boxNumber = e.target.getAttribute('data-box');

        //check if target box's number attribute is inside the gameboard array
        const isActive = gameObj.gameboard.includes(Number(boxNumber));
        
        //if it is inside the array, remove it and replace with null
        //when a box with null data attribute is clicked, the code below won't execute
        //this is to ensure that a box won't be processed twice
        if(isActive == true) {
            gameObj.gameboard.splice(boxNumber, 1, null);
            assignBox(boxNumber);
            determineWinner();
            console.log(player1.markedBoxes, player2.markedBoxes)
            // console.log(player1.playerIsActive, player2.playerIsActive);
            // console.log(gameObj.nullCounter().length)
            gameFlow.changeTurn();
        }
    }

    //event: get input from client that the above function will process
    const getInput = (() => {
        document.querySelector('.gameboard').addEventListener('click', processInput);
    })();

    //assign box attrribute to players
    const assignBox = (boxNumber) => {
        if(player1.playerIsActive == true) {
            player1.markedBoxes.push(boxNumber);
        }
        if(player2.playerIsActive == true) {
            player2.markedBoxes.push(boxNumber);
        }
    }

    //a player must have at least one of these combinations in ther markedBoxes array to win
    const winningConditions = [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],
        ['0', '4', '8'],
        ['2', '4', '6'],
    ]

    const determineWinner = () => {
        //only executes after four turns
        if(gameObj.nullCounter().length > 4) {
            let didPlayer1Win, didPlayer2Win = null;
            
            //checks if player 1's marked boxes matches any of the winning conditions
            winningConditions.forEach(arr => {
                let counter = 0;
                arr.forEach(item => {
                    for(let i = 0; i < player1.markedBoxes.length; i++) {
                        if(item == player1.markedBoxes[i]) counter++;
                    }
                })
                if(counter > 2) didPlayer1Win = true;
            });
            
            //checks if player 2's marked boxes matches any of the winning conditions
            winningConditions.forEach(arr => {
                let counter = 0;
                arr.forEach(item => {
                    for(let i = 0; i < player2.markedBoxes.length; i++) {
                        if(item == player2.markedBoxes[i]) counter++;
                    }
                })
                if(counter > 2) didPlayer2Win = true;
            });

            //alert winner if one of the players matched one of the winning conditions
            if(didPlayer1Win == true) {
                clearObjects();
            };
            if(didPlayer2Win == true) {
                clearObjects();
            };
        }
    }

    //clear gameboard array and player marked boxes array when the game is over
    const clearObjects = () => {
        gameObj.getBoxes();
        player1.markedBoxes = [];
        player2.markedBoxes = [];
    }
})();

// const ui = (() => {

// })();