document.addEventListener('DOMContentLoaded', function() {

    // Event Listeners
    const editIngredientsButton = document.querySelector("#edit-ingredients");
    if (editIngredientsButton != null) {
        editIngredientsButton.addEventListener('click', (event) => toggle(event));
    }
    
    // Toggle the text of the button according to the occassion (for pages with strings or edited pages)
    if (document.querySelector('#edit-ingredients') != null) {
        const btnText = document.querySelector('#edit-ingredients').innerHTML;
    }


    // Calculate Toggle (only apprears on recipes with structured data)
    const calctoggle = document.querySelector("#calculate-toggle");
    if (calctoggle != null) {
        calctoggle.addEventListener('click', () => calcToggle());
    }
    

    // Make Calculation Listener (only apprears on recipes with structured data)
    const calculateBtn = document.querySelector("#calculate");
    if (calculateBtn != null) {
        calculateBtn.addEventListener('click', () => calculate());
    }
    

    // Responsive Menu
    const burgerBtn = document.querySelector("#mob-menu-btn");
    burgerBtn.addEventListener('click', () => mobMenu());

   




    // FUNCTIONS

    function required() {
        const li = document.querySelectorAll('.list-item');

        for (let i = 0; i < li.length; i++) {
            let ingredient = li[i].querySelector('.ingredient-name').value;
            let quantity = parseInt(li[i].querySelector('.number-field').value);
            let unit = li[i].querySelector('.unit-field').value;

            if (ingredient == '' || quantity == '' || unit == '') {
                alert("Please fill in everything to avoid overwriting data with empty values");
                preventDefault();
            } 
        }
    }




    function toggle(event) {
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
            // calcBtn.classList.remove('invisible');
            
            
        }

    }


    function calcToggle() {
        let radios = document.querySelectorAll('.radios');
        let calcDiv = document.querySelectorAll('#calculate-div');
        let li = document.querySelectorAll('.li');

            radios.forEach((element) => element.classList.toggle('invisible'));
            calcDiv.forEach((element) => element.classList.toggle('invisible'));
            li.forEach((element) => element.classList.toggle('invisible'));
            
    }



    function calculate() {
        let base = document.querySelectorAll('.radio-selection');

        let baseIngredient;
        let baseValue;
        let recipeId;

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
        

        console.log(baseIngredient);
        console.log(baseValue);

        url = '/calculate/' + recipeId;
        console.log(url);
        fetch(url, {
            method: 'POST',
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



    function mobMenu() {
        const mobMenu = document.querySelector('#mob-menu');

        mobMenu.classList.toggle('invisible');

    }



        
})

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

