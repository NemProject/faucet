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

import './faucetForm.scss';
import PropTypes from 'prop-types';
import React from 'react';

const Form = function ({
	formInput, setFormInput, submitForm, isButtonDisable
}) {
	const onHandleChange = event => {
		setFormInput({
			...formInput,
			[event.target.name]: event.target.value
		});
	};

	return (
		<div className="formContainer">
			<input
				name="recipientAddress"
				value={formInput.recipientAddress}
				className="formInput"
				type="text"
				placeholder="Your Testnet Address (Starts with T)"
				onChange={onHandleChange}
			/>

			<input
				name="amount"
				value={formInput.amount}
				className="formInput"
				type="number"
				placeholder="XEM Amount (Max 10,000)"
				onChange={onHandleChange}
			/>

			<button
				className="formButton"
				type="submit"
				onClick={e => submitForm(e)}
				disabled={isButtonDisable}
			>
				Claim
			</button>
		</div>
	);
};

Form.propTypes = {
	formInput: PropTypes.exact({
		recipientAddress: PropTypes.string.isRequired,
		amount: PropTypes.string.isRequired
	}).isRequired,
	setFormInput: PropTypes.func.isRequired,
	submitForm: PropTypes.func.isRequired,
	isButtonDisable: PropTypes.bool.isRequired
};
export default Form;
