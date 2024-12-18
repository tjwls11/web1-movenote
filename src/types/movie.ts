interface RecentMovie {
  userEmail: string
  movieId: string
  title: string
  posterPath: string
  viewedAt: Date
}

interface FavoriteMovie {
  userEmail: string
  movieId: string
  title: string
  posterPath: string
  addedAt: Date
}
