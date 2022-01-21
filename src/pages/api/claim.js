/*
 * (C) Symbol Contributors 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

import {
	getBalance, getNetworkTime, announceTransaction, getUnconfirmedTransactions
} from '../../services/nemRequest';
import { toAbsoluteAmount, toRelativeAmount } from '../../utils/helper';
import nemSDK from 'nem-sdk';

/**
 *
 * @param {string} address Account address.
 * @param {number} timestamp Network timestamp.
 * @param {number} amount XEM amount in absolute value.
 * @returns {object} Signed transaction payload.
 */
const createTransferTransaction = (address, timestamp, amount) => {
	const keyPair = nemSDK.crypto.keyPair.create(process.env.NEM_PRIVATE_KEY);
	const message = 'Good Luck!';
	const messagePayload = nemSDK.utils.convert.utf8ToHex(message.toString());

	const entity = {
		type: 257, // Transfer Transaction
		version: -1744830463,
		signer: keyPair.publicKey.toString(),
		timeStamp: timestamp,
		deadline: timestamp + 3600, // 1 hour deadline
		recipient: address,
		amount,
		fee: 100000, // 0.1 XEM
		message: { type: 1, payload: messagePayload },
		mosaics: null
	};

	const result = nemSDK.utils.serialization.serializeTransaction(entity);
	const signature = keyPair.sign(result);

	return {
		data: nemSDK.utils.convert.ua2hex(result),
		signature: signature.toString()
	};
};

/**
 * Transfer XEM
 * @param {string} address Account address.
 * @param {number} amount XEM amount in absolute value.
 * @returns {object} announce status.
 */
const transferXEM = async (address, amount) => {
	// Get network timestamp
	const { timestamp } = await getNetworkTime();
	const networkTimestamp = Math.floor(timestamp / 1000);

	const payload = createTransferTransaction(address, networkTimestamp, amount);

	const result = await announceTransaction(payload);

	return result;
};

/**
 * Claim XEM endpoint
 * @param {object} req An instance of http.IncomingMessage, plus some pre-built middleware.
 * @param {object} res An instance of http.ServerResponse, plus some helper functions.
 */
const claimHandler = async (req, res) => {
	if ('POST' === req.method) {
		const receiptAddress = req.body.address;
		const transferAmount = toAbsoluteAmount((parseInt(req.body.amount, 10) || 0));
		const faucetAddress = process.env.NEXT_PUBLIC_NEM_ADDRESS;
		const maxAmount = parseInt(process.env.NEXT_PUBLIC_MAX_BALANCE, 10);
		const maxTransferAmount = parseInt(process.env.NEXT_PUBLIC_MAX_SEND_AMOUNT, 10);

		try {
			let error = '';
			if (!nemSDK.model.address.isValid(receiptAddress))
				error = 'Address Invalid ';

			if (transferAmount >= maxTransferAmount)
				error = `Transfer amount can not more than ${toRelativeAmount(maxTransferAmount)}`;

			const [receiptBalance, faucetBalance, unconfirmedTransactions] = await Promise.all([
				getBalance(receiptAddress),
				getBalance(faucetAddress),
				getUnconfirmedTransactions(faucetAddress)
			]);

			if (receiptBalance.balance >= maxAmount)
				error = 'Your account already has enough balance.';

			if (faucetBalance.balance < transferAmount)
				error = 'Faucet balance not enough to pay out.';

			const pendingTx = unconfirmedTransactions.filter(item => item.transaction.recipient === receiptAddress);

			if (0 < pendingTx.length)
				error = 'You have pending transaction, please wait for it to be confirmed.';

			if ('' !== error)
				return res.status(400).json({ error });

			// Announce Transfer Transaction
			const result = await transferXEM(receiptAddress, transferAmount);

			return res.status(200).json({ ...result });
		} catch (error) {
			return res.status(400).json({ error: error.message });
		}
	}

	return res.status(403).json({ error: 'Not support GET request' });
};

export default claimHandler;
