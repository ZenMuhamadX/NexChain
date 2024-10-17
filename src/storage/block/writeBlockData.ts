import { leveldb } from 'src/leveldb/block'
import { Block } from 'src/model/blocks/block'

export const writeBlockHash = (blockHash: string, blockData: Block): void => {
	const parsedBlockData = JSON.stringify(blockData, null, 2)
	// Tulis Buffer ke dalam file dengan nama yang dihasilkan
	leveldb.put(`blockHash:${blockHash}`, parsedBlockData, {
		keyEncoding: 'buffer',
		valueEncoding: 'buffer',
		sync: true,
	})
}
