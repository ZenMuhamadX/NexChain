import path from 'path'
import fs from 'fs'
import { createKeyPair } from './createKeyPair'

// Fungsi untuk memuat kunci dari file atau menghasilkan kunci baru jika belum ada
export const loadKeyPair = (): {
	publicKey: string
	privateKey: string
	mnemonic: string
} => {
	// Tentukan path file kunci
	const publicKeyPath = path.join(__dirname, '../../../key/public.pem')
	const privateKeyPath = path.join(__dirname, '../../../key/private.pem')
	const mnemonicPath = path.join(__dirname, '../../../key/mnemonic.bin')

	// Cek apakah file kunci sudah ada
	if (
		fs.existsSync(publicKeyPath) &&
		fs.existsSync(privateKeyPath) &&
		fs.existsSync(mnemonicPath)
	) {
		// Membaca kunci dari file
		const publicKey = fs.readFileSync(publicKeyPath, 'utf8')
		const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
		const mnemonic = fs.readFileSync(mnemonicPath, 'utf8')
		return { publicKey, privateKey, mnemonic }
	} else {
		// Jika tidak ada, panggil getKeyPair untuk menghasilkan kunci baru
		return createKeyPair()
	}
}
