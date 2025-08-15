'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function UnauthorizedPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="flex justify-center">
            <Image
              src="/logo.svg"
              alt="Palestinian Flag"
              width={64}
              height={40}
              className="border border-gray-300"
              priority
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Erişim Yetkisiz
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Yetkisiz Erişim
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Admin paneline erişebilmek için yönetici veya editör yetkisine sahip olmanız gerekmektedir.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignOut}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#CE1126] hover:bg-[#B00E20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CE1126]"
          >
            Çıkış Yap
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CE1126]"
          >
            Ana Sayfaya Dön
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Erişim yetkisi almak için sistem yöneticisi ile iletişime geçin.
          </p>
        </div>
      </div>
    </div>
  )
}