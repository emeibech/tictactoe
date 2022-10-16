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

    const clearObj = () => {
        player1.markedBoxes.splice(0, player1.markedBoxes.length)
        player2.markedBoxes.splice(0, player2.markedBoxes.length)
        gameObj.getBoxes();
        gameFlow.setTurn();
    }

    const getPlayerNames = (e) => {
        e.preventDefault();
        player1.name = document.querySelector('#player1').value;
        player2.name = document.querySelector('#player2').value;
        ui.exitForm();
    }

    return {
        gameboard,
        boxes,
        nullCounter,
        getBoxes,
        clearObj,
        getPlayerNames,
    }
})();

//factory function for creating player objects
const player = (name) => {

    let isActive = null;

    const markedBoxes = [];

    return {
        name,
        isActive,
        markedBoxes,
    }
}

let player1 = player(`Player 1`);
let player2 = player(`Player 2`);

//control players' turns
const gameFlow = (() => {
    
    const setTurn = () => {
        player1.isActive = true;
        player2.isActive = false;
    };

    //switch turn when board is marked
    const changeTurn = () => {
        if(!(gameObj.nullCounter().length % 2 == 0)) {
            player1.isActive = false;
            player2.isActive = true;
        }
        if(gameObj.nullCounter().length % 2 == 0 || gameObj.nullCounter().length == 0) {
            player1.isActive = true;
            player2.isActive = false;
        }
    }

    return {
        changeTurn,
        setTurn,
    }
})();

const gameLogic = (() => {

    let matchedArray = null;
    let didPlayer1Win = null;
    let didPlayer2Win = null;

    const processInput = (e) => {
        const boxNumber = e.target.getAttribute('data-box');
        if(typeof boxNumber === 'string') {

            //check if target box's number is still inside the gameboard array
            const isNotTaken = gameObj.gameboard.includes(Number(boxNumber));
            
            //if it is inside the array, remove it and replace with null
            //when a box with null data attribute is clicked, the code below won't execute
            if(isNotTaken == true) {
                gameObj.gameboard.splice(boxNumber, 1, null);
                assignBox(boxNumber);
                ui.markBoard(e);
                gameFlow.changeTurn();
            }
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
        determineWinner();
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
    
    const matchBoxes = (playerX) => {
        let didPlayerWin = null;
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

    const determineWinner = () => {
        if(didPlayer2Win == null) didPlayer1Win = matchBoxes(player1);
        if(didPlayer1Win == null) didPlayer2Win = matchBoxes(player2);
        winner();
    }

    const winner = () => {
        if(didPlayer1Win === true) {
            ui.highlightWin();
            ui.overlay();
            ui.displayResult();
            document.querySelector('.overlay').addEventListener('click', ui.clearBoard);
        };
        if(didPlayer2Win === true) {
            ui.highlightWin();
            ui.overlay();
            ui.displayResult();
            document.querySelector('.overlay').addEventListener('click', ui.clearBoard);
        };
        if(gameObj.nullCounter().length === 9 && didPlayer1Win === null && didPlayer2Win === null) {
            ui.overlay();
            ui.displayResult();
            document.querySelector('.overlay').addEventListener('click', ui.clearBoard);
        }
    }

    const getWinner = () => {
        if(didPlayer1Win == true) {
            return player1;
        };
        if(didPlayer2Win == true) {
            return player2;
        };
        if(gameObj.nullCounter().length == 9) {
            return null;
        }
    }

    const getWinningBoxes = () => {
        return winningConditions[matchedArray];
    }

    return {
        getWinningBoxes,
        determineWinner,
        getWinner,
    }

})();

const ui = (() => {

    const container = document.createElement('div');

    const markBoard = (e) => {
           if(typeof e.target.getAttribute(`data-box`) === 'string') {
                if(player1.isActive == true) e.target.textContent = 'X';
                if(player2.isActive == true) e.target.textContent = 'O';
            }
    }

    const highlightWin = () => {
        const arr = gameLogic.getWinningBoxes();
        if(arr) {
            let nodes = [];
            for(let i = 0; i < arr.length; i++) {
                nodes.push(document.querySelector(`[data-box="${arr[i]}"]`));
            }
            nodes.forEach(e => {
                e.classList.add('win');
            })
        }
    }

    const overlay = () => {
        container.classList.add('overlay');
        const aside = document.querySelector('.gameboard aside');
        gameObj.boxes[0].parentElement.insertBefore(container, aside);
    }

    const displayResult = () => {
            const result = (player) => {
                if(player !== null && player.hasOwnProperty('name')) {
                    const body = document.querySelector('body');
                    const para = document.createElement('p');
                    para.textContent = `${player.name} Wins!`;
                    para.classList.add('result');
                    body.appendChild(para);
                }
                if(player === null) {
                    const body = document.querySelector('body');
                    const para = document.createElement('p');
                    para.textContent = 'Draw!';
                    para.classList.add('result');
                    body.appendChild(para);
                }
            }

            result(gameLogic.getWinner());
    }

    const clearBoard = () => {
        gameObj.boxes.forEach(item => {
            item.textContent = '';
            item.classList.remove('win');
        })
        const result = document.querySelector('.result');
        const overlay = document.querySelector('.overlay');
        if(result !== null && overlay !== null) {
            document.querySelector('body').removeChild(result);
            document.querySelector('.gameboard').removeChild(overlay);
        }
        
        gameObj.clearObj();
    }

    const exitForm = () => {
        document.querySelector('.form-group').classList.add('hide-form');
    }

    const showForm = () => {
        document.querySelector('.form-group').classList.remove('hide-form');
    }

    return {
        markBoard,
        highlightWin,
        overlay,
        displayResult,
        clearBoard,
        exitForm,
        showForm,
    }
})();

document.addEventListener('DOMContentLoaded', gameFlow.setTurn);
document.addEventListener('DOMContentLoaded', gameObj.getBoxes);
document.querySelector('.reset').addEventListener('click', ui.clearBoard);
document.querySelector('.exit').addEventListener('click', ui.exitForm);
document.querySelector('.change-name').addEventListener('click', ui.showForm);
document.querySelector('.form-group form').addEventListener('submit', gameObj.getPlayerNames);