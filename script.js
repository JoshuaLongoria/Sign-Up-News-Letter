var emailField = document.getElementById("email-input");
var emailError = document.getElementById("email-error");

function validateEmail(){
    
    if(!emailField.value.match(/^[A-Za-z\._\-0-9]+[@][A-Za-z]+[\.][a-z]{2,4}$/)){
        emailError.innerHTML = "Please enter a valid email";
        emailError.style.top = "120%";
        return false;
    }

    emailError.innerHTML = "";
    emailError.style.top = "100%";
    return true;

}