import * as readline from 'readline'
import fs from 'fs'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

var orders: string[] = JSON.parse(fs.readFileSync('orders.json', 'utf8'))

const menu: string = `--------------------------------
What would you like to do today? 
1 - Order
2 - List orders
3 - Delete order
4 - Exit

Today, I would like to: `

function userInput(): void {
	rl.question(menu, (command) => {
		switch (command) {
			case '1':
			case 'order':
				placeOrder()
				break
			case '2':
			case 'list':
				listOrders()
				break
			case '3':
			case 'delete':
				deleteOrder()
				break
			case '4':
			case 'exit':
				rl.close()
				return
		}
		setImmediate(userInput)
	})
}

function placeOrder(): void {
	rl.question('What do you wish to order? ', (order) => {
		orders.push(order)
		saveToOrdersJSON(orders)
		console.log(`The order for ${order} has been placed.`)

		setImmediate(userInput)
	})
}

function listOrders(): void {
	console.log('Here is the list of orders: ')
	for (const order of orders) {
		console.log(`- ${order}`)
	}

	setImmediate(userInput)
}

function deleteOrder(): void {
	rl.question('What do you wish to remove? ', (order) => {
		var deletedOrder: string | undefined = undefined

		if (orders.includes(order)) {
			deletedOrder = order
			orders.splice(orders.indexOf(order), 1)
		} else if (0 < Number(order) && Number(order) <= orders.length) {
			deletedOrder = orders.splice(Number(order) - 1, 1)[0]
		} else {
			console.log('Order not found.')
			return setImmediate(userInput)
		}

		console.log(`${deletedOrder} has been removed.`)
		saveToOrdersJSON(orders)
		setImmediate(userInput)
	})
}

function saveToOrdersJSON(arrayToSave: string[]): void {
	fs.writeFileSync('orders.json', JSON.stringify(arrayToSave))
}

userInput()
