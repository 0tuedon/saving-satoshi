import React, { useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import LanguageExecutor from './LanguageExecutor'
import { OpCodeTypes } from './OPFunctions'
import { StatusBar } from 'ui/common'
import { MainState, OpRunnerTypes, StackType, T } from './runnerTypes'

const OpRunner = ({
  success,
  setSuccess,
  answerScript,
  readOnly,
  prePopulate,
}: Omit<OpRunnerTypes, 'children'>) => {
  const scrollRef = useRef(null)

  const [script, setScript] = useState(
    prePopulate ? answerScript.join(' ') : ''
  )
  const [initialStack, setInitialStack] = useState('')
  const [height, setHeight] = useState<number>(0)
  const [stackHistory, setStackHistory] = useState<MainState | []>([])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [stackHistory])

  const handleReset = () => {
    setStackHistory([])
    if (success !== true) {
      setSuccess(0)
    }
  }

  const handleScriptChange = (event) => {
    handleReset()
    setScript(event.target.value.toUpperCase())
  }

  const handleInitialStackChange = (event) => {
    handleReset()
    setInitialStack(event.target.value)
  }

  const handleHeightChange = (event) => {
    handleReset()
    setHeight(parseInt(event.target.value))
  }

  const checkSuccessState = (tokens: T, stack: StackType) => {
    const filterToStringArray = tokens.map((token) => token.value)
    const containsEveryScript = answerScript.every((token) =>
      filterToStringArray.includes(token)
    )

    const doesStackValidate = () => {
      if (stack?.length === 1 && (stack[0] === 1 || stack[0] === true)) {
        return true
      }
      return false
    }
    if (containsEveryScript && doesStackValidate()) {
      setSuccess(true)
    } else if (success !== true) {
      setSuccess(2)
    } else {
      setSuccess(success)
    }
  }
  const handleRun = () => {
    const initialStackArray = initialStack.split(',')
    const runnerState = LanguageExecutor.RunCode(
      script,
      initialStackArray,
      height
    )
    setStackHistory(runnerState?.state || [])
    checkSuccessState(runnerState?.tokens || [], runnerState?.stack ?? [])
  }

  const handleTryAgain = () => {
    setSuccess(0)
  }

  let error = null

  return (
    <div className="flex grow flex-col text-white md:w-[50vw]">
      <div className="flex flex-col gap-1 border-b border-b-white px-5 py-4">
        <p className="font-space-mono text-lg font-bold capitalize ">
          Your Script
        </p>
        <textarea
          className="overflow-wrap-normal w-full resize-none break-all border-none bg-transparent font-space-mono text-lg text-white focus:outline-none"
          onChange={handleScriptChange}
          autoComplete="off"
          value={script}
          readOnly={readOnly}
          placeholder="Enter your script here..."
          autoCapitalize="none"
          spellCheck="false"
          rows={5} // Increase rows based on text length
        />
      </div>

      <div className="flex flex-col flex-wrap border-b border-b-white">
        <div className="flex flex-col border-b border-b-white px-5 py-4">
          <p className="font-space-mono text-lg font-bold capitalize">
            Initial stack
          </p>
          <input
            onChange={handleInitialStackChange}
            className="flex-grow border-none bg-transparent font-space-mono text-lg focus:outline-none"
            type="text"
            placeholder="..."
          />
        </div>

        <div className="flex flex-col px-5 py-4">
          <p className="font-space-mono text-lg font-bold capitalize">
            Next Block Height
          </p>
          <input
            onChange={handleHeightChange}
            className="flex-grow border-none bg-transparent text-lg focus:outline-none"
            placeholder="630001"
            type="number"
            min="1"
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex w-full grow flex-row gap-2.5 overflow-scroll border-b border-b-white px-5 py-4"
      >
        {stackHistory.length === 0 && (
          <div className="flex flex-col">
            <div className="mx-auto my-[5px] w-[140px] rounded-[3px] border border-white bg-transparent px-3 py-1 font-space-mono text-white">
              OP_CODES
            </div>
            <hr className="my-2 -ml-2.5 border-dashed" />
            <div className="flex min-h-[204px] min-w-[164px] flex-col rounded-b-[10px] bg-black bg-opacity-20 p-2.5">
              <div
                className="my-auto resize-none break-all border-none bg-transparent font-space-mono text-white focus:outline-none"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                <div className="break-word text-center">
                  {'Your script \n code will be \n visualized \n here...'}
                </div>
              </div>
            </div>
          </div>
        )}

        {stackHistory.map((stack, index) => {
          if (error) {
            return null
          }
          if (stack?.error) {
            error = stack.error?.message
          }
          return (
            stack.negate === 0 && (
              <div key={`Overall-container${index}`} className="flex flex-col">
                <div
                  className={clsx(
                    'mx-auto my-[5px] w-[140px] rounded-[3px] border bg-transparent px-3 py-1 font-space-mono',
                    {
                      'border-[#EF960B] text-[#EF960B]':
                        stack.operation.tokenType === 'conditional',
                      'border-[#3DCFEF] text-[#3DCFEF]':
                        stack.operation.tokenType !== 'conditional',
                      'border-[#F3241D] text-[#F3241D]': stack?.error?.message,
                    }
                  )}
                >
                  {stack.operation.value}
                </div>
                <hr className="my-2 -ml-2.5 border-dashed" />
                {stack && (
                  <div
                    key={`Container${index}`}
                    className="flex h-[204px] min-w-[164px] flex-col overflow-y-auto rounded-b-[10px] bg-black bg-opacity-20 p-2.5"
                  >
                    <div
                      key={index}
                      className="mt-auto resize-none break-all border-none bg-transparent font-space-mono text-white focus:outline-none"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {stack?.stack
                        ?.slice()
                        .reverse()
                        .map((item, i) => (
                          <div
                            key={`item${i}`}
                            className="my-[5px] w-[140px] rounded-[3px] bg-white/15 px-3 py-1"
                          >
                            {JSON.stringify(
                              !isNaN(parseFloat(item)) && isFinite(item)
                                ? parseInt(item)
                                : item
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )
        })}
      </div>

      <div className="flex h-10  gap-3 pl-5">
        <button type="button" className="cursor-pointer" onClick={handleRun}>
          Run
        </button>
        <button onClick={handleReset}>Reset</button>
        <button>Step</button>
      </div>

      <StatusBar
        handleTryAgain={handleTryAgain}
        className="h-14 min-h-14 grow"
        errorMessage={error || ''}
        success={success}
      />
    </div>
  )
}

export default OpRunner
