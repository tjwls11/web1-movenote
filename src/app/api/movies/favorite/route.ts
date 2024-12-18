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
    const favoriteMovies = await db
      .collection('favorite_movies')
      .find({ userEmail: email })
      .toArray()

    return NextResponse.json({ movies: favoriteMovies })
  } catch (error) {
    console.error('찜한 영화 조회 실패:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
