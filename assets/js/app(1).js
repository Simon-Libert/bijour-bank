//  fonction qui permet de tester si storageData est un objet, n'est pas nulletc... et si oui va chercher les données dans le storage *****
function fetchOperationData() {
	const storageData = JSON.parse(localStorage.getItem('operationData'));
	if (storageData !== null && typeof storageData === 'object' && storageData.length >= 1) {
		return storageData;
	} else {
		return [];
	}
}
// ******************************************************************************************************************************

const operationForm = document.getElementById('operationForm');
const operationContainer = document.querySelector('main .grid-container');
const operationData = fetchOperationData();
let solde = document.getElementById('solde'); //rajout simonin
const somme = fetchSomme(); //rajout simonin


/* récupère les données du formData, preventdefault permet de ne pas rafraichir page */
operationForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const formData = new FormData(operationForm);
	const dataToInsert = {};

	formData.forEach((value, key) => {
		dataToInsert[key] = value;
	});

	operationTemplate(dataToInsert, true);
  getSolde(dataToInsert);
  
});


function fetchSomme () {
  const somme = localStorage.getItem('somme');
  if (somme !== null) {
    return somme
  } else {
    return 0.00
  }
};


function sommeTemplate ({operator, montant}) {
   const htmlSomme = `<h1 id="solde" class="solde">${montant}</h1>`
   solde.insertAdjacentElement('afterbegin', htmlSomme);
   const newSomme = getSolde(operator, montant)
   localStorage.setItem(newSomme)
}


function getSolde({ operator, montant }) {
	if (operator == 'credit') {
		solde.innerHTML = parseInt(solde.innerHTML) + parseInt(montant);
	} else {
		solde.innerHTML = parseInt(solde.innerHTML) - parseInt(montant);
	}
}

const getOps = JSON.parse(localStorage.getItem('operationData'));
console.table(getOps); //table affiche les tableaux et c'est beau !
let soldeDebit = 0;
let soldeCredit = 0;

getOps.forEach(function (getOp) {
	if (getOp.operator == 'credit') {
		soldeCredit += parseInt(getOp.montant);
	} else {
		soldeDebit -= parseInt(getOp.montant);
	}
});

document.getElementById('solde').innerText = soldeCredit - soldeDebit + '€';

// ****************************séparation credit debit et tout ***********************************
const creditClick = document.getElementById('credit');
creditClick.addEventListener('click', (operator) => {
	const operationData = JSON.parse(localStorage.getItem('operationData'));
	let opsCredit = [];
	operationData.forEach(function (getOp) {
		if (getOp.operator == 'credit') {
		opsCredit.push(getOp);
		} 
	})
	console.table(opsCredit);
	operationContainer.innerHTML = [];
	init(opsCredit);
})

const debitClick = document.getElementById('debit');
debitClick.addEventListener('click', (operator) => {
	const operationData = JSON.parse(localStorage.getItem('operationData'));
	let opsDebit = [];
	operationData.forEach(function (getOp) {
		if (getOp.operator == 'debit') {
		opsDebit.push(getOp);
		} else {}
	})
	console.table(opsDebit);
	operationContainer.innerHTML = [];
	init(opsDebit);
});

const toutClick = document.getElementById('tout');
toutClick.addEventListener('click', (operator) => {
	const operationData = JSON.parse(localStorage.getItem('operationData'));
	if (operationData >= 1) { 
		return operationData
	}
		
	operationContainer.innerHTML = [];
	init(operationData);
});


// ********va chercher les éléments à modifier et les charge au début grace à insertAdjacenthtml after begin******
function operationTemplate({ operator, titre, desc, montant }, addItToStorage) {
	addItToStorage = addItToStorage || false;
	const img =
		operator === 'credit' ? './assets/images/sac-dargent.png' : './assets/images/depenses.png';

	const html = `
        <div class="operation ${operator}">
            <div class="grid-x grid-padding-x align-middle">
                <div class="cell shrink">
                    <div class="picto">
                        <img src="${img}" alt="${operator}" />
                    </div>
                </div>
                <div class="cell auto">
                    <div>
                        <h2>${titre}</h2>
                        <small>${desc}</small>
                    </div>
                </div>
                <div class="cell small-3 text-right">
                    <div>
                        <p class="count">${montant} €</p> 
                        <small>100%</small>
                    </div>
                </div>
            </div>
        </div>
    `;

	operationContainer.insertAdjacentHTML('afterbegin', html);
	if (addItToStorage) operationData.push({ operator, titre, desc, montant });
	localStorage.setItem('operationData', JSON.stringify(operationData));
  
}

//  ******************fonction qui permet de charger les données  au rafraichissement de la page*************
function init(operationData) {
	if (operationData.length >= 1) {
		operationData.forEach((value, key) => {
			operationTemplate(operationData[key]);
		});
	}
}

init(operationData);

// *************************************************************************************************************************

/**
 * init foundation
 */
$(document).ready(function () {
	$(document).foundation();
});
