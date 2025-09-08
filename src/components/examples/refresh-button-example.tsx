"use client"

import React, { useState } from "react"
import { RefreshButton } from "@/components/buttons/refresh-button"

export function RefreshButtonExample() {
    const [isLoading, setIsLoading] = useState(false)
    const [refreshCount, setRefreshCount] = useState(0)

    const handleRefresh = async () => {
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        setRefreshCount(prev => prev + 1)
        setIsLoading(false)
    }

    return (
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">Refresh Button Examples</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Basic Refresh Button</h3>
                    <RefreshButton
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                        text="Refresh Data"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Small Size with Custom Text</h3>
                    <RefreshButton
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                        text="Reload"
                        size="sm"
                        variant="secondary-outline"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Large Size with Tooltip</h3>
                    <RefreshButton
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                        text="Refresh All Data"
                        size="lg"
                        variant="primary"
                        tooltip="Click to refresh all data from server"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Ghost Variant</h3>
                    <RefreshButton
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                        text="Refresh"
                        variant="primary-ghost"
                        width="fit"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Without Icon</h3>
                    <RefreshButton
                        onRefresh={handleRefresh}
                        isLoading={isLoading}
                        text="Refresh"
                        showIcon={false}
                        variant="success-outline"
                    />
                </div>

                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Refresh count: <span className="font-semibold">{refreshCount}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
