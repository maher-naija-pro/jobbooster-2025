'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugAvatarPage() {
    const [logs, setLogs] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`])
    }

    const testSupabaseConnection = async () => {
        setIsLoading(true)
        addLog('Testing Supabase connection...')

        try {
            const supabase = createClient()

            // Test auth
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            if (authError) {
                addLog(`Auth error: ${authError.message}`)
                return
            }
            addLog(`User authenticated: ${user?.email}`)

            // Test storage buckets
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
            if (bucketsError) {
                addLog(`Buckets error: ${bucketsError.message}`)
            } else {
                addLog(`Available buckets: ${buckets?.map(b => b.name).join(', ')}`)
                const avatarsBucket = buckets?.find(b => b.name === 'avatars')
                if (avatarsBucket) {
                    addLog(`Avatars bucket found: ${JSON.stringify(avatarsBucket)}`)
                } else {
                    addLog('Avatars bucket NOT found!')
                }
            }

            // Test file upload with a small test file
            if (user) {
                addLog('Testing file upload...')
                const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(`test-${Date.now()}.txt`, testFile)

                if (uploadError) {
                    addLog(`Upload error: ${uploadError.message}`)
                    addLog(`Upload error details: ${JSON.stringify(uploadError)}`)
                } else {
                    addLog(`Upload successful: ${JSON.stringify(uploadData)}`)
                }
            }

        } catch (error) {
            addLog(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Avatar Upload Debug</h1>

            <button
                onClick={testSupabaseConnection}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {isLoading ? 'Testing...' : 'Test Supabase Connection'}
            </button>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Debug Logs:</h2>
                <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                        <p className="text-gray-500">No logs yet. Click the test button above.</p>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="text-sm font-mono mb-1">
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
