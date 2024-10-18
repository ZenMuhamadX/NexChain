/** @format */

import { processPubKey } from './utils/processPubKey'
import { addChecksum } from './utils/addChecksum'
import bs58 from 'bs58'
import { saveMainWallet } from './utils/saveWallet'
import { putBalance } from './balance/putBalance'
import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { loadKeyPair } from './utils/loadKeyPair'

// Creates a new wallet address and saves it
export const createWalletAddress = () => {
	try {
		const initialBalance = 0

		const initialTimesTransaction = 0

		// Retrieve the public key
		const publicKey = loadKeyPair().publicKey

		// Generate the wallet address from the public key
		const address = processPubKey(publicKey)

		const version = 0x00

		// Combine version byte and address
		const versionAddress = Buffer.concat([
			Buffer.from([version]),
			address as Buffer,
		])

		// Add checksum to the versioned address
		const addressWithCheckSum = addChecksum(versionAddress)

		// Encode address to Base58
		const addressBase58 = bs58.encode(addressWithCheckSum)

		// Format the final wallet address
		const walletAddress = `NxC${addressBase58}`

		// Save the wallet address
		saveMainWallet(walletAddress)

		putBalance(walletAddress, {
			balance: initialBalance,
			timesTransaction: initialTimesTransaction,
			address: walletAddress,
		})

		// Return the formatted wallet address
		return walletAddress
	} catch (error) {
		loggingErr({
			context: 'createWalletAddress',
			error,
			stack: new Error().stack,
			time: generateTimestampz(),
			hint: '',
			warning: null,
		})
		return
	}
}
