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

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import { FetchPost } from '../services/fetch'
import { getBalance } from '../services/nemRequest'

const Home = ({error, faucetAccount}) => {

  const [address, setAddress] = useState('');
  const [claimStatus, setClaimStatus] = useState({
    isClickable: true,
    status: '',
    hashUrl: ''
  });

  const isAddressValid = (address) => {
    const recipientAddress = address.toUpperCase().replace(/-/g, '');

    if (!recipientAddress || recipientAddress.length !== 40 || recipientAddress[0] !== 'T') {
      return false;
    }

    return true
  }

  const onHandleChange = (e) => {
    setAddress(e.target.value);
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    setClaimStatus({
      ...claimStatus,
      isDisabled: true,
      status: 'Processing...',
      hashUrl: ''
    });

    if (!isAddressValid(address)) {
      setClaimStatus({
        status: 'Invalid recipient address',
        isDisabled: false
      })

      return;
    }

    try {
      const { data, error } = await FetchPost("/api/claim", {
        address: address
      })

      setClaimStatus({
        ...claimStatus,
        isDisabled: false
      })

      if (!data) {
        setClaimStatus({
          ...claimStatus,
          status: error.message,
        })
      } else {
        setClaimStatus({
          ...claimStatus,
          status: `Faucet is on the way to your wallet ${data.transactionHash}`,
          hashUrl: `${process.env.NEXT_PUBLIC_EXPLORER}/#/s_tx?hash=${data.transactionHash}`,
        })
      }
    } catch (error) {
      console.log('onHandleSubmit error :>> ', error);
      setClaimStatus({
        ...claimStatus,
        status: 'Something went wrong, please try again later',
      })
    }
  }

  // Handle Error
  if (error) {
    return (<div> { error.message}</div>)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>NEM Faucet</title>
        <meta name="description" content="NEM Faucet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          NEM Faucet
        </h1>

        <div>
          Faucet Address: { faucetAccount.address }
        </div>

        <div>Amount: { faucetAccount.balance } XEM</div>

        <input type='text' value={address} placeholder='NEM Address' onChange={onHandleChange}></input>

        <button disabled={claimStatus.isDisabled} onClick={onHandleSubmit}>Claim</button>

        { claimStatus ? <div> <a href={claimStatus.hashUrl}> { claimStatus.status } </a></div> : null }

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export const getServerSideProps = async (context) =>{

  try {
    const { ...faucetAccount } = await getBalance(process.env.NEXT_PUBLIC_NEM_ADDRESS);

    // Pass data to the page via props
    return { props: { faucetAccount } }
  } catch (error) {

    console.error(error);

    return {
      props: {
        error:{
          message: error.message
        }
      }
    }
  }
}

export default Home;