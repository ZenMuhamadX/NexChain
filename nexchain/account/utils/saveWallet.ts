import 'dotenv/config'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import { structWalletToSave } from 'nexchain/model/interface/walletStructinf'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import msg from 'msgpack-lite'
import { loadKeyPair } from './loadKeyPair'

// Saves the main wallet data to a file
export const saveMainWallet = async (
	address: string,
	privateKey: string = loadKeyPair().privateKey,
): Promise<boolean> => {
	try {
		// Determine the file name and path
		const dirPath = path.join(__dirname, '../../../myWallet')
		const filePath = path.join(dirPath, 'MainWallet.bin')

		// Create directory if it does not exist
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true })
		}

		// Prepare the data to be saved
		const structToSave: structWalletToSave = {
			data: {
				address,
				publicKey: loadKeyPair().publicKey,
				privateKey,
			},
			metadata: {
				timestamp: generateTimestampz(),
				label: 'Main wallet',
			},
		}
		structToSave.checkSum = addCheckSum(structToSave)

		// Serialize the data and write to file
		const serializedData = msg.encode(structToSave)

		fs.writeFileSync(filePath, serializedData, 'binary')

		console.log('Wallet saved successfully.', filePath)

		return true
	} catch (error) {
		// Handle errors that occur during the saving process
		console.error('Error saving wallet:', error)
		return false
	}
}

// Adds a checksum to the data for integrity verification
const addCheckSum = (data: any) => {
	try {
		const formatData = JSON.stringify(data)
		return crypto
			.createHash('sha512')
			.update(Buffer.from(formatData))
			.digest('hex')
	} catch (error) {
		console.error('Error generating checksum:', error)
		throw error // Re-throw to allow calling functions to handle it
	}
}
