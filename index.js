import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import {
	getDatabase,
	ref,
	push,
	onValue,
	remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

// Nombre de la base de datos
const databaseName = 'shoppingListPrueba'

// Configuración de Firebase
const appSettings = {
	databaseURL:
		'https://realtime-database-2b550-default-rtdb.europe-west1.firebasedatabase.app/',
}

// Inicializar Firebase
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, databaseName)

// Elementos del DOM
const inputFieldEl = document.getElementById('input-field')
const addButtonEl = document.getElementById('add-button')
const shoppingListEl = document.getElementById('shopping-list')

// Añadir nuevo elemento haciendo click en el botón
addButtonEl.addEventListener('click', function () {
	if (inputFieldEl.value.trim() !== '') {
		let inputValue = inputFieldEl.value.trim()

		push(shoppingListInDB, inputValue)

		clearInputFieldEl()
	}
})

// Añadir nuevo elemento haciendo click a enter
document.addEventListener('keydown', function handleKeyPress(e) {
	if (e.key === 'Enter' && inputFieldEl.value.trim() !== '') {
		let inputValue = inputFieldEl.value.trim()

		push(shoppingListInDB, inputValue)

		clearInputFieldEl()
	}
})

// Escuchar cambios en la base de datos
onValue(shoppingListInDB, function (snapshot) {
	if (snapshot.exists()) {
		let itemsArray = Object.entries(snapshot.val())

		// Ordenar itemsArray alfabéticamente según el valor del elemento
		itemsArray.sort((a, b) => {
			let itemA = a[1].toLowerCase() // Convertir a minúsculas para una comparación case-insensitive
			let itemB = b[1].toLowerCase() // Convertir a minúsculas para una comparación case-insensitive
			if (itemA < itemB) return -1
			if (itemA > itemB) return 1
			return 0
		})

		clearShoppingListEl()

		for (let i = 0; i < itemsArray.length; i++) {
			let currentItem = itemsArray[i]
			let currentItemID = currentItem[0]
			let currentItemValue = currentItem[1]

			// Llama a appendItemToShoppingListEl pasando los valores correctos
			appendItemToShoppingListEl(currentItemID, currentItemValue)
		}
	} else {
		shoppingListEl.innerText = 'No hay artículos ... todavía'
	}
})

// Limpiar lista de compras
function clearShoppingListEl() {
	shoppingListEl.innerHTML = ''
}

// Limpiar campo de entrada
function clearInputFieldEl() {
	inputFieldEl.value = ''
}

// Añadir un ítem a la lista de compras en el DOM
function appendItemToShoppingListEl(itemID, itemValue) {
	let newEl = document.createElement('li')
	newEl.textContent = itemValue

	// Eliminar ítem con doble clic
	newEl.addEventListener('dblclick', function () {
		let exactLocationOfItemInDB = ref(database, `${databaseName}/${itemID}`)
		remove(exactLocationOfItemInDB)
	})

	shoppingListEl.append(newEl)
}
