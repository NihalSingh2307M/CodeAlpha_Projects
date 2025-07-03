let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');

let string = "";
let arr = Array.from(buttons);

arr.forEach(button => {
    button.addEventListener('click', (e) =>{
        handleInput(e.target.innerHTML);
    });
});


document.addEventListener('keydown', (e) => {
    const key = e.key;

   
    if(/[0-9+\-*/.]/.test(key)) {
        string += key;
        input.value = string;
    }

 
    else if(key === 'Enter') {
        try {
            string = eval(string);
        } catch {
            string = "Error";
        }
        input.value = string;
    }

   
    else if(key === 'Backspace') {
        string = string.substring(0, string.length - 1);
        input.value = string;
    }

    
    else if(key === 'Escape') {
        string = "";
        input.value = string;
    }
});

function handleInput(value) {
    if(value == '='){
        try {
            string = eval(string);
        } catch {
            string = "Error";
        }
        input.value = string;
    }
    else if(value == 'AC'){
        string = "";
        input.value = string;
    }
    else if(value == 'DEL'){
        string = string.substring(0, string.length-1);
        input.value = string;
    }
    else{
        string += value;
        input.value = string;
    }
}
