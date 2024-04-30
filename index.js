import fs from "node:fs/promises"
import { input } from "@inquirer/prompts"

const criticalValue = 5
const fumbleValue = 96

const filePath = await input({ message: 'CSVのパス :' })
const inputtedData = await fs.readFile(filePath, 'utf8')

const diceList = inputtedData.split('\n').map(i => {
	const splitted = i.split(',')
	return {
		user: splitted[0],
		result: parseInt(splitted[1])
	}
})

const diceGrouped = Object.groupBy(diceList, data => data.user)
const result = {}
Object.entries(diceGrouped)
	.forEach(([user, data]) => {
		const criticalCount = data.filter(i => i.result <= criticalValue).length
		const fumbleCount = data.filter(i => i.result >= fumbleValue).length
		result[user] = {
			avg: data.reduce((p, c) => p + c.result, data[0].result) / data.length,
			criticalPercent: `${criticalCount / data.length * 100}%`,
			fumblePercent: `${fumbleCount / data.length * 100}%`,
			criticalCount,
			fumbleCount,
			allCount: data.length
		}
	})

console.table(result)
