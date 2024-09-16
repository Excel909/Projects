//  For validation of sign up and login...

// updating password strength

const passwordInput = document.getElementById('password');
const passwordStrength = document.getElementById('password_strength');

passwordInput.addEventListener('input', () => {
    const strength = strength_update(passwordInput.value);

    if(strength === 'nothing'){
        passwordStrength.textContent = '';
    }

    if(strength === 'weak'){
        passwordStrength.textContent = 'Password is weak 😢';
        passwordStrength.classList.remove('medium', 'strong');
        passwordStrength.classList.add('weak');
    } else if (strength === 'Medium'){
        passwordStrength.textContent = 'Password strength is Medium 😐';
        passwordStrength.classList.remove('weak', 'strong');
        passwordStrength.classList.add('medium');
    } else if (strength === 'Strong'){
        passwordStrength.classList.remove('medium', 'weak');
        passwordStrength.textContent = 'Password is Strong 😁';
        passwordStrength.classList.add('strong');
    }
});

const strength_update = (password) => {
    let strength = 0;


    
    if(passwordInput.value.length < 2 || passwordInput.value.length === 2){
        return 'nothing'
    }

    if(password.length >= 6) strength++;
    if(/[A-Z]/.test(password)) strength++;
    if(/[a-z]/.test(password)) strength++;
    if(/[0-9]/.test(password)) strength++;
    if(/[^A-Za-z0-9]/.test(password)) strength++;

    if(strength < 3){
        return 'weak';
    } else if(strength === 3 || strength === 4){
        return 'Medium';
    } else{
        return 'Strong';
    }

};