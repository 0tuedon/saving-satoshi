'use client'

import { useTranslations } from 'hooks'
import { ChapterIntro } from 'ui'
import { Button } from 'shared'
import { useSaveAndReturn } from 'hooks'

export const metadata = {
  title: 'chapter_ten.outro_six.title',
  navigation_title: 'chapter_ten.outro_six.nav_title',
  key: 'CH10OUT6',
}

export default function Outro6({ lang }) {
  const saveAndReturn = useSaveAndReturn()
  const t = useTranslations(lang)

  return (
    <ChapterIntro
      className="my-8"
      heading={t('chapter_nine.opcodes_one.heading')}
    >
      <p className="mt-2 text-lg md:text-xl">
        {t('chapter_nine.opcodes_one.paragraph_one')}
      </p>

      <p className="mt-8 text-lg md:text-xl">
        {t('chapter_nine.opcodes_one.paragraph_two')}
      </p>

      <p className="mt-8 text-lg md:text-xl">
        {t('chapter_nine.opcodes_one.paragraph_three')}
      </p>
      <Button onClick={saveAndReturn} classes="mt-10 max-md:w-full">
        {t('shared.end')}
      </Button>
    </ChapterIntro>
  )
}
