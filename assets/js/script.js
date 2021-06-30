var generatePasswordButton = document.querySelector("#generate-password");

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
            break;
        default:
            promptState.index += 1;
            break;
    }
   
    return (promptState);
}

var generatePassword = function () {
    var promptState = {};
    promptState.propertiesArray = ['index', 'promptNumberOfCharactersS8E128',
                                    'confirmIncludeNumbers', 'confirmIncludeSpecial',
                                    'confirmIncludeLowercase',
                                    'confirmIncludeUppercase',           
                                    ];

    promptState.setOrReset = function () {
        for (i = 0; i < promptState.propertiesArray.length; i++) {
            promptState[promptState.propertiesArray[i]] = 0
        }
    }

    promptState.setOrReset();
    var propertyStringArray = [];
    while (promptState.index < promptState.propertiesArray.length) {
        promptState = promptUser(promptState, propertyStringArray);
    }

    var passwordGenerator = {}
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
            passwordGenerator.characterTypesArray.push(passwordGenerator.conditionsArray[i].split(/(?=[A-Z])/)[passwordGenerator.conditionsArray[i].split(/(?=[A-Z])/).length]);
        }
    }

    console.log(passwordGenerator.characterTypesArray[Math.floor(Math.random()*passwordGenerator.characterTypesArray.length)])

    for (i=0; i<promptState.promptNumberOfCharactersS8E128-1; i++) {
        passwordGenerator.randomCharacterTypeIndex = Math.floor(Math.random()*(passwordGenerator.characterTypesArray.length))
        console.log('randomIndex', passwordGenerator.randomCharacterTypeIndex)
        passwordGenerator.randomArray = passwordGenerator[passwordGenerator.characterTypesArray[passwordGenerator.randomCharacterTypeIndex]]
        console.log(passwordGenerator.characterTypesArray.length, passwordGenerator.randomCharacterTypeIndex)
        passwordGenerator.randomCharacter = passwordGenerator.randomArray[Math.floor(Math.random()*passwordGenerator.randomArray.length)]
        passwordGenerator.password = passwordGenerator.password + passwordGenerator.randomCharacter
    }
    console.log(passwordGenerator.password)
}

generatePasswordButton.addEventListener("click", generatePassword);
