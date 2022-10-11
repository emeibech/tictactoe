const gameObj = (() => {
    const _gameboard = [];

    //get the boxes' data attributes and push them to gameboard array
    const getBoxes = (() => {
        document.querySelectorAll('.gameboard > div')
            .forEach(box => _gameboard.push(Number(box.getAttribute('data-box'))));
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
        const isActive = _gameboard.includes(Number(boxNumber));
        
        //if target box's number is inside the array, remove it and replace with null
        if(isActive == true) {
            _gameboard.splice(boxNumber, 1, null);
            console.log(e.target)
        }
    }

    return {
        getBoxes,
        _gameboard,
        getInput,
        processInput
    }
})();

const player = (playerName) => {
    
}

gameObj.getInput();