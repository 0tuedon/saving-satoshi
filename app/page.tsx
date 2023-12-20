import Topbar from 'components/Topbar'
import Hero from 'components/Hero'
import Footer from 'components/Footer'
import defaultMetadata from 'config/metadata'
import Script from 'next/script'
import Umami from 'components/Util/Tracking'
import FossBanner from 'components/FossBanner'

export const metadata = {
  ...defaultMetadata,
}

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <Umami />{' '}
      <div className="bg-gradient-to-b from-[#00000060] via-[#00000020] to-transparent pb-28">
        <Topbar />
      </div>
      <FossBanner />
      <Hero />
      <Footer className="bg-back" />
    </div>
  )
}
