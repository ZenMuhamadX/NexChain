import path from 'path'
import fs from 'node:fs'
import msg from 'msgpack-lite'
import { structWalletToSave } from 'nexchain/model/interface/walletStructinf'

export const loadWallet = (): structWalletToSave | undefined => {
	const dirPath = path.join(__dirname, '../../../myWallet')
	const filePath = path.join(dirPath, 'MainWallet.bin')

	try {
		// Check if the file exists
		if (!fs.existsSync(filePath) || !fs.existsSync(dirPath)) {
			console.error('File MainWallet.bin not found.')
			return undefined
		}

		// Read file if it exists
		const fileData = fs.readFileSync(filePath)
		const walletData: structWalletToSave = msg.decode(fileData)

		// Check if wallet data is valid
		if (!walletData || !walletData.data) {
			console.error('Invalid wallet data.')
			return undefined
		}

		return walletData
	} catch (error) {
		console.error('Error loading wallet:', error)
		return undefined
	}
}
