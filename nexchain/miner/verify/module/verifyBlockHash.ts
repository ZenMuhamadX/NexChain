import { createHash } from 'crypto'
import { structBlockReadyToHash } from 'nexchain/lib/block/convertBlock'
import { Block } from 'nexchain/model/block/block'

// Metode verifikasi hash
export const verifyBlockHash = (
	block: Block,
	nonce: number,
	hash: string,
): boolean => {
	const BufferData: Buffer = structBlockReadyToHash(block)
	const input = Buffer.concat([BufferData, Buffer.from(nonce.toString())])
	const computedHash = createHash('sha256').update(input).digest('hex')

	// Periksa apakah hash yang dihitung cocok dan memenuhi kriteria kesulitan
	return computedHash === hash
}
