const gameObj = (() => {

    const gameboard = [];
    const boxes = document.querySelectorAll('.gameboard > div');

    //for controlling game logic and game flow
    const nullCounter = () => {
        return gameboard.filter(e => e == null);
    }

    const getBoxes = () => {
        //this replaces the previous items in the gameboard array
        boxes.forEach(box => gameboard.splice(Number(box.getAttribute('data-box')), 1, Number(box.getAttribute('data-box'))));
    };

    return {
        gameboard,
        boxes,
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

    let matchedArray = null;

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
            ui.markBoard(e);
            isGameOver();
            // console.log(player1.markedBoxes, player2.markedBoxes);
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
        
        let didPlayer1Win = false;
        let didPlayer2Win = false;

        const determineWinner = (playerX) => {
            let didPlayerWin = false;
            //loop through winning conditions array
            winningConditions.forEach((arr, index) => {
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
                if(counter > 2) {
                    didPlayerWin = true;
                    matchedArray = index;
                };
            });
            return didPlayerWin;
        }

        //only executes after four turns
        if(gameObj.nullCounter().length > 4) {

            if(didPlayer2Win == false) didPlayer1Win = determineWinner(player1);
            if(didPlayer1Win == false) didPlayer2Win = determineWinner(player2);

            //log winner if one of the players matched one of the winning conditions
            if(didPlayer1Win == true) {
                clearBoard();
                console.log('Player 1 Wins!')
            };
            if(didPlayer2Win == true) {
                clearBoard();
                console.log('Player 2 Wins!')
            };
            //log draw if no player matched one of the winning conditions
            if(didPlayer1Win == false && didPlayer2Win == false && gameObj.nullCounter().length == 9) {
                clearBoard();
                console.log('Draw!')
            }
        }
    }

    //clear gameboard array and player marked boxes array when the game is over
    const clearBoard = () => {
        gameObj.getBoxes();
        player1.markedBoxes = [];
        player2.markedBoxes = [];
        ui.highlightWin();
    }

    const getWinningBoxes = () => {
        return winningConditions[matchedArray];
    }

    return {
        getWinningBoxes,
        getInput,
    }

})();

const ui = (() => {

    const markBoard = (e) => {
           if(e.target.parentElement.classList.contains('gameboard')) {
                if(player1.isActive == true) e.target.textContent = 'X';
                if(player2.isActive == true) e.target.textContent = 'O';
            }
    }

    const highlightWin = () => {
        const arr = gameLogic.getWinningBoxes();
        let nodes = [];
        for(let i = 0; i < arr.length; i++) {
            nodes.push(document.querySelector(`[data-box="${arr[i]}"]`));
        }
        nodes.forEach(e => {
            e.classList.add('win');
        })
    }

    const removeMarks = () => {
        removeEventListener('click', gameLogic.getInput);
    }

    return {
        markBoard,
        highlightWin,
        removeMarks,
    }
})();