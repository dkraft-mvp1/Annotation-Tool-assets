/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import TextInputGray from '../_atomic-design/molecules/Input/TextInputGray'
import GeneralText from '../_atomic-design/atoms/Text/GeneralText'
import GeneralButton from '../_atomic-design/atoms/Button/GeneralButton'
import SelectedCard from '../_atomic-design/molecules/Others/SelectedCard'
import MainBackgroundSrc from '../assets/images/MainBackground.svg'
import {
  authrequest,
  makeServerRequest,
  makeUrlRequest
} from '../utils/helpers'
import { useSelector } from 'react-redux'
import PlanCardsConfig from './PlansData'
import PaymentSuccessful from '../containers/Modals/PaymentSuccessful'
import TermsNConditions from './Modals/TermsNConditionsModal'
import HomeNavbar from '../_atomic-design/molecules/Navbars/HomeNavbar'
import { RAZOR_KEY, COMPANY_NAME } from '../config/config'

export default function DashBoard (route, navigation) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [planId, setPlanId] = useState(searchParams.get('planId'))
  const [currentId, setCurrentId] = useState(1)
  const [countryName, setCountryName] = useState('India')
  const [promoCodeTxt, setPromoCodeTxt] = useState('')
  const [selectedIntPrice, setSelectedIntPrice] = useState(0)
  // location.state.amount
  const [discAmount, setDiscAmount] = useState(0)
  const [gstAmount, setGstAmount] = useState(0)
  // (location.state.amount * 0.18).toFixed(2)
  const [subtotalPrice, setSubtotalPrice] = useState(0)
  // (location.state.amount + location.state.amount * 0.18).toFixed(2)
  const [promoProgress, setPromoProgress] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [hidePromoInput, setHidePromoInput] = useState(false)
  const [payProgress, setPayProgress] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [plan, setPlan] = useState(false)
  const [showPaymentSuccessful, setShowPaymentSuccessful] =
        React.useState(false)
  const [showTermsNConditions, setShowTermsNConditions] =
        React.useState(false)
  const [agree, setAgree] = useState(false)
  const authState = useSelector((state) => state.authReducer)

  const checkPromocode = (code) => {
    setPromoProgress(true)
    setPromoCodeTxt(code)

    const respromo = makeServerRequest('/discount/validate', 'POST', {
      promoCode: code
    })
    respromo.then((res) => {
      if (res.data.success === true) {
        setDiscAmount(res.data.discountAmount)
        setGstAmount(
          (
            (selectedIntPrice - res.data.discountAmount) *
                        0.18
          ).toFixed(2)
        )
        setSubtotalPrice(
          (
            selectedIntPrice -
                        res.data.discountAmount +
                        (selectedIntPrice - res.data.discountAmount) * 0.18
          ).toFixed(2)
        )
        setHidePromoInput(true)
        setPromoError('')
        alert('Successfully applied coupon code')
        setPromoProgress(false)
        sessionStorage.setItem('promo', code)
      } else if (res.data.success === false) {
        setDiscAmount(0)
        setSubtotalPrice(
          (selectedIntPrice + selectedIntPrice * 0.18).toFixed(2)
        )
        setGstAmount((selectedIntPrice * 0.18).toFixed(2))
        setHidePromoInput(false)
        setPromoProgress(false)
        setPromoError('Applied coupon code is not Valid')
      }
    })
  }

  const applyPromoCode = () => {
    if (promoCodeTxt === '') {
      setPromoError('Please enter your coupon code')
    } else {
      const promoCode = promoCodeTxt.toUpperCase()

      checkPromocode(promoCode)
    }
  }

  const handleRazorPay = (res) => {
    const orID = res.data.id
    if (res.data.amount === 0) {
      setShowPaymentSuccessful(true)
    } else {
      const rzrpy = new window.Razorpay({
        // rzp_test_poa85ul227bw1R quizkraft test
        key: RAZOR_KEY,
        name: COMPANY_NAME,
        order_id: orID,
        handler: function (response) {
          const razorBody = JSON.stringify({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          })
          const captureOrder = authrequest(
            '/orders/captureOrder',
            'POST',
            razorBody
          )
          captureOrder.then((res) => {
            sessionStorage.removeItem('promo')
            if (res.data.success) {
              setShowPaymentSuccessful(true)
              // navigate('/subscription')
            } else {
              alert(res.data.message)
            }
          })
        },
        prefill: {
          name: authState.firstName + ' ' + authState.lastName,
          email: authState.email,
          contact: ''
        },
        notes: {
          address: 'Dkraft IIITD Office'
        },
        theme: {
          color: '#011d11'
        }
      })
      rzrpy.open()
    }
  }

  const handleCoupon = (e) => {
    setPromoCodeTxt(e.target.value)
    setDiscAmount(0)
    setSubtotalPrice(
      (selectedIntPrice + selectedIntPrice * 0.18).toFixed(2)
    )
    setGstAmount((selectedIntPrice * 0.18).toFixed(2))
    setPromoError('')
  }

  const handleLocation = () => {
    const res = makeUrlRequest('https://ipapi.co/json/', 'GET', {})
    res.then((res) => {
      const data = res.data
      const countryName = data.country_name
      if (countryName) {
        setCountryName(countryName)
      }
    })
  }
  const getPlanDetails = () => {
    const razorBody = JSON.stringify({
      planId: planId
    })
    const capturePlans = authrequest(
      '/plans/planDetailsById',
      'POST',
      razorBody
    )
    capturePlans.then((plansRes) => {
      if (plansRes.status === 200) {
        const planData = plansRes.data.plan
        const planAmount = parseFloat(planData.amount.$numberDecimal)
        setSelectedIntPrice(planAmount)
        setGstAmount((planAmount * 0.18).toFixed(2))
        setSubtotalPrice((planAmount + planAmount * 0.18).toFixed(2))
        setPlan(planData)
      } else {
        alert('something went wrong')
      }
    })
  }
  const checkboxHandler = () => {
    // if agree === true, it will be set to false
    // if agree === false, it will be set to true
    setAgree(!agree)
    // Don't miss the exclamation mark
  }

  /* eslint-disable no-unused-vars */
  const subscribe = async (e) => {
    if (payProgress === true) {
      alert('On progress please wait. ')
      return 0
    }
    setPayProgress(true)
    if (authState.isLoggedIn) {
      const subscriptionBody = JSON.stringify({
        planId: planId,
        discountCode: promoCodeTxt,
        countryName: countryName
      })
      const orderRes = await authrequest(
        '/orders',
        'POST',
        subscriptionBody
      )
      if (orderRes.data.success) {
        handleRazorPay(orderRes)
      } else {
        alert(orderRes.data.message)
      }
    } else {
      sessionStorage.setItem('plansUrl', '/plans')
      navigate('/auth?mode=login')
    }
    setPayProgress(false)
  }
  useEffect(async () => {
    document.title = 'Plans'
    if (authState.isLoggedIn) {
      getPlanDetails()
      handleLocation()
    } else {
      alert('You are not loged in please login.')
      setTimeout(() => {
        navigate('/Auth?mode=login')
      }, 1000)
    }
  }, [])

  const bgStyle = {
    backgroundImage: `url(${MainBackgroundSrc})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'right'
  }

  return (
        <div className="pt-24 pb-10 bg-[#F3F0FA] min-h-full" style={bgStyle}>
            <PaymentSuccessful
                active={showPaymentSuccessful}
                setActive={() =>
                  setShowPaymentSuccessful(!showPaymentSuccessful)
                }
            />
            <TermsNConditions
                active={showTermsNConditions}
                setActive={() => setShowTermsNConditions(!showTermsNConditions)}
            />
            <HomeNavbar white />
            <div className=" min-h-full w-11/12 mx-auto flex flex-col lg:flex-row justify-around items-center gap-y-6">
                <div className="">
                {plan
                  ? (
                                <SelectedCard
                                    key='dfsdfjkkdfjkey'
                                    onClick={() => {
                                      setCurrentId(planId)
                                    }}
                                    currentId={currentId}
                                    setCurrentId={setCurrentId}
                                    card={plan}
                                    className="w-fit shadow-app-primary shadow-lg"
                                />)
                  : (null)
                                  }
                </div>
                <div className="bg-white rounded-2xl p-10 md:p-16 w-min shadow-app-primary shadow-lg">
                    <div className="flow-root">
                          <TextInputGray
                            className={' text-lg float-left'}
                            defaultValue={''}
                            placeholder={'Coupon Code'}
                            label={''}
                            id={'cuponcode'}
                            onChange={handleCoupon}
                        />
                        {promoProgress
                          ? (
                            <GeneralButton
                                content={'Applying..'}
                                className=" mt-2 ml-1  rounded-lg text-white bg-gray-400 w-[120px] h-[35px] float-right"
                            />
                            )
                          : (
                            <GeneralButton
                                content={'Apply Coupon'}
                                className=" mt-2 ml-1  rounded-lg text-white bg-app-primary w-[120px] h-[35px] float-right "
                                onClick={applyPromoCode}
                            />
                            )}
                    </div>
                    <div className="px-2">
                      <GeneralText
                          className={'mt-2 text-app-red text-center'}
                          text={`${promoError} `}
                          textColor="#000000"
                      />
                      <hr className=" mt-2 "></hr>
                      <div className="flex">
                          <GeneralText
                              className={'mt-2 text-app-black-light text-center '}
                              text="Individual Plan Amount "
                              textColor="#000000"
                          />

                          <GeneralText
                              className={
                                  'mt-2 text-app-black-light text-right flex-auto'
                              }
                              text={`${selectedIntPrice} `}
                              textColor="#000000"
                          />
                      </div>
                      <div className="flex">
                          <GeneralText
                              className={'mt-2 text-app-black-light text-center'}
                              text="coupon discount"
                              textColor="#000000"
                          />
                          <GeneralText
                              className={
                                  'mt-2 text-app-black-light text-right flex-auto'
                              }
                              text={`${discAmount} `}
                              textColor="#000000"
                          />
                      </div>
                      <div className="flex">
                          <GeneralText
                              className={'mt-2 text-app-black-light text-center'}
                              text="GST @ 18%"
                              textColor="#000000"
                          />
                          <GeneralText
                              className={
                                  'mt-2 text-app-black-light text-right flex-auto'
                              }
                              text={` ${gstAmount} `}
                              textColor="#000000"
                          />
                      </div>
                      <div className="flex">
                          <GeneralText
                              className={'mt-2 text-app-black-light text-center'}
                              text="Sub Total"
                              textColor="#000000"
                          />
                          <GeneralText
                              className={
                                  'mt-2 text-app-black-light text-right flex-auto'
                              }
                              text={`${subtotalPrice} `}
                              textColor="#000000"
                          />
                      </div>
                    </div>
                    <div className="mt-4 ">
                        <input
                            type="checkbox"
                            id="agree"
                            onChange={checkboxHandler}
                            className="mr-1"
                        />
                        <label htmlFor="agree">
                            {' '}
                            I agree to{' '}
                            <b
                                className="cursor-pointer text-blue-500 "
                                onClick={() =>
                                  setShowTermsNConditions(
                                    !showTermsNConditions
                                  )
                                }
                            >
                                Terms and Conditions
                            </b>
                        </label>
                    </div>
                    {!agree
                      ? (
                        <GeneralButton
                            content={'Continue'}
                            className="mt-5 w-[220px] sm:w-[392px] mx-auto h-12 rounded-lg text-white bg-gray-400"
                        />
                        )
                      : (
                        <GeneralButton
                            content={'Continue'}
                            className="mt-5 w-[220px] sm:w-[392px] h-12 rounded-lg text-white bg-app-primary"
                            onClick={subscribe}
                        />
                        )}
                </div>
            </div>
        </div>
  )
}
