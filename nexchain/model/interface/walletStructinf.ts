/**
 * Represents the structure of wallet data to be saved.
 */
export interface structWalletToSave {
	data: {
		address: string // The wallet address
		publicKey: string // The public key associated with the wallet
		privateKey: string // The encrypted private key for the wallet
	}
	metadata: {
		timestamp: number // The timestamp when the wallet data was created or updated
		label: string // A label or description for the wallet data
	}
	checkSum?: string // An optional checksum for data integrity verification
}
