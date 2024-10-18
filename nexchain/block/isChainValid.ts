import { chains } from './initBlock'

export const isChainsValid = async (): Promise<boolean> => {
	return await chains.verify()
}
