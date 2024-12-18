import { connectToDatabase } from '@/libs/mongodb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: '이메일이 필요합니다.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const recentMovies = await db
      .collection('recent_movies')
      .find({ userEmail: email })
      .sort({ viewedAt: -1 })
      .limit(10)
      .toArray()

    return NextResponse.json({ movies: recentMovies })
  } catch (error) {
    console.error('최근 본 영화 조회 실패:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
