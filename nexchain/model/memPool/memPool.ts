import { transactionValidator } from 'interface/txValidator/txValidator.v'
import { saveMempool } from 'nexchain/storage/mempool/saveMemPool'
import { loadMempool } from 'nexchain/storage/mempool/loadMempool'
import { txInterface } from '../interface/memPool.inf'
import { saveTxHistory } from 'nexchain/transaction/saveTxHistory'
import { loadKeyPair } from 'nexchain/account/utils/loadKeyPair'

export class MemPool {
	constructor() {
		this.initializePool()
	}

	private async initializePool(): Promise<void> {
		await this.recoveryPool()
	}

	private async recoveryPool(): Promise<txInterface[]> {
		const recovery = await loadMempool()
		return recovery as txInterface[]
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */
	public async addTransaction(
		transaction: txInterface,
	): Promise<boolean | txInterface> {
		// Validate the transaction
		const { publicKey } = loadKeyPair()
		const isValidTx = await transactionValidator(transaction, publicKey)
		if (!isValidTx) return false

		// Save the transaction
		await saveMempool(transaction)
		saveTxHistory(transaction.txHash!, transaction)
		return transaction
	}

	/**
	 * Gets all valid transactions in the memory pool.
	 * @returns An array of transactions.
	 */
	public async getValidTransactions(): Promise<txInterface[]> {
		const data = await this.recoveryPool()
		return data as txInterface[]
	}
}
