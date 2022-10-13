const gameObj = (() => {

    const gameboard = [];

    //useful for controlling game logic and game flow
    const nullCounter = () => {
        return gameboard.filter(e => e == null);
    }

    const getBoxes = () => {
        //this replaces the previous items in the gameboard array
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

    let isActive = null;

    let markedBoxes = [];

    return {
        isActive,
        markedBoxes,
    }
}

const player1 = player();
const player2 = player();

//control players' turns
const gameFlow = (() => {
    
    const setTurn = (() => {
        player1.isActive = true;
        player2.isActive = false;
    })();

    //switch turn when board is marked
    const changeTurn = () => {
        if(!(gameObj.nullCounter().length % 2 == 0)) {
            player1.isActive = false;
            player2.isActive = true;
        }
        if(gameObj.nullCounter().length % 2 == 0) {
            player1.isActive = true;
            player2.isActive = false;
        }
    }

    return {
        changeTurn,
    }
})();

const gameLogic = (() => {

    const processInput = (e) => {
        //get target box number attribute
        const boxNumber = e.target.getAttribute('data-box');

        //check if target box's number is still inside the gameboard array
        const isNotTaken = gameObj.gameboard.includes(Number(boxNumber));
        
        //if it is inside the array, remove it and replace with null
        //when a box with null data attribute is clicked, the code below won't execute
        if(isNotTaken == true) {
            gameObj.gameboard.splice(boxNumber, 1, null);
            assignBox(boxNumber);
            isGameOver();
            console.log(player1.markedBoxes, player2.markedBoxes);
            gameFlow.changeTurn();
        }
    }

    //event: get input from client that the above function will process
    const getInput = (() => {
        document.querySelector('.gameboard').addEventListener('click', processInput);
    })();

    //assign box number attrribute to players
    const assignBox = (boxNumber) => {
        if(player1.isActive == true) {
            player1.markedBoxes.push(boxNumber);
        }
        if(player2.isActive == true) {
            player2.markedBoxes.push(boxNumber);
        }
    }

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

    const isGameOver = () => {

        const determineWinner = (playerX) => {
            let didPlayerWin = false;
            //loop through winning conditions array
            winningConditions.forEach(arr => {
                let counter = 0;
                //loop through the items of each array inside winning conditions array
                arr.forEach(item => {
                    //also loop through player's marked boxes array
                    for(let i = 0; i < playerX.markedBoxes.length; i++) {
                        //if an item in one of the winning conditions array matches
                        // with player's marked boxes array, increment counter
                        if(item == playerX.markedBoxes[i]) counter++;
                    }
                })
                //counter will only be more than two if a player picked all three items
                //inside one of the winning conditions array
                if(counter > 2) didPlayerWin = true;
            });
            return didPlayerWin;
        }

        //only executes after four turns
        if(gameObj.nullCounter().length > 4) {
            let didPlayer1Win, didPlayer2Win = false;

            if(didPlayer2Win == false) didPlayer1Win = determineWinner(player1);
            if(didPlayer1Win == false) didPlayer2Win = determineWinner(player2);

            //log winner if one of the players matched one of the winning conditions
            if(didPlayer1Win == true) {
                clearObjects();
                console.log('Player 1 Wins!')
            };
            if(didPlayer2Win == true) {
                clearObjects();
                console.log('Player 2 Wins!')
            };
            //log draw if no player matched one of the winning conditions
            if(didPlayer1Win == false && didPlayer2Win == false && gameObj.nullCounter().length == 9) {
                clearObjects();
                console.log('Draw!')
            }
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