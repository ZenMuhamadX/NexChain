import { verifyStruct } from './module/verifyStruct'
import { verifyPow } from './module/verifyPow'
import { verifyHashLength } from './module/verifyHashLength'
import { verifyBlockHash } from './module/verifyBlockHash'
import { getBlockByHeight } from 'nexchain/block/query/direct/block/getBlockByHeight'

// Function to verify the integrity of the blockchain
export const verifyChainIntegrity = async (): Promise<boolean> => {
	console.info('Checking chain integrity...')
	let currentHeight = 0
	while (true) {
		const block = await getBlockByHeight(currentHeight)
		if (!block) {
			console.info('Chain integrity verified.')
			return true
		}
		verifyStruct(block)
		verifyPow(block)
		verifyHashLength(block.block.header.hash)
		verifyBlockHash(block, block.block.header.nonce, block.block.header.hash)
		currentHeight++
	}
}
