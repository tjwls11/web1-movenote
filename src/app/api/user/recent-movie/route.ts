import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'

// GET 요청 처리
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const email = url.searchParams.get('email')

    // 사용자 이메일이 없으면 에러 처리
    if (!email) {
      return NextResponse.json(
        { error: '사용자 이메일이 필요합니다.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()

    // email을 기준으로 검색
    const userMovies = await db
      .collection('recentMovies')
      .findOne({ user: email })

    console.log('Found user movies for email:', email)
    console.log('User movies data:', userMovies)

    if (!userMovies) {
      console.log('No movies found for email:', email)
      return NextResponse.json({ movies: [] })
    }

    // 영화 상세 정보 가져오기
    const movieDetails = await Promise.all(
      userMovies.movies.map(async (movieId: string) => {
        const movieData = await db.collection('movies').findOne({ id: movieId })
        console.log('Movie data for ID:', movieId, movieData)
        return movieData || { id: movieId }
      })
    )

    return NextResponse.json({
      success: true,
      movies: movieDetails.filter((movie) => movie !== null),
    })
  } catch (error) {
    console.error('Error fetching recent movies:', error)
    return NextResponse.json(
      { error: '최근 본 영화를 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST 요청 처리
export async function POST(req: Request) {
  try {
    const { user, movieId } = await req.json()

    if (!user || !movieId) {
      return NextResponse.json(
        { error: '사용자와 영화 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()

    // 사용자 문서 찾기
    const userDoc = await db.collection('recentMovies').findOne({ user })

    if (userDoc) {
      // 중복 제거 후 최신 영화 추가
      const existingMovies = userDoc.movies || []
      const updatedMovies = [
        movieId,
        ...existingMovies.filter((id: string) => id !== movieId),
      ].slice(0, 5) // 최대 5개로 제한

      await db.collection('recentMovies').updateOne(
        { user },
        {
          $set: {
            movies: updatedMovies,
            updatedAt: new Date(),
          },
        }
      )
    } else {
      // 새로운 사용자 문서 생성
      await db.collection('recentMovies').insertOne({
        user,
        movies: [movieId],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving recent movie:', error)
    return NextResponse.json(
      { error: '최근 본 영화 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}
