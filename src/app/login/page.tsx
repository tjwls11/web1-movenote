'use client'

import SigninButton from '@/components/SigninButton'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    console.log('로그인 시도:', { email })

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('로그인 결과:', result)

      if (result?.error) {
        if (result.error === 'Configuration') {
          setError('비밀번호가 ��바르지 않습니다.')
        } else {
          setError(result.error)
        }
      } else if (result?.ok) {
        router.push('/')
      }
    } catch (error: unknown) {
      console.error('로그인 에러:', error)
      setError('로그인 중 오류가 발생했습니다.')
    }
  }
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <div className="w-full max-w-sm shadow-2xl drop-shadow-2xl rounded-lg p-8 border-t border-gray-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          로그인
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="이메일"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} // 비밀번호 가시성 토글
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)} // 버튼 클릭 시 가시성 토글
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#2d5a27aa] text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            로그인
          </button>
        </form>
        <div className="text-right pt-1">
          <Link href="/signup" className="text-sm font-medium text-gray-700">
            회원가입
          </Link>
        </div>

        <div className="relative w-full my-4">
          <hr className="border-gray-300" />

          <hr className="border-gray-300" />
        </div>

        <div className="justify-center items-center pt-4 mr-4">
          <SigninButton />
        </div>
      </div>
    </div>
  )
}
