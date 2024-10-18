import * as fs from 'fs'
import * as path from 'path'
import { ec as EC } from 'elliptic'
import { stringToBinary } from '../../lib/bin/stringToBinary'
import { generateSeedFromMnemonic } from 'nexchain/backup/mnemonic/createSeedFromMnemonic'
import { generatePhrase } from 'nexchain/backup/mnemonic/generatePhrase'

// Buat instance dari kurva ECC
const ec = new EC('secp256k1')

// Fungsi untuk menghasilkan pasangan kunci ECC atau membacanya dari file
export const createKeyPair = (): {
	publicKey: string
	privateKey: string
	mnemonic: string
} => {
	const entropy = generateSeedFromMnemonic(generatePhrase())
	const publicKeyPath = path.join(__dirname, '../../../key/public.pem')
	const privateKeyPath = path.join(__dirname, '../../../key/private.pem')
	const mnemonicPath = path.join(__dirname, '../../../key/mnemonic.bin')
	const warningPath = path.join(__dirname, '../../../key/WARNING.txt')

	// Menghasilkan pasangan kunci ECC baru
	const keyPair = ec.genKeyPair({
		entropy: Buffer.from(entropy.seed, 'hex'),
	})
	const publicKey = keyPair.getPublic(true, 'hex')
	const privateKey = keyPair.getPrivate('hex')

	// Pastikan direktori target ada
	const keyDir = path.dirname(publicKeyPath)
	if (!fs.existsSync(keyDir)) {
		fs.mkdirSync(keyDir, { recursive: true })
	}

	const binaryMnemonic = stringToBinary(entropy.mnemonic)

	// Menyimpan kunci ke file
	fs.writeFileSync(publicKeyPath, `NxC${publicKey}`)
	fs.writeFileSync(privateKeyPath, `NxC${privateKey}`)
	fs.writeFileSync(mnemonicPath, binaryMnemonic)
	fs.writeFileSync(
		warningPath,
		`WARNING: DO NOT SHARE ANYTHING IN THIS FILE WITH ANYONE,
     DO NOT REMOVE THIS FILE OR ANY FILES IN IT. THIS FILE IS FOR INTERNAL USE ONLY.
     IF YOU REMOVE THIS FILE OR ANY FILES IN IT, YOU WILL LOSE ALL YOUR WALLET DATA.
    `,
	)

	return {
		publicKey: `NxC${publicKey}`,
		privateKey: `NxC${privateKey}`,
		mnemonic: entropy.mnemonic,
	}
}
