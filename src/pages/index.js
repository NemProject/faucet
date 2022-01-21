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

import nemLogo from '../assets/images/nem-logo.png';
import Form from '../components/FaucetForm/faucetForm';
import { FetchPost } from '../services/fetch';
import { getBalance } from '../services/nemRequest';
import styles from '../styles/Home.module.scss';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Setup toast
toast.configure();

const ViewExplorerLink = function (transactionHash) {
	return (
		<div>
			<a
				target="_blank"
				href={`${process.env.NEXT_PUBLIC_EXPLORER}/#/s_tx?hash=${transactionHash}`}
				rel="noreferrer"
			>
				View transaction in explorer.
			</a>
		</div>
	);
};

const Home = function ({ serverError, faucetAccount }) {
	const [formInput, setFormInput] = useState({
		recipientAddress: '',
		amount: ''
	});

	const [isButtonDisable, setIsButtonDisable] = useState(false);

	const isAddressValid = address => {
		const formattedAddress = address.toUpperCase().replace(/-/g, '');

		if (!formattedAddress || 40 !== formattedAddress.length || 'T' !== formattedAddress[0])
			return false;

		return true;
	};

	const onHandleSubmit = async e => {
		e.preventDefault();
		const { recipientAddress, amount } = formInput;

		if (0 === recipientAddress.length || 0 === amount.length) {
			toast.warn('Address and amount can not be empty', { autoClose: 10000 });
			return;
		}

		toast.info('Processing...', { autoClose: 10000 });

		setIsButtonDisable(true);

		if (!isAddressValid(recipientAddress)) {
			toast.warn('Invalid recipient address', { autoClose: 10000 });

			setIsButtonDisable(false);

			return;
		}

		if (amount >= process.env.NEXT_PUBLIC_MAX_SEND_AMOUNT) {
			toast.warn('Transfer amount is too large', { autoClose: 10000 });

			setIsButtonDisable(false);

			return;
		}

		try {
			const { data, error } = await FetchPost('/api/claim', {
				address: recipientAddress,
				amount
			});

			if (!data) {
				toast.error(error.message, { autoClose: 10000 });
				setIsButtonDisable(false);
				return;
			}

			toast.success('Your request is being processed.', { autoClose: false });
			toast.success(ViewExplorerLink(data.transactionHash), { autoClose: false });
		} catch (error) {
			toast.error('Something went wrong, please try again later', { autoClose: 10000 });
		}

		setIsButtonDisable(false);
	};

	if (serverError)
		return (<div>{ serverError.message}</div>);

	return (
		<div>
			<Head>
				<title>NEM Faucet</title>
				<meta name="description" content="NEM Faucet" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div>
				<div className={styles.bgContainer}>
					<div className={styles.bgArtContainer}>
						<div className={styles.bgImageLeft} />
						<div className={styles.bgArtMiddle} />
						<div className={styles.bgImageRight} />
					</div>
				</div>
				<div className={styles.mainContainerWrapper}>
					<div className={styles.mainContainer}>
						<Image
							src={nemLogo}
							alt="nem Logo"
							width={62}
							height={62}
						/>

						<h1 className={styles.title}>NEM Faucet</h1>

						<span className={styles.address}>{ faucetAccount.address }</span>

						<div className={styles.textDescription}>
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
							<a target="_blank" href="https://t.me/nemhelpdesk" rel="noreferrer">@nemhelpdesk</a>
							{' '}
							on Telegram, or
							<a target="_blank" href="https://discord.com/invite/gKDHkNBRhn" rel="noreferrer">#helpdesk</a>
							{' '}
							on Discord.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async () => {
	try {
		const { ...faucetAccount } = await getBalance(process.env.NEXT_PUBLIC_NEM_ADDRESS);

		// Pass data to the page via props
		return { props: { faucetAccount } };
	} catch (error) {
		return {
			props: {
				serverError: {
					message: error.message
				}
			}
		};
	}
};

export default Home;
