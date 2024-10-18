import { loadKeyPair } from 'nexchain/account/utils/loadKeyPair'

export const init = (): void => {
	console.log('Initializing...')
	loadKeyPair()
}
init()
