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

import { FetchGet, FetchPost } from './fetch';

const endpoint = 'http://hugetestalice.nem.ninja:7890';

/**
 * Gets account balance.
 * @param {string} address - Account address.
 * @returns {object} Balance - Account balance.
 */
export const getBalance = async address => {
	const { data } = await FetchGet(`${endpoint}/account/get?address=${address}`);

	if (!data)
		throw new Error(`Can't get address balance ${address}`);

	return {
		address: data.account.address,
		balance: data.account.balance
	};
};

/**
 * Announce payload to the network.
 * @param {string} payload - signed transaction payload.
 * @returns {object} announce transaction status.
 */
export const announceTransaction = async payload => {
	const { data } = await FetchPost(`${endpoint}/transaction/announce`, payload);

	if (!data)
		throw new Error(`Can't announce transaction: ${payload}`);

	return {
		message: data.message,
		transactionHash: data.transactionHash.data
	};
};

/**
 * Gets timestamp from network.
 * @returns {object} timestamp.
 */
export const getNetworkTime = async () => {
	const { data } = await FetchGet(`${endpoint}/time-sync/network-time`);

	if (!data)
		throw new Error('Can not get network time.');

	return {
		timestamp: data.sendTimeStamp
	};
};
