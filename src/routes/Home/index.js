/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react'
import MainBackgroundSrc from '../../assets/images/MainBackground.svg'
import { makeServerRequest } from '../../utils/helpers'
import ButtonPrimary from '../../_atomic-design/atoms/Button/ButtonPrimary'
import GeneralButton from '../../_atomic-design/atoms/Button/GeneralButton'

export default function ContactUs () {
  const [question, setQuestion] = useState('question1')
  const [questionId, setQuestionId] = useState('')
  const [context, setContext] = useState('context1 with text answer1')
  const [answer, setAnswer] = useState('answer1')
  const [startAnswer, setStartAnswer] = useState(5)
  const [endAnswer, setEndAnswer] = useState(10)
  const [noOfQue, setNoOfQue] = useState(400001)
  const [agree, setAgree] = useState(false)
  const contextRef = useRef(null)

  const handlemouseup = (e) => {
    e.preventDefault()
    const textVal = contextRef.current
    const cursorStart = textVal.selectionStart
    const cursorEnd = textVal.selectionEnd
    const selectedValue = context.substring(cursorStart, cursorEnd)
    console.log(cursorStart, cursorEnd, selectedValue)
    setAnswer(selectedValue)
    setStartAnswer(cursorStart)
    setEndAnswer(cursorEnd)
    setAgree(false)
  }

  const updateQuestion = async (indexNumber) => {
    console.log('testing')
    const res = await makeServerRequest('/databuilder/update', 'POST', {
      index: indexNumber,
      _id: questionId,
      answer,
      answer_start: startAnswer,
      context,
      question,
      validated: agree

    })
    if (res.status === 200) {
      const questiondoc = res.data.questionData
      console.log('successfully updated')
      // setContext(questiondoc.context)
      // setNoOfQue(questiondoc.index)
      // setAnswer(questiondoc.answer)
      // setQuestion(questiondoc.question)
      // setStartAnswer(questiondoc.answer_start)
      // setEndAnswer(questiondoc.answer.length + questiondoc.answer_start)
    } else {
      alert('index not found code 2043')
    }
  }

  const getQuestion = async (indexNumber) => {
    console.log('testing')
    try {
      const res = await makeServerRequest('/databuilder/getByIndex', 'POST', {
        index: indexNumber
      })
      if (res === undefined) {
        alert('network error or server not found ')
        return 0
      }
      if (res.status === 200) {
        const questiondoc = res.data.questionData
        setQuestionId(questiondoc._id)
        setContext(questiondoc.context)
        setNoOfQue(questiondoc.index)
        setAnswer(questiondoc.answer)
        setQuestion(questiondoc.question)
        setStartAnswer(questiondoc.answer_start)
        setEndAnswer(questiondoc.answer.length + questiondoc.answer_start)
        if ((questiondoc.validated != null) || (questiondoc.validated !== undefined)) {
          setAgree(questiondoc.validated)
        } else {
          setAgree(true)
        }
      } else {
        alert('index not found code 2043')
      }
    } catch (error) {
      console.error(error) // You might send an exception to your error tracker like AppSignal
      return error
    }
  }

  const checkboxHandler = (e) => {
    setAgree(!agree)
  }
  const startAnsHandler = (e) => {
    e.preventDefault()
    let val = e.target.value
    if (val < 0) {
      val = 0
    }
    const nval = Number(val)
    setStartAnswer(nval)
  }
  const endAnswerHandler = (e) => {
    e.preventDefault()
    let val = e.target.value
    if (val < 0) {
      val = 0
    }
    const nval = Number(val)
    setEndAnswer(nval)
  }
  const handleQueDecrement = async (e) => {
    e.preventDefault()
    console.log('handleQueDecrement')
    let val = noOfQue - 1
    if (val < 1) {
      val = 1
    }
    const nval = Number(val)
    setNoOfQue(nval)
    getQuestion(nval)
  }

  const handleQueIncrement = async (e) => {
    e.preventDefault()
    console.log('handleQueIncrement')
    const val = noOfQue + 1
    const nval = Number(val)
    setNoOfQue(nval)
    getQuestion(nval)
  }
  const handleChangeNoQue = (e) => {
    e.preventDefault()
    console.log('changeNoQue')
    let val = e.target.value
    if (val < 0) {
      val = 0
    }
    const nval = Number(val)
    // const nval = Number(val)
    setNoOfQue(nval)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    updateQuestion(noOfQue)
    const val = noOfQue + 1
    const nval = Number(val)
    setNoOfQue(nval)
    getQuestion(nval)
  }

  const handleContextArea = async (e) => {
    e.preventDefault()
    setContext(e.target.value)
    setAgree(false)
  }

  const handleQuestionArea = async (e) => {
    e.preventDefault()
    setQuestion(e.target.value)
    setAgree(false)
  }
  const handleAnswerArea = async (e) => {
    e.preventDefault()
    setAnswer(e.target.value)
    setAgree(false)
  }
  const bgStyle = {
    backgroundImage: `url(${MainBackgroundSrc})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
  useEffect(() => {
    console.log('useEffect')
    getQuestion(noOfQue)
  }, [])
  return (<>
        <div
            className="w-full min-h-screen pt-2 overflow-hidden"
            style={bgStyle}
        >
            <div className=" bg-white w-11/12 sm:w-4/5 mx-auto overflow-hidden mb-8">
                <div className=" max-w-7xl mx-auto lg:grid lg:grid-cols-5">
                    <div className="bg-gray-50 py-2 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
                        <div className="max-w-lg mx-auto">
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                Question
                            </h2>
                            <dl className="mt-2 text-base text-gray-500">
                                <div>
                                    <label
                                        htmlFor="question"
                                        className="sr-only"
                                    >
                                        Question
                                    </label>
                                    <textarea
                                        id="question"
                                        name="question"
                                        rows="2"
                                        className="block w-full shadow-sm bg-[#F4F7F9] rounded-lg py-3 px-4 outline-none focus:border focus:border-blue-600 border"
                                        placeholder="question"
                                        value={question}
                                        onChange={handleQuestionArea}
                                        required
                                    ></textarea>
                                </div>
                            </dl>
                        </div>
                        <div className="max-w-lg mx-auto">
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                Answer
                            </h2>
                            <dl className="mt-2 text-base text-gray-500">
                                <div>
                                    <label
                                        htmlFor="answer"
                                        className="sr-only"
                                    >
                                        Answer
                                    </label>
                                    <textarea
                                        id="answer"
                                        name="answer"
                                        rows="2"
                                        className="block w-full shadow-sm bg-[#F4F7F9] rounded-lg py-3 px-4 outline-none focus:border focus:border-blue-600 border"
                                        placeholder="answer"
                                        value={answer}
                                        onChange={handleAnswerArea}
                                        required
                                    ></textarea>
                                </div>
                                <div className='block w-full shadow-sm bg-[#F4F7F9] rounded-lg py-3 px-4  focus:border focus:border-blue-600 border mt-4'>
                                    <input type="number" id="startAnswerNumber" value={startAnswer.toString()} onChange={startAnsHandler} className='outline-none'/>
                                    <label htmlFor="startAnswerNumber"><b className='cursor-pointer text-blue-500 ' > Start</b></label>
                                </div>
                                <div className='block w-full shadow-sm bg-[#F4F7F9] rounded-lg py-3 px-4 outline-none focus:border focus:border-blue-600 border mt-4'>
                                    <input type="number" id="endAnswerNumber" value={endAnswer.toString()} onChange={endAnswerHandler} className='outline-none'/>
                                    <label htmlFor="endAnswerNumber"><b className='cursor-pointer text-blue-500 ' > End</b></label>
                                </div>
                            </dl>
                        </div>
                    </div>
                    <div className="bg-white px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
                        <div className="max-w-lg mx-auto lg:max-w-none">
                            <form
                                className="grid grid-cols-1 gap-y-6"
                            >
                                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                    Context Details
                                </h2>
                                <div>
                                    <label
                                        htmlFor="context"
                                        className="sr-only"
                                    >
                                        Context
                                    </label>
                                    <textarea
                                        id="context"
                                        ref={contextRef}
                                        onMouseUp = {handlemouseup}
                                        name="context"
                                        rows="16"
                                        className="block w-full shadow-sm bg-[#F4F7F9] rounded-lg py-3 px-4 outline-none focus:border focus:border-blue-600 border"
                                        placeholder="context"
                                        value={context}
                                        onChange={handleContextArea}
                                        required
                                    ></textarea>
                                </div>
                                <div className=''>
                                    <input type="checkbox" id="add" checked={agree} onChange={checkboxHandler} className='mr-1'/>
                                    <label htmlFor="add"><b className='cursor-pointer text-green-400 ' >Add</b></label>
                                </div>
                                <div className=''>
                                    <input type="checkbox" id="discard" checked={!agree} onChange={checkboxHandler} className='mr-1'/>
                                    <label htmlFor="discard"><b className='cursor-pointer text-red-300 ' >Discard</b></label>
                                </div>
                                <div className='w-full'>
                                    <ButtonPrimary className='mx-auto md:ml-0' text="Submit" onClick={handleSubmit} />
                                </div>
                                <div className="flex flex-row gap-x-1">
                                <GeneralButton
                                    // eslint-disable-next-line quotes
                                    className={'h-8 rounded-md w-auto text-black text-xl flex justify-center items-center bg-gray-200 cursor-pointer'}
                                    content={'privious'}
                                    onClick={handleQueDecrement}
                                    disabled={false}
                                />
                                <input type="number" onChange={handleChangeNoQue} value={noOfQue.toString()} min={1} max={1000000} className='w-auto h-8 text-center rounded-lg' />
                                <GeneralButton
                                    // eslint-disable-next-line quotes
                                    className={'h-8 rounded-md w-auto text-black text-xl flex justify-center items-center bg-gray-200 cursor-pointer'}
                                    content={'next'}
                                    onClick={handleQueIncrement}
                                    disabled={false}
                                />
                            </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
