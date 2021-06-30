/* Query the DOM to get a reference to the generator button*/
var generatePasswordButton = document.querySelector("#generate-password");




/* Go through password criteria inputs and validate responses before
using a password generator object to check the selected criteria and
generate a corresponding password one character at a time selecting 
randomly from an array of strings comprised of selected character types.
After password is generated, password display is changed to match.*/
var generatePassword = function () {
    var passwordDisplayElement = document.querySelector("#password-display-element");
    var promptState = {};
    promptState.propertiesArray = ['index', 'promptNumberOfCharactersS8E128',
                                    'confirmIncludeNumbers', 'confirmIncludeSpecial',
                                    'confirmIncludeLowercase',
                                    'confirmIncludeUppercase',           
                                    ];

    promptState.setOrReset = function () {
        for (i = 0; i < promptState.propertiesArray.length; i++) {
            promptState[promptState.propertiesArray[i]] = 0;
        }
    }
    
    while (!minimumCriteriaSelected) {
        promptState.setOrReset();
        var propertyStringArray = [];
        var minimumCriteriaSelected = false;
        while (promptState.index < promptState.propertiesArray.length) {
            promptState = promptUser(promptState, propertyStringArray);
        }

        for (i=0; i < promptState.propertiesArray.length; i ++) {
            if (promptState.propertiesArray[i].split(/(?=[A-Z])/)[0] === 'confirm') {
                if (promptState[promptState.propertiesArray[i]]) {
                    minimumCriteriaSelected = true;
                }
            }
        }
        if (!minimumCriteriaSelected) {
            alert('You must select at least one character type.');
        }
    }

    var passwordGenerator = {};
    passwordGenerator.password = '';
    passwordGenerator.Lowercase = 'abcdefghijklmnopqrstuvwxyz'.split('');
    passwordGenerator.Uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    passwordGenerator.Numbers = '0123456789'.split('');
    passwordGenerator.Special = '!@#$%^&*()_+-=?'.split('');
    passwordGenerator.conditionsArray = [
                                        'confirmIncludeNumbers',
                                        'confirmIncludeSpecial',
                                        'confirmIncludeLowercase',
                                        'confirmIncludeUppercase',
                                        ]
    passwordGenerator.characterTypesArray = []

    for (i=0; i <passwordGenerator.conditionsArray.length; i++) {
        if (promptState[passwordGenerator.conditionsArray[i]]) {
            passwordGenerator.characterTypesArray.push(passwordGenerator.conditionsArray[i].split(/(?=[A-Z])/)[passwordGenerator.conditionsArray[i].split(/(?=[A-Z])/).length-1]);
        }
    }
    
    for (i=0; i<promptState.promptNumberOfCharactersS8E128-1; i++) {
        passwordGenerator.randomCharacterTypeIndex = Math.floor(Math.random()*(passwordGenerator.characterTypesArray.length));
        passwordGenerator.randomArray = passwordGenerator[passwordGenerator.characterTypesArray[passwordGenerator.randomCharacterTypeIndex]];
        passwordGenerator.randomCharacter = passwordGenerator.randomArray[Math.floor(Math.random()*passwordGenerator.randomArray.length)];
        passwordGenerator.password = passwordGenerator.password + passwordGenerator.randomCharacter;
    }
    
    passwordDisplayElement.textContent = passwordGenerator.password
}

/*Ask user to respond to a series of confirms and prompts that are 
populated using a passed object promptState that is decribed
by an array of properties*/
var promptUser = function (promptState, propertyStringArray) {
    propertyStringArray = promptState.propertiesArray[promptState.index].split(/(?=[A-Z])/);
    promptState.sliceState = {};
    switch (propertyStringArray[0]) {
        case 'confirm':
            promptState[promptState.propertiesArray[promptState.index]] = confirm(propertyStringArray.slice(1).join(' ') + '?');
            promptState.index += 1;
            break;
        case 'prompt':
            if (propertyStringArray[1] === 'Number') {
                var startNumber = Number(propertyStringArray[propertyStringArray.length-2].slice(1));
                var endNumber = Number(propertyStringArray[propertyStringArray.length-1].slice(1));
                var endSlice = propertyStringArray.length - 2;
            }
            else {
                var endSlice = propertyStringArray.length - 1;
            }
            promptState[promptState.propertiesArray[promptState.index]] = Number(prompt(propertyStringArray.slice(1, endSlice).join(' ')
                                                                                + ' Between ' + startNumber.toString() + ' and ' + endNumber.toString() + '?'));
            if (promptState[promptState.propertiesArray[promptState.index]] >= startNumber
                && promptState[promptState.propertiesArray[promptState.index]] <= endNumber) {
                promptState.index += 1;
            }
            else {
                alert('You must select a number between ' + startNumber + ' and ' + endNumber + '.');
            }
            break;
        default:
            promptState.index += 1;
            break;
    }
   
    return (promptState);
}



/* Add generate password listener.*/
generatePasswordButton.addEventListener("click", generatePassword);
