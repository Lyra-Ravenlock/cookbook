document.addEventListener('DOMContentLoaded', function() {

    // Event Listeners

    // Edit toggle
    const editIngredientsButton = document.querySelector("#edit-ingredients");
    editIngredientsButton.addEventListener('click', () => toggle());
    
    // Toggle the text of the button according to the occassion (for pages with strings or edited pages)
    const btnText = document.querySelector('#edit-ingredients').innerHTML;
        
    // Calculate Toggle (only apprears on recipes with structured data)
    const calctoggle = document.querySelector("#calculate-toggle");
    calctoggle.addEventListener('click', () => calcToggle());
    
    // Make Calculation Listener (only apprears on recipes with structured data)
    document.querySelector("#calculate").addEventListener('click', () => calculate());

    // Required
    document.querySelector('#edit-sumbit').addEventListener('click', (event) => required(event));
      

    // Cookie - copied from documentation
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    

    function toggle() {
        const list = document.querySelector("#ingredients-list");
        const form = document.querySelector("#ingredients-form");
        const calcBtn = document.querySelector("#calculate-toggle");

        // Toggle form visibility and the Inner HTML of the button
        if (form.classList.contains('invisible')) {
            form.classList.remove('invisible');
            // list.classList.add('invisible');
            editIngredientsButton.innerHTML = "Cancel";
            calcBtn.classList.add('invisible');
            
        } else {
            list.classList.remove('invisible');
            form.classList.add('invisible');
            editIngredientsButton.innerHTML = btnText;
            calcBtn.classList.remove('invisible');   
        }

    }


    function calcToggle() {
        let radios = document.querySelectorAll('.radios');
        let calcDiv = document.querySelectorAll('#calculate-div');
        const editBtn = document.querySelector('#edit-ingredients');
        let li = document.querySelectorAll('.li');

        radios.forEach((element) => element.classList.toggle('invisible'));
        calcDiv.forEach((element) => element.classList.toggle('invisible'));
        li.forEach((element) => element.classList.toggle('invisible'));
        editBtn.classList.toggle('invisible');

        if (calctoggle.innerHTML != 'cancel') {
            calctoggle.innerHTML = 'cancel';
        } else {
            calctoggle.innerHTML = 'Calculate quantities based on the quantity of one ingredient';
        }
            
    }



    function calculate() {
        let base = document.querySelectorAll('.radio-selection');
        let baseIngredient;
        let baseValue;
        let recipeId;
        let username = document.querySelector('#calculate_input').dataset.username;

        base.forEach((base) => {
            if(base.checked){
                baseIngredient = base.id;
                recipeId = base.dataset.id;

            }
        })


        // Found a try method for JS in https://www.w3schools.com/js/js_errors.asp
        try {
            baseValue = parseInt(document.querySelector('.base-value').value);
        }
        catch(err) {
            let error = document.querySelector(".messages");
            error.innerHTML = 'Input is not a number';
            error.classList.add('error');
        }
        
        
        url = `http://127.0.0.1:8000/calculate/${username}/${recipeId}`;
        

        const csrftoken = getCookie('csrftoken');
        
        fetch(url, {
            method: 'POST',

            // From django documentation: https://docs.djangoproject.com/en/4.2/howto/csrf/
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin', // Do not send CSRF token to another domain.

            body: JSON.stringify({
                'base_ingredient': baseIngredient,
                'value': baseValue,
                
            })
        })
        
        .then(response => response.json())
        .then(result => {
            console.log(result);

            
            // Update the page
            let dict = []
            dict = JSON.parse(result['ingredient_list']);
            console.log(dict);

            calcToggle();

            let li = document.querySelectorAll('.li');

            for (let i = 0; i < li.length; i++) {
                li[i].innerHTML = `${dict[i]['ingredient']}: ${dict[i]['quantity']} ${dict[i]['unit']}`;
            }
            
        }) 
       
    }


        
})

// Functions called from the HTML

// Calculators
function volumeCalculator() {
    let value = parseFloat(document.querySelector("#volume-number").value);
    let unit = document.querySelector("#volume-unit").value;
    let result; 

    if (unit == 'cup') {
        result = value * 236;
    } else if (unit == 'tbsp') {
        result = value * 15;
    } else if (unit == 'tsp') {
        result = value * 5;
    } else if (until = 'gallon') {
        result = value * 3785.41;
    }

    document.querySelector("#volume-result").innerHTML = result;

}

function weightCalculator() {
    let value = parseInt(document.querySelector("#weight-number").value);
    let unit = document.querySelector("#weight-unit").value;
    let result; 

    
    if (unit == 'oz') {
        result = value * 28.34;
    } else if (unit == 'lb') {
        result = value * 453;
    } else if (unit == 'stones') {
        result = value * 6350;
    } else if (until = 'gallon') {
        result = value * 3785.41;
    }

    document.querySelector("#weight-result").innerHTML = result;

}


// Delete
function deleteAlert() {
let alertDiv = document.querySelector('#delete-alert');
let cancel = document.querySelector('#cancel-delete').onclick = function() {
    alertDiv.classList.toggle('invisible');
};

    alertDiv.classList.toggle('invisible');

}

