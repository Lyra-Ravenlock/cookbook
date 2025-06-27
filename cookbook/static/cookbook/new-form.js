document.addEventListener('DOMContentLoaded', function() {

    
    document.querySelector('#add-ingredient').addEventListener('click', () => addField('#ingredient-1', '.ingredient_listing', '#ingredients', 'ingredient'));
    document.querySelector('#add-step').addEventListener('click', () => addField('#step-1', '.step-listing', '#steps', 'step'));
    document.querySelector('#add-nutrient').addEventListener('click', () => addField('#nutrient-1', '.nutrient-listing', '#nutrients', 'nutrient'));

    document.querySelector('#check-title').addEventListener('click', () => checkTitle());

    

    
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
    


    // ADD FIELDS FOR NEW RECIPE
    function addField(copy, number, parent, idname) {

        let element = document.querySelector(copy);
        let elementListings = document.querySelectorAll(number);

        let newElement = element.cloneNode(true);

        newID = `${idname}-${elementListings.length + 1}`;
        newElement.id = newID;
               
        newElement.querySelectorAll('input').forEach((element) => element.value = '');
        if (newElement.querySelector('select')) {
            newElement.querySelector('select').value = '';
        }

        document.querySelector(parent).appendChild(newElement);
        document.querySelector(`#${newID}`).querySelector('input').focus();
        document.querySelector(`#${newID}`).querySelector('input').innerHTML = 'hello';

    }


    


    function checkTitle() {

        let title = document.querySelector('#recipe_title').value;
        let parent = document.querySelector('#title-box');
      
        const csrftoken = getCookie('csrftoken');

        fetch('/check-title', {
            method: 'POST',

            // From django documentation: https://docs.djangoproject.com/en/4.2/howto/csrf/
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin', // Do not send CSRF token to another domain.

            body: JSON.stringify({
                'title': title
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);

            
            // Update the page
            let message = document.createElement('p');
            message.innerHTML = result['message']
            message.className = 'js-alert';
            if (result['message-type'] == 'error') {
                message.setAttribute('style', 'background-color: red;')
            } else {
                message.setAttribute('style', 'background-color: green;')
            }

            parent.appendChild(message);
            console.log(message);


        })
    }

})
