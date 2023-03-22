import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { FiGithub, FiLinkedin, FiMail, FiHeadphones  } from 'react-icons/fi'
import Link from 'next/link'
import LBLink from './components/LBLink'

export default function HomePage() {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-4'>
      <h1 className="text-4xl md:text-6xl font-bold">
        Lucas Blotta
      </h1>
      <p className='text-xl md:text-2xl'>Developer | Musician</p>
      <div className='text-2xl md:text-xl flex flex-row justify-center gap-3'>
        <LBLink target="_blank" href="https://github.com/blotta">
          <FiGithub />
        </LBLink>
        <LBLink target="_blank" href="https://github.com/blotta">
          <FiLinkedin />
        </LBLink>
        <LBLink target="_blank" href="mailto://lucas@blotta.info">
          <FiMail />
        </LBLink>
        <LBLink target="_blank" href="https://soundcloud.com/blotta-the-sample-man" className='hover:text-green-400 hover:scale-110'>
          <FiHeadphones />
        </LBLink>
      </div>
    </div>
  )
}
