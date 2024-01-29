

let zombieApocalypse = {
    name: "Yohan",
    isImmuneToInfection: false,
    canSpreadInfection: true,
    isDeceased: false,
    age: 22,
    virusVariants: ["Zombie-A"],
    descendants: [
        {
            name: "Zoe",
            isImmuneToInfection: false,
            canSpreadInfection: true,
            isDeceased: false,
            age: 26,
            virusVariants: [],
            descendants: [
                {
                    name: "Max",
                    isImmuneToInfection: false,
                    canSpreadInfection: true,
                    isDeceased: false,
                    age: 29,
                    virusVariants: [],
                    descendants: [
                        {
                            name: "Tristan",
                            isImmuneToInfection: false,
                            canSpreadInfection: true,
                            isDeceased: false,
                            age: 33,
                            virusVariants: ["Zombie-B"],
                            descendants: []
                        }
                    ]
                },
                {
                    name: "Tibo",
                    isImmuneToInfection: false,
                    canSpreadInfection: true,
                    isDeceased: false,
                    age: 45,
                    virusVariants: [],
                    descendants: []
                }
            ]
        },
        {
            name: "Yanis",
            isImmuneToInfection: false,
            canSpreadInfection: true,
            isDeceased: false,
            age: 31,
            virusVariants: ["Zombie-C"],
            descendants: [
                {
                    name: "Christine",
                    isImmuneToInfection: false,
                    canSpreadInfection: true,
                    isDeceased: false,
                    age: 24,
                    virusVariants: ["Zombie-32"],
                    descendants: []
                },

                {
                    name: "bab",
                    isImmuneToInfection: false,
                    canSpreadInfection: true,
                    isDeceased: false,
                    age: 24,
                    virusVariants: [],
                    descendants: []
                },
                {
                    name: "Pierre",
                    isImmuneToInfection: false,
                    canSpreadInfection: true,
                    isDeceased: false,
                    age: 32,
                    virusVariants: [],
                    descendants: [
                        {
                            name: "Patoche",
                            isImmuneToInfection: false,
                            canSpreadInfection: true,
                            isDeceased: false,
                            age: 24,
                            virusVariants: ["Zombie-Ultime"],
                            descendants: []
                        }
                    ]
                }
            ]
        }
    ]
};

function assignParentToDescendants(personne, parent) {
    personne.parent = parent;
    personne.descendants.forEach((enfant) => assignParentToDescendants(enfant, personne));
    return personne;
}

function removeParentFromDescendants(personne) {
    delete personne.parent;
    personne.descendants.forEach((enfant) => removeParentFromDescendants(enfant));
    return personne;
}

zombieApocalypse = assignParentToDescendants(zombieApocalypse, null);

function canBeInfectedByVariant(personne, variant) {
    if (!personne.isImmuneToInfection && !personne.isDeceased && !personne.virusVariants.includes(variant)) {
        if (variant === 'Zombie-32' && personne.age < 32) {
            return false; 
        }
        return true;
    }

    const descendantInfectable = personne.descendants.find((enfant) => canBeInfectedByVariant(enfant, variant));
    
    return !!descendantInfectable;
}

function infectFromTopToBottom(personne, variant) {
    if (canBeInfectedByVariant(personne, variant)) {
        console.log(`${personne.name} a été infecté par le virus ${variant}`);
        const updatedVariants = [...personne.virusVariants, variant];
        const updatedDescendants = personne.descendants.map((enfant) => infectFromTopToBottom(enfant, variant));
        
        return {
            ...personne,
            virusVariants: updatedVariants,
            descendants: updatedDescendants
        };
    } else {
        return personne;
    }
}


function infectFromBottomToTop(personne, variant) {
    let updatedPersonne = { ...personne };

    if (canBeInfectedByVariant(updatedPersonne, variant)) {
        console.log(`${updatedPersonne.name} a été infecté par le virus ${variant}`);
        updatedPersonne.virusVariants.push(variant);
    }

    if (updatedPersonne.parent !== null) {
        updatedPersonne.parent = infectFromBottomToTop(updatedPersonne.parent, variant);
    }

    return updatedPersonne;
}

function infectAlternateDescendants(human, variant) {
    if (canBeInfectedByVariant(human, variant)) {
        const descendantsToInfect = human.descendants.filter((child) => canBeInfectedByVariant(child, variant));
        
        for (let i = 0; i < descendantsToInfect.length; i++) {
            if (i % 2 === 0) {
                descendantsToInfect[i].virusVariants.push(variant);
                console.log(`${descendantsToInfect[i].name} a été infecté par le virus ${variant}`);
            }
        }
    }
}




function processInfection(human) {
    human.virusVariants.forEach((variant) => {
        switch (variant) {
            case 'Zombie-A':
                infectFromTopToBottom(human, 'Zombie-A');
                break;
            case 'Zombie-B':
                infectFromBottomToTop(human, 'Zombie-B');
                break;
            case 'Zombie-32':
                infectFromTopToBottom(human, 'Zombie-32');
                infectFromBottomToTop(human, 'Zombie-32');
                break;
            case 'Zombie-C':
                infectAlternateDescendants(human, 'Zombie-C');
                break;
            case 'Zombie-Ultime':
                infectFromBottomToTop(human, 'Zombie-Ultime', (human) => human.parent === null);
                break;
        }
    });

    human.descendants.map((child) => processInfection(child));
}

function vaccineA1(human) {
    if (human.virusVariants.includes('Zombie-A') || human.virusVariants.includes('Zombie-32')) {
        if (human.age <= 30) {
            console.log(`${human.name} (${human.age} ans) a été vacciné et est immunisé contre tous les variants.`);
            human.virusVariants = [];
            human.isImmuneToInfection = true;
        } else {
            console.log(`${human.name} (${human.age} ans) est trop âgé, le vaccin est inefficace.`);
        }
    }
    human.descendants.map((child) => vaccineA1(child));
}

let deathIndex = 0;
function vaccineB1(human) {
    if (human.virusVariants.includes('Zombie-B') || human.virusVariants.includes('Zombie-C')) {
        if (deathIndex % 2 === 0) {
            console.log(`${human.name} a été vacciné et n'est plus infecté par les virus Zombie-B et Zombie-C.`);
            human.virusVariants = human.virusVariants.filter((variant) => variant !== 'Zombie-B' && variant !== 'Zombie-C');
        } else {
            console.log(`${human.name} a été tué par le vaccin.`);
            human.isDeceased = true;
        }
        deathIndex++;
    }
    human.descendants.map((child) => vaccineB1(child));
}

function ultimateVaccine(human) {
    if (human.virusVariants.includes('Zombie-Ultime')) {
        console.log(`${human.name} a été vacciné et ne peut plus jamais être infecté ni propager le virus à d'autres.`);
        human.virusVariants = [];
        human.isImmuneToInfection = true;
        human.canSpreadInfection = false;
    }
    human.descendants.map((child) => ultimateVaccine(child));
}

console.log('-----------------------------------------------------------')
console.log(`L'infection commence...`);
processInfection(zombieApocalypse);

console.log('-----------------------------------------------------------')
console.log('Déploiement du vaccin A1...');
vaccineA1(zombieApocalypse);

console.log('-----------------------------------------------------------')
console.log('Déploiement du vaccin B1...');
let indexOfDeath = 0;
vaccineB1(zombieApocalypse);

console.log('-----------------------------------------------------------')
console.log('Déploiement du vaccin Ultime...');
ultimateVaccine(zombieApocalypse);

zombieApocalypse = removeParentFromDescendants(zombieApocalypse);
console.dir(zombieApocalypse, { depth: null });
