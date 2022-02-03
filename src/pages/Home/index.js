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

import './Home.scss';
import nemLogo from '../../assets/images/nem-logo.png';
import Form from '../../components/FaucetForm';
import Footer from '../../components/Footer';
import NemRequest from '../../services/nemRequest';
import Helper from '../../utils/helper';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Setup toast
toast.configure();

// Todo
// const ViewExplorerLink = function (transactionHash) {
// 	return (
// 		<div>
// 			<a
// 				target="_blank"
// 				href={`${process.env.REACT_APP_EXPLORER}/#/s_tx?hash=${transactionHash}`}
// 				rel="noreferrer"
// 			>
// 				View transaction in explorer.
// 			</a>
// 		</div>
// 	);
// };

const Home = function () {
	const faucetAccount = process.env.REACT_APP_FAUCET_ADDRESS;
	const requiredFaucetBalance = parseInt(process.env.REACT_APP_REQ_FAUCET_BALANCE, 10);

	const [formInput, setFormInput] = useState({
		recipientAddress: '',
		amount: ''
	});

	const [isButtonDisable, setIsButtonDisable] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const { response, error } = await NemRequest.getAccountInfo(faucetAccount);

			if (response) {
				// Check faucet account balance
				if (requiredFaucetBalance >= response.data.account.balance)
					toast.warn('Faucet out of fund.', { autoClose: false });
			}

			if (error)
				toast.warn('Cannot get faucet address info.', { autoClose: false });
		};

		fetchData();
	}, [faucetAccount, requiredFaucetBalance]);

	const validation = () => {
		const { recipientAddress, amount } = formInput;

		// Check address length
		if (0 === recipientAddress.length || 0 === amount.length) {
			toast.warn('Address and amount can not be empty', { autoClose: 10000 });
			return false;
		}

		// Check address network type
		if (!Helper.isNemTestnetAddressValid(recipientAddress)) {
			toast.warn('Invalid recipient address', { autoClose: 10000 });
			return false;
		}

		// Check request amount
		if (amount >= process.env.REACT_APP_MAX_SEND_AMOUNT) {
			toast.warn('Transfer amount is too large', { autoClose: 10000 });
			return false;
		}

		return true;
	};

	const onHandleSubmit = async e => {
		e.preventDefault();

		toast.dismiss();

		setIsButtonDisable(true);

		// Form validation
		if (!validation()) {
			setIsButtonDisable(false);
			return;
		}

		toast.info('Processing...', { autoClose: 10000 });

		try {
			// Todo: request faucet from the endpoint.

			// toast.success('Your request is being processed.', { autoClose: false });
			// toast.success(ViewExplorerLink(data.transactionHash), { autoClose: false });
		} catch (error) {
			// Close all toast
			toast.error('Something went wrong, please try again later', { autoClose: 10000 });
		}

		setIsButtonDisable(false);
	};

	return (
		<div>
			<div className="bgContainer">
				<div className="bgArtContainer">
					<div className="bgImageLeft" />
					<div className="bgArtMiddle" />
					<div className="bgImageRight" />
				</div>
			</div>
			<div className="mainContainerWrapper">
				<div className="mainContainer">
					<img
						src={nemLogo}
						alt="nem Logo"
						width={62}
						height={62}
					/>

					<h1 className="title">NEM Faucet</h1>

					<span className="address">{ faucetAccount.address }</span>

					<div className="textDescription">
						<p>
							Thirsty? Take a drink.
							{' '}
							<br />
							This faucet is running on the Symbol testnet and dispenses up to 10,000 XEM per account.
						</p>
					</div>

					<Form
						formInput={formInput}
						setFormInput={setFormInput}
						submitForm={onHandleSubmit}
						isButtonDisable={isButtonDisable}
					/>

					<p>Done with your XEM? Send it back to the faucet. Remember, sharing is caring!</p>

					<p>
						If you’re looking to set up a voting node on Symbol (minimum 3,000,000 XEM), please send a request to
						<a target="_blank" href="https://t.me/nemhelpdesk" rel="noreferrer"> @nemhelpdesk</a>
						{' '}
						on Telegram, or
						<a target="_blank" href="https://discord.com/invite/gKDHkNBRhn" rel="noreferrer"> #helpdesk</a>
						{' '}
						on Discord.
					</p>

					<Footer />
				</div>
			</div>
		</div>
	);
};

export default Home;
