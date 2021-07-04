/* Query the DOM to get a reference to the generator button*/
var generatePasswordButton = document.querySelector("#generate-password");
var passwordDisplayElement = document.querySelector("#password-display-element");

/*Create a function to split camel case strings*/
var splitCamel = function(string) {
    return string.split(/(?=[A-Z])/)
}

/*Create a function to generate random integers*/
var randomInteger = function(startInt, endInt) {
   return Math.floor(Math.random()*(endInt)) + startInt;
}

/* Go through password criteria inputs and validate responses before
using a password generator object to check the selected criteria and
generate a corresponding password one character at a time selecting 
randomly from an array of strings comprised of selected character types.
After password is generated, password display is changed to match.*/
var generatePassword = function () {
    var promptState = {};
    var propertiesArray = ['index', 
                            'promptNumberOfCharactersS8E128',
                            'confirmIncludeNumbers',
                            'confirmIncludeSpecial',
                            'confirmIncludeLowercase',
                            'confirmIncludeUppercase',           
                            ];

    promptState.setOrReset = function () {
        for (i = 0; i < propertiesArray.length; i++) {
            promptState[propertiesArray[i]] = 0;
        }
    }
    
    /*Iterate through promptState criteria, advancing the state of the
    promptState object repeating if necessary determined by a
    boolean that is made true if the minimum criteeia is selected
    by the user. */
    while (!minimumCriteriaSelected) {
        promptState.setOrReset();
        var minimumCriteriaSelected = false;
        while (promptState.index < Object.values(promptState).length) {
            promptState = promptUser(promptState);
        }

        for (i=0; i < Object.values(promptState).length; i ++) {
            if (typeof Object.keys(promptState)[i] === 'string') {
                if (splitCamel(Object.keys(promptState)[i])[0] === 'confirm') {
                    if (promptState[Object.keys(promptState)[i]]) {
                        minimumCriteriaSelected = true;
                    }
                }
            }
        }
        if (!minimumCriteriaSelected) {
            alert('You must select at least one character type.');
        }
    }

    var passwordGenerator = {};
    var gen = passwordGenerator;

    gen.password = '';
    gen.Lowercase = 'abcdefghijklmnopqrstuvwxyz'.split('');
    gen.Uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    gen.Numbers = '0123456789'.split('');
    gen.Special = '!@#$%^&*()_+-=?'.split('');
    gen.conditionsArray =   [
                            'confirmIncludeNumbers',
                            'confirmIncludeSpecial',
                            'confirmIncludeLowercase',
                            'confirmIncludeUppercase',
                            ]
    gen.characterTypesArray = []

    var item = passwordGenerator.conditionsArray;
    var gen = passwordGenerator;
    var charArray = gen.characterTypesArray;

    for (i=0; i <item.length; i++) {
        if (promptState[item[i]]) {
            var splitArray = splitCamel(item[i]);
            charArray.push(splitArray[splitArray.length-1]);
        }
    }
    
    /*Add random characters from a randomly chosen array from the
    selected charactersets*/
    for (i=0; i<promptState.promptNumberOfCharactersS8E128-1; i++) {
        gen.randomArray = gen[charArray[randomInteger(0, charArray.length)]];
        gen.randomCharacter = gen.randomArray[randomInteger(0, gen.randomArray.length)];
        gen.password = gen.password + gen.randomCharacter;
    }
    
    passwordDisplayElement.textContent = gen.password
    passwordDisplayElement.setAttribute('width', '100%')
}

/*Ask user to respond to a series of confirms and prompts that are 
populated using a passed object promptState that is decribed
by an array of properties*/
var promptUser = function (promptState) {
    propertyStringArray = splitCamel(Object.keys(promptState)[promptState.index]);
    var promptStateKey = Object.keys(promptState)[promptState.index];
    switch (propertyStringArray[0]) {
        case 'confirm':
            promptState[promptStateKey] = confirm   (
                                                    propertyStringArray.slice(1).join(' ')
                                                    + '?'
                                                    );
            promptState.index += 1;
            break;
        case 'prompt':
            if (propertyStringArray[1] === 'Number') {
                var startNumber = Number(propertyStringArray.slice(-2,-1)[0].slice(1));
                var endNumber = Number(propertyStringArray.slice(-1)[0].slice(1));
                var endSlice = propertyStringArray.length - 2;
            }
            else {
                var endSlice = propertyStringArray.length - 1;
            }
            numberPromptArray = [
                                propertyStringArray.slice(1, endSlice).join(' '),
                                ' Between ',
                                startNumber.toString(),
                                ' and ',
                                endNumber.toString(),
                                '?',
                                ]
            passwordLength = Number(prompt(numberPromptArray.join('')));
            promptState[promptStateKey] = passwordLength
            if (passwordLength >= startNumber && passwordLength <= endNumber) {
                promptState.index += 1;
            }
            else {
                alert   (
                        'You must select a number between '
                        + startNumber
                        + ' and '
                        + endNumber
                        + '.'
                        );
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
