export interface structJsonValue {
	to: string // The recipient of the transaction
	from: string // The sender of the transaction
	amount: number // The amount of cryptocurrency being transferred
	timestamp?: number | string // The timestamp of when the transaction was created
	signature?: string // The digital signature of the transaction
	message?: string // An optional message included with the transaction
	fee?: number // The fee associated with the transaction (optional)
	status?: string // The status of the transaction (optional)
}
