import { loadKeyPair } from 'nexchain/account/utils/loadKeyPair'
import { createSignature } from 'nexchain/lib/block/createSignature'
import { createTxnHash } from 'nexchain/lib/hash/createTxHash'
import { comTxInterface } from 'nexchain/model/interface/commonTxInterface'
import { txInterface } from 'nexchain/model/interface/memPool.inf'
import { MemPool } from 'nexchain/model/memPool/memPool'

export const createTransact = async (transaction: comTxInterface) => {
	const x = new MemPool()
	const convertTx: txInterface = {
		amount: transaction.amount,
		to: transaction.to,
		from: transaction.from,
		timestamp: transaction.timestamp,
		fee: ((transaction.amount / 10000) * 2) / 1000,
		isPending: true,
		isValidate: false,
		message: Buffer.from(
			`NexChains A Next Generation Blockchain for Everyone \n ${transaction.message}`,
		),
		status: 'pending',
	}
	const { privateKey } = loadKeyPair()
	convertTx.signature = createSignature(convertTx, privateKey).signature
	convertTx.txHash = createTxnHash(convertTx)
	const added = await x.addTransaction(convertTx)
	if (added) {
		console.log('Transaction added successfully waiting for confirmation')
	} else {
		console.log('Failed to add transaction')
	}
}
