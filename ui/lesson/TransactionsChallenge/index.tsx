import Avatar from 'components/Avatar'
import { useMediaQuery } from 'hooks'
import { useAtom } from 'jotai'
import React, { FC, useState } from 'react'
import { Button } from 'shared'
import ArrowRightLarge from 'shared/icons/ArrowRightLarge'
import HyperLink from 'shared/icons/Hyperlink'
import SignatureButton from 'shared/SignatureButton'
import { accountAtom } from 'state/state'
import { LessonDirection } from 'types'
import { StatusBar, Text } from 'ui/common'
import { SuccessNumbers } from 'ui/common/StatusBar'
import { transactionTabs } from 'utils/data'
import Lesson from '../Lesson'
import LanguageExecutor from '../OpCodeChallenge/LanguageExecutor'
import OutputScript from './OutputScript'
import Tabs from './Tabs'

interface ITransactionProps {
  children: React.ReactNode
  currentTransactionTab: string
  progressKey: string
  prefilled?: boolean
  answerScript: Record<'output_0' | 'output_1', string[]>
}

const TransactionChallenge: FC<ITransactionProps> = ({
  children,
  currentTransactionTab,
  progressKey,
  prefilled,
  answerScript,
}) => {
  const isSmallScreen = useMediaQuery({ width: 767 })
  const [activeView, setActiveView] = useState(currentTransactionTab)
  const [account] = useAtom(accountAtom)
  const allTabs = Object.keys(transactionTabs)
  const allTabsData = Object.entries(transactionTabs)
  const [validating, setValidating] = useState<boolean>(false)
  const [validateScript1, setValidateScript1] = useState<SuccessNumbers>(0)
  const [validateScript2, setValidateScript2] = useState<SuccessNumbers>(0)
  const handleLazloSign = () => {
    setValidating(true)
  }

  const handleYouSign = () => {
    setValidating(true)
  }

  const allTabsFiltered = allTabs
    .filter((tab, i) => {
      if (tab === 'payment') {
        if (currentTransactionTab === 'payment') {
          return true
        } else {
          return false
        }
      }
      if (
        tab.includes('refund') &&
        allTabs.indexOf(currentTransactionTab) > 2
      ) {
        if (!currentTransactionTab.includes('refund')) {
          return tab === 'refund_2'
        } else {
          return tab === currentTransactionTab
        }
      }

      return i <= allTabs.indexOf(currentTransactionTab) ?? allTabs.length
    })
    .map((tab) => ({ id: tab, text: tab }))

  return (
    <Lesson
      direction={
        isSmallScreen ? LessonDirection.Vertical : LessonDirection.Horizontal
      }
    >
      {children}
      <div className="flex h-[calc(100vh-70px-48px)] w-full flex-shrink-0 flex-col justify-between border-white/25 md:h-[calc(100vh-70px)] md:max-w-[50vw] md:border-l">
        <div className="flex flex-col gap-4 ">
          <div className=" min-h-[65px] w-full border-b border-white/25 ">
            <Tabs
              items={allTabsFiltered}
              classes={'h-full max-w-[max-content] capitalize'}
              stretch
              setActiveView={setActiveView}
              activeView={activeView}
            />
          </div>
          {allTabsData.map(
            (tabData) =>
              tabData[0] === activeView && (
                <div
                  key={tabData[0]}
                  className="flex h-full max-h-[calc(100vh-207px)] flex-col gap-4 overflow-auto"
                >
                  <div className="flex  flex-col px-6 pt-6  font-space-mono ">
                    <Text className=" font-space-mono text-base leading-[22.22px] tracking-[2%]">
                      {tabData[1].description}
                    </Text>
                    <div className="flex items-start gap-[15px] py-4">
                      {tabData[1]?.input && (
                        <div className="flex flex-col gap-4 rounded-md bg-black/20 p-4 text-lg">
                          <div className="flex flex-col gap-1">
                            <Text className="text-nowrap ">
                              {tabData[0] === 'deposit' ||
                              tabData[0] === 'payment'
                                ? 'Deposit'
                                : 'Multi-sig'}
                            </Text>
                            <Text>Input 0</Text>
                          </div>
                          <div className="flex flex-col gap-1  ">
                            <Text>Sats</Text>
                            <Text>{tabData[1].input?.sats}</Text>
                          </div>
                        </div>
                      )}

                      {tabData[1]?.input && <ArrowRightLarge />}
                      <div className="flex w-full flex-col gap-4">
                        {tabData[1].output_0 && (
                          <OutputScript
                            key={'output_0'}
                            output="output 0"
                            tab={tabData[0]}
                            prefilled={prefilled}
                            currentTransactionTab={currentTransactionTab}
                            sats={tabData[1].output_0.sats || ''}
                            script={tabData[1].output_0.script || ''}
                            progressKey={progressKey}
                            answerScript={answerScript}
                            setValidateScript={setValidateScript1}
                            validating={validating}
                            setValidating={setValidating}
                          />
                        )}
                        {tabData[1].output_1 && (
                          <OutputScript
                            key={'output_1'}
                            output="output 1"
                            tab={tabData[0]}
                            setValidateScript={setValidateScript2}
                            prefilled={prefilled}
                            currentTransactionTab={currentTransactionTab}
                            sats={tabData[1].output_1.sats || ''}
                            script={tabData[1].output_1.script || ''}
                            progressKey={progressKey}
                            answerScript={answerScript}
                            validating={validating}
                            setValidating={setValidating}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {/*  */}

                  <div className="flex flex-col gap-4 px-[30px] pt-[30px] ">
                    <div className="flex flex-col">
                      <Text>Signatures</Text>
                      <div className="flex  gap-10">
                        <div className="flex items-center gap-2.5">
                          <Avatar avatar={account?.avatar} />
                          <Text> You</Text>
                          <SignatureButton
                            onClick={handleYouSign}
                            classes=" max-w-[max-content] rounded-[3px] px-2.5 text-base py-1"
                          >
                            Sign
                          </SignatureButton>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <Avatar avatar={account?.avatar} />
                          <Text>Laszlo</Text>
                          <SignatureButton
                            onClick={handleLazloSign}
                            signature={
                              tabData[1]
                                ? tabData[1]?.signatures?.laszlo
                                : 'not-signed'
                            }
                            classes=" max-w-[max-content] rounded-[3px] px-2.5 text-base py-1"
                          >
                            Sign
                          </SignatureButton>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <Text>Options</Text>
                      <Button classes=" max-w-[max-content] rounded-[3px] px-2.5 text-base py-1">
                        Send revocation_key
                      </Button>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
        <StatusBar success={validateScript2 || validateScript1} />
      </div>
    </Lesson>
  )
}

export default TransactionChallenge