'use client'

import { useEffect, useState } from 'react'
import EditMemoForm from '@/components/EditMemoForm'

interface Memo {
  title: string
  description: string
}

export default function EditMemoPage({ params }: { params: { id: string } }) {
  const [memo, setMemo] = useState<Memo | null>(null)
  const { id } = params

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const response = await fetch(`/api/memos/${id}`)
        if (!response.ok) {
          throw new Error('메모를 불러오는 데 실패했습니다')
        }
        const data = await response.json()
        console.log('API Response:', data)
        setMemo({
          title: data.memo.title,
          description: data.memo.content,
        })
      } catch (error) {
        console.error('메모 불러오기 오류:', error)
      }
    }

    fetchMemo()
  }, [id])

  if (!memo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <EditMemoForm
          id={id}
          title={memo.title}
          description={memo.description}
        />
      </div>
    </div>
  )
}
