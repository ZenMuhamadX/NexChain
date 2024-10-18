/** @format */

import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../miner/Pow'
import { Block } from '../model/block/block'
import { createSignature } from '../lib/block/createSignature'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { calculateSize } from '../lib/utils/calculateSize'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { calculateTotalFees } from 'nexchain/transaction/utils/totalFees'
import { saveBlock } from 'nexchain/storage/block/saveBlock'
import { getNetworkId } from 'Network/utils/getNetId'
import { getBlockByHeight } from './query/direct/block/getBlockByHeight'
import { countHashDifficulty } from 'nexchain/lib/hash/countHashDifficulty'
import { loadKeyPair } from 'nexchain/account/utils/loadKeyPair'

export const createGenesisBlock = async (): Promise<Block | undefined> => {
	const block = await getBlockByHeight(0)
	if (block) {
		console.log('Genesis block already exists.')
		return undefined
	}
	try {
		const { privateKey } = loadKeyPair()
		const genesisBlock = new Block({
			header: {
				difficulty: 0,
				hash: '',
				nonce: 0,
				previousBlockHash:
					'0000000000000000000000000000000000000000000000000000000000000000',
				timestamp: generateTimestampz(),
				version: '1.0.0',
				hashingAlgorithm: 'SHA256',
			},
			blockReward: 5000000,
			totalTransactionFees: 0,
			height: 0,
			merkleRoot:
				'0000000000000000000000000000000000000000000000000000000000000000',
			networkId: getNetworkId(),
			signature: '',
			size: 0,
			status: 'confirmed',
			coinbaseTransaction: {
				amount: 5000000,
				reward: 5000000,
				to: 'NxC16UUyJeUMzrNygmf1zcCcZxjqgKCJwJtfd',
			},
			validator: {
				rewardAddress: 'NxC16UUyJeUMzrNygmf1zcCcZxjqgKCJwJtfd',
				stakeAmount: 0,
				validationTime: generateTimestampz(),
			},
			metadata: {
				gasPrice: 0,
				created_at: generateTimestampz(),
				txCount: 0,
				notes:
					'Hassan Nasrallah Killed by Israel,Hezbollah Promises to Continue the War 29/9/2024',
			},
			transactions: [],
		})
		genesisBlock.block.totalTransactionFees = calculateTotalFees(
			genesisBlock.block.transactions,
		)
		genesisBlock.block.signature = createSignature(
			genesisBlock.block.header.hash,
			privateKey,
		).signature
		const validHash = proofOfWork(genesisBlock)
		genesisBlock.block.header.difficulty = countHashDifficulty(validHash.hash)
		genesisBlock.block.header.hash = validHash.hash
		genesisBlock.block.header.nonce = validHash.nonce
		genesisBlock.block.size = calculateSize(genesisBlock.block).KB
		putBalance('NxC16UUyJeUMzrNygmf1zcCcZxjqgKCJwJtfd', {
			address: 'NxC16UUyJeUMzrNygmf1zcCcZxjqgKCJwJtfd',
			balance: genesisBlock.block.coinbaseTransaction.reward,
			timesTransaction: 0,
		})
		saveBlock(genesisBlock)
		return genesisBlock
	} catch (error) {
		loggingErr({
			error: error,
			context: 'createGenesisBlock',
			hint: 'Error creating genesis block',
			warning: null,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		throw new Error('Failed to create genesis block.')
	}
}
