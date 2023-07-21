import React, { useState, useEffect } from 'react';
import MLM from '../contract/MLM';
import TOKEN from '../contract/Token';
import MLMnew from "../contract/MLMnew";
import ClientTOKEN from "../contract/ClientToken";
import USDTTOKEN from "../contract/USDTToken";
import { ToastContainer, toast } from 'react-toastify';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { errors, providers } from 'ethers';
import bigInt from 'big-integer';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [handleWithdrawLoader, setHandleWithdrawLoader] = useState(false);
  const [userWithdrawBalance, setUserWithdrawBalance] = useState(0);
  const [userValid, setUserValid] = useState(false);
  const [tokenPrice, setTokePrice] = useState(0);
  const [show, setShow] = useState(false);
  const [popUpwithdrawValue, setPopupWithdrawValue] = useState('');
  const [popUpClaimValue, setPopupClaimValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [buttonStatus, setButtonStatus] = useState('approve');
  const [toggleCard, setToggleCard] = useState('deposit');
  const [regbuttonStatus, setRegButtonStatus] = useState('');
  const [depositAmount, setDepositamount] = useState(0);
  const [approveBtn, setApproveBtn] = useState(true);
  const [refId, setRefId] = useState('')
  const [enterAddress, setEnterAddress] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => {
    console.log('handle show withdraw');
    setShow(true);

  };

  useEffect(() => {

    handleUrl()
    return () => {

    }
  }, [])

  const handleUrl = () => {
    console.log("handle url")
    try {
      let url = window.location.href;
     
      let id = url.split('=')[1]
      setRefId(id)
  

    } catch (error) {
      console.log("🚀 ~ handleUrl ~ error", error)

    }

  };



  useEffect(() => {
    if (userAddress) {
      getUserWalletBalance();
    
    }
    return () => { };
  }, [userAddress]);

  const handleWalletConnect = async () => {
    
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
          } else {
            console.error(err);
          }
        });
      return true;
    } else {
      console.log('Please connect to MetaMask.');
      return false;
    }
  };
  function handleAccountsChanged(accounts) {
    let currentAccount;

    if (window.ethereum) {
      if (window.ethereum.networkVersion !== '80001') {
        return toast.error('Please connect to Polygon Testnet');
      }
    }

    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      // console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      setUserAddress(currentAccount);

      // Do any other work!
    }
  }
  //
  
 


  const getUserWalletBalance = async () => {
    try {


      let url = `https://sssworld.live/dashboard/api/balance.php?address=${userAddress}`;
      let bal = await axios.get(url).then((res, err) => {
        if (err) {
          setUserValid(false);
          console.log('err', err);
        }
        if (res) {
          console.log('🚀 ~ bal ~ res', res);
          setUserValid(true);
          return res;
        }
      });
      console.log('🚀 ~ bal ~ bal', bal);
      if (bal.data == 'Not Valid') {
        setUserWithdrawBalance(0);
      } else {
        setUserWithdrawBalance(bal.data);
      }
    } catch (error) {
      console.log("🚀 ~ getUserWalletBalance ~ error", error)

    }
  };

  const handleUserLogin = async () => {
    
    
    try {
      if (!userAddress) {
        return toast.error('Connect Wallet first!');
      }
      setButtonStatus('login');

      let formdata = new FormData();
      formdata.append('address', userAddress);
      let _reg = axios.post(`https://federalcoin.social/dashboard/api/login.php`,formdata).then((res, err) => {
        if (res) {
         console.log(res);
         console.log(res.data);
         console.log(res.data[1]);
       
         if (res.data[1] === 'Status:200') {
          
          if (window) {

            window?.location?.replace(`https://federalcoin.social/dashboard/dashboard.php?address=${userAddress}`)
         }  
           toast.success('Login success!');
           setButtonStatus('');
         } else {
           toast.error(res.data[0]);
           console.log("🚀 ~ handleUserLogin ~ _par")
           setButtonStatus('');
           
         }
   
          
        
          return res;

        }
        if (err) {
          console.log(err);
        };
      });
      
     
    } catch (error) {
      console.log('🚀 ~ handleUserLogin ~ error', error);
      let parse = JSON.stringify(error);
      let _par = JSON.parse(parse);
      console.log("🚀 ~ handleUserLogin ~ _par", _par)
      toast.error('Please register yourself!');
      setButtonStatus('');
    }
  };

 



  const handleUserRegister = async () => {
    console.log('handle register');
   

    try {
      if (!userAddress) {
        return toast.error('Connect Wallet first!');
      }
      setButtonStatus('register');
      console.log(refId);
      let formdata = new FormData();
      formdata.append('address', userAddress);
      formdata.append('refid',refId);

      
      let _reg = axios.post(`https://federalcoin.social/dashboard/api/register.php`,formdata).then((res, err) => {
        if (res) {
         console.log(res);
         console.log(res.data);
         console.log(res.data[1]);
         if (res.data[1] === 'Status:200') {
          toast.success('Register success!');
         } else {
          
        toast.error(res.data[0]);
        
      }
          
        
          return res;

        }
        if (err) {
          console.log(err);
        };
      });
        console.log("register check");

        

        setButtonStatus('');
      
    } catch (error) {
      let parse = JSON.stringify(error);
      let _par = JSON.parse(parse);
      if (_par?.reason) {
        toast.error(_par?.reason);
      }
      console.log('🚀 ~ handleUserRegister ~ _par', _par);
      setButtonStatus('');
    }
  };

  
  useEffect(() => {
    getAdmin();
    return () => { };
  }, [userAddress]);

  const getAdmin = async () => {
    console.log("🚀 ~ getAdmin ~ userAddress", userAddress)
    try {
      if (userAddress) {
        let owner = await MLM.owner();
        console.log('🚀 ~ getAdmin ~ owner', owner);
        console.log('🚀 ~ getAdmin ~ userAddress', userAddress);
        if (userAddress.toLowerCase() == owner.toLowerCase()) {
          console.log('valid');
          setIsOwner(true);
        }
      }

    } catch (error) {
      console.log('🚀 ~ getAdmin ~ error', error);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className=''>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='logo'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12  d-flex justify-content-center'>
          {isOwner ? (
            <Link
              to={'/admin'}
              className='dashBoard wallet  btn btn-outline border-white text-white withdrawButton'
            >
              Admin
            </Link>
          ) : (
            ''
          )}
        </div>
      </div>

      
      {!isValid ? (
        <div className='container -fluid '>
          <div className='row mt-5'>
            <div className='col-12'>
              <div className='row d-flex justify-content-center'>
                <div
                  className='col-lg-5 col-md-8  p-4 m-2 shadow2 rounded-1 '
                  style={{
                  
                 backgroundColor: ' rgb(245,245,245)'

                  }}
                >
                  <div className='col py-4 '>
                    <div className='row'>
                      <div className='col-md-12 d-flex justify-content-center'>
                        <img
                         
                          src='/assets/fdr_logo.png'
                          alt='logo'
                          loading='lazy'
                          
                          className='myImg'
                        />
                      </div>
                    </div>
                    <div className='row py-3'>
                      <div className='col-md-12 d-flex justify-content-center '>
                        {userAddress ? (
                          <button
                            className='dashBoard wallet  btn btn-outline border-white text-white withdrawButton'
                            

                            disabled
                            style={{
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              width: '160px',
                              whiteSpace: 'nowrap',
                              color: 'black',
                            }}
                          >
                            {' '}
                            {userAddress}
                          </button>
                        ) : (
                          <button
                            className=' wallet2'
                            onClick={handleWalletConnect}
                          >
                            {' '}
                            Connect Wallet{' '}
                          </button>
                        )}
                      </div>
                    </div>
                    {regbuttonStatus === '' ? (
                        <>
                    <div className='row py-3'>
                      <div className='col-12 d-flex  justify-content-center'>
                        <input
                          type='text'
                          class='form-control'
                          id='exampleFormControlInput1'
                          disabled
                          value={userAddress}
                          placeholder=' Wallet Address'
                          style={{
                            backgroundColor: '#D9D9D9',
                            borderColor: ' rgb(20 21 51)',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '18px',
                          }}
                        />
                      </div>
                    
                    </div>
                    </>
                     ) : (
                      ''
                    )}
                    <br/>

                    <div className='row'>
                      <div className='col d-flex justify-content-center'>
                        {buttonStatus === 'login' ? (
                          <div
                            class='spinner-border text-success'
                            role='status'
                          >
                            <span class='visually-hidden'>Loading...</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleUserLogin}
                            className='btn btn-outline border-white text-white withdrawButton'
                          >
                            Login
                          </button>
                        )}
                      </div>
                      <div className='col d-flex justify-content-center'>
                      {regbuttonStatus === '' ? (
                        <>
                        {buttonStatus === 'register' ? (
                          <div
                            class='spinner-border text-success'
                            role='status'
                          >
                            <span class='visually-hidden'>Loading...</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleUserRegister}
                            className='btn btn-outline border-white text-white withdrawButton'
                          >
                            Register
                          </button>
                        )}
                         </>
                     ) : (
                      ''
                    )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}

      
      {isValid ? (
        <div className='container mt-5'>
          <div className='container '>
            <div className='row d-flex justify-content-center'>
              <div
                className='col-lg-5 col-md-8  p-2 m-2 shadow2 rounded-1'
                style={{
                  backgroundColor: 'rgb(20 21 51)',
                }}
              >
                <div className='row'>
                  <div className='col d-flex justify-content-center'>
                    <button
                      onClick={() => setToggleCard('deposit')}
                      className={`btn btn-outline border-white text-white ${toggleCard === 'deposit'
                        ? 'activeButton'
                        : 'withdrawButton'
                        }`}
                    >
                      DEPOSIT
                    </button>
                  </div>
                  <div className='col d-flex justify-content-center'>
                    <button
                      onClick={() => setToggleCard('withdraw')}
                      className={`btn btn-outline border-white text-white ${toggleCard === 'withdraw'
                        ? 'activeButton'
                        : 'withdrawButton'
                        }`}
                    >
                      WITHDRAW
                    </button>
                  </div>
                </div>

                {toggleCard === 'deposit' ? (
                  <div className='row'>
                    <div className='col py-4 '>
                      <div className='row '>
                        <div className='col-12'>
                          <h2 className='text-center pb-4'>DEPOSIT</h2>
                        </div>
                        <div className='col-12 '>
                          <p
                            className='ps-2  border mx-3 py-2 '
                            style={{
                              backgroundColor: '#D9D9D9',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '20px',
                            }}
                          >
                            (My Balance) - ({userWithdrawBalance}
                            {' SSCOIN'})
                          </p>
                        </div>
                      </div>
                      <div className='row  mx-2 '>
                        <div className='col pt-2'>
                          <label htmlFor='input ' className='pb-2'>
                            {' '}
                            Enter Amount
                          </label>
                          <input
                            style={{
                              backgroundColor: '#D9D9D9',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '18px',
                            }}
                            className='form-control '
                            type='text'
                            placeholder='Enter Value'
                            aria-label='default input example'
                            value={depositAmount}
                            onChange={(e) => setDepositamount(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className='row   pb-4'>
                      <div className='dashBoard dashBoard2 pt-4 text-center'>
                        <>
                          {console.log('buttton', buttonStatus)}
                          {approveBtn ? (
                            <>
                              {buttonStatus === 'approve' ? (
                                <div
                                  class='spinner-border text-success'
                                  role='status'
                                >
                                  <span class='visually-hidden'>
                                    Loading...
                                  </span>
                                </div>
                              ) : (
                                <button
                                  className={`btn btn-outline border-white text-white  withdrawButton`}
                                 
                                >
                                  APPROVE
                                </button>
                              )}{' '}
                            </>
                          ) : (
                            ''
                          )}
                          {!approveBtn ? (
                            <>
                              {buttonStatus === 'deposit' ? (
                                <div
                                  class='spinner-border text-success'
                                  role='status'
                                >
                                  <span class='visually-hidden'>
                                    Loading...
                                  </span>
                                </div>
                              ) : (
                                <button
                                  className={`btn btn-outline border-white text-white  withdrawButton`}
                               
                                >
                                  Deposit
                                </button>
                              )}{' '}
                            </>
                          ) : (
                            ''
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {toggleCard === 'withdraw' ? (
                  <div className='row'>
                    <div className='col py-4 '>
                      <div className='row '>
                        <div className='col-12'>
                          <h2 className='text-center pb-4'>WITHDRAWAL</h2>
                        </div>
                        <div className='col-12 '>
                          <p
                            className='ps-2  border mx-3 py-2 '
                            style={{
                              backgroundColor: '#D9D9D9',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '20px',
                            }}
                          >
                            (My Balance) - ({userWithdrawBalance}
                            {' SSCOIN'})
                          </p>
                        </div>
                      </div>
                      <div className='row  mx-2 '>
                        <div className='col pt-2'>
                          <label htmlFor='input ' className='pb-2'>
                            {' '}
                            Enter Amount
                          </label>
                          <input
                            style={{
                              backgroundColor: '#D9D9D9',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '18px',
                            }}
                            className='form-control '
                            type='text'
                            placeholder='Enter Value'
                            aria-label='default input example'
                            value={withdrawValue}
                            onChange={(e) => setWithdrawValue(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className='row   pb-4'>
                      <div className='dashBoard dashBoard2 pt-4 text-center'>
                        <>
                          {!handleWithdrawLoader ? (
                            <button
                              className='btn btn-outline border-white text-white withdrawButton'
                            
                            >
                              Withdraw
                            </button>
                          ) : (
                            <div
                              class='spinner-border text-success'
                              role='status'
                            >
                              <span class='visually-hidden'>Loading...</span>
                            </div>
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          {handleWithdrawLoader ? (
            <div
              className='alert alert-warning bg-danger text-light'
              role='alert'
            >
              Don't refresh the page, otherwise you lost your money.
            </div>
          ) : (
            ''
          )}

          
        </div>
      ) : (
        ''
      )}
    </>
  );
}
