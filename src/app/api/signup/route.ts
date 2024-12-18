import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log('회원가입 시도:', { email })

    // 필수 항목 검사
    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const usersCollection = db.collection('users')

    // 사용자 찾복 검사
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      )
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 정보 저장
    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    // 회원가입 성공
    return NextResponse.json({
      message: '회원가입 성공',
    })
  } catch (error) {
    console.error('회원가입 에러:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
