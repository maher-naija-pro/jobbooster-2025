"use client"

import React, { useState } from "react"
import { MetaButton } from "@/components/ui/meta-button"
import { Icons } from "@/components/icons"

// Mock icons for demonstration
const SaveIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
)

const DownloadIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
)

const DeleteIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)

const SettingsIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const AlertTriangleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
)

export default function ButtonDemoPage() {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
    const [clickedButtons, setClickedButtons] = useState<Record<string, boolean>>({})
    const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto")
    const [animationsEnabled, setAnimationsEnabled] = useState(true)

    const handleLoadingToggle = (buttonId: string) => {
        setLoadingStates(prev => ({
            ...prev,
            [buttonId]: !prev[buttonId]
        }))
    }

    const handleButtonClick = (buttonId: string) => {
        setClickedButtons(prev => ({
            ...prev,
            [buttonId]: true
        }))
        // Reset after 2 seconds
        setTimeout(() => {
            setClickedButtons(prev => ({
                ...prev,
                [buttonId]: false
            }))
        }, 2000)
    }

    const DemoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    )

    const ButtonCard = ({
        title,
        description,
        children
    }: {
        title: string;
        description: string;
        children: React.ReactNode
    }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <div className="flex flex-wrap gap-2">
                {children}
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        MetaButton Demo
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Explore all the variants, sizes, and interactive features of the MetaButton component
                    </p>

                    {/* Controls */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Theme:</label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "auto")}
                                className="px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                                <option value="auto">Auto</option>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Animations:</label>
                            <button
                                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                                className={`px-3 py-1 rounded text-sm ${animationsEnabled
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : 'bg-red-100 text-red-800 border border-red-300'
                                    }`}
                            >
                                {animationsEnabled ? 'Enabled' : 'Disabled'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Solid Variants Section */}
                <DemoSection title="Solid Button Variants">
                    <ButtonCard
                        title="Primary"
                        description="Default primary action button with blue gradient"
                    >
                        <MetaButton variant="primary" text="Primary Action" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="primary" text="With Icon" icon={Icons.arrowRight} theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Secondary"
                        description="Secondary action with gray gradient"
                    >
                        <MetaButton variant="secondary" text="Secondary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="secondary" text="Cancel" icon={XIcon} theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Success"
                        description="Success actions with green gradient"
                    >
                        <MetaButton variant="success" text="Save Changes" icon={SaveIcon} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="success" text="Complete" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Warning"
                        description="Warning actions with orange gradient"
                    >
                        <MetaButton variant="warning" text="Warning" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="warning" text="Proceed" icon={AlertTriangleIcon} theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Danger"
                        description="Dangerous actions with red gradient"
                    >
                        <MetaButton variant="danger" text="Delete" icon={DeleteIcon} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="danger" text="Remove" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Default"
                        description="Default styling with gray gradient"
                    >
                        <MetaButton variant="default" text="Default" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="No Variant" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>
                </DemoSection>

                {/* Outline Variants Section */}
                <DemoSection title="Outline Button Variants">
                    <ButtonCard
                        title="Primary Outline"
                        description="Primary action with border-only styling"
                    >
                        <MetaButton variant="primary-outline" text="Primary Outline" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="primary-outline" text="With Icon" icon={Icons.arrowRight} theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Success Outline"
                        description="Success action with border-only styling"
                    >
                        <MetaButton variant="success-outline" text="Save" icon={SaveIcon} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="success-outline" text="Complete" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Danger Outline"
                        description="Danger action with border-only styling"
                    >
                        <MetaButton variant="danger-outline" text="Delete" icon={DeleteIcon} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="danger-outline" text="Remove" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>
                </DemoSection>

                {/* Ghost Variants Section */}
                <DemoSection title="Ghost Button Variants">
                    <ButtonCard
                        title="Primary Ghost"
                        description="Transparent primary action with subtle hover"
                    >
                        <MetaButton variant="primary-ghost" text="Primary Ghost" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="primary-ghost" text="With Icon" icon={Icons.arrowRight} theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Success Ghost"
                        description="Transparent success action"
                    >
                        <MetaButton variant="success-ghost" text="Save" icon={SaveIcon} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="success-ghost" text="Complete" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Danger Ghost"
                        description="Transparent danger action"
                    >
                        <MetaButton variant="danger-ghost" text="Delete" icon={DeleteIcon} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton variant="danger-ghost" text="Remove" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>
                </DemoSection>

                {/* Sizes Section */}
                <DemoSection title="Button Sizes">
                    <ButtonCard
                        title="Small"
                        description="Compact size for tight spaces"
                    >
                        <MetaButton size="sm" text="Small" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton size="sm" text="Save" icon={SaveIcon} variant="success" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Medium"
                        description="Default size for most use cases"
                    >
                        <MetaButton size="md" text="Medium" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton size="md" text="Download" icon={DownloadIcon} variant="secondary" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Large"
                        description="Prominent size for important actions"
                    >
                        <MetaButton size="lg" text="Large" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton size="lg" text="Get Started" icon={Icons.arrowRight} variant="success" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>
                </DemoSection>

                {/* Width Options Section */}
                <DemoSection title="Width Options">
                    <ButtonCard
                        title="Fixed Widths"
                        description="Different fixed width options"
                    >
                        <MetaButton width="sm" text="Small" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton width="md" text="Medium" variant="success" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton width="lg" text="Large Width" variant="warning" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Full Width"
                        description="Buttons that span the full width of their container"
                    >
                        <MetaButton fullWidth text="Full Width Button" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton fullWidth text="Another Full Width" variant="success" icon={SaveIcon} theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>
                </DemoSection>

                {/* Tooltips Section */}
                <DemoSection title="Tooltips">
                    <ButtonCard
                        title="Tooltip Positions"
                        description="Tooltips with different positioning options"
                    >
                        <MetaButton text="Top Tooltip" tooltip="This is a top tooltip" tooltipPosition="top" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Bottom Tooltip" tooltip="This is a bottom tooltip" tooltipPosition="bottom" variant="success" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Left Tooltip" tooltip="This is a left tooltip" tooltipPosition="left" variant="warning" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Right Tooltip" tooltip="This is a right tooltip" tooltipPosition="right" variant="danger" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Long Tooltips"
                        description="Tooltips with longer content"
                    >
                        <MetaButton
                            text="Long Tooltip"
                            tooltip="This is a very long tooltip that demonstrates how the component handles longer text content and wraps appropriately."
                            variant="primary"
                            theme={theme}
                            disableAnimations={!animationsEnabled}
                        />
                    </ButtonCard>
                </DemoSection>

                {/* Keyboard Shortcuts Section */}
                <DemoSection title="Keyboard Shortcuts">
                    <ButtonCard
                        title="Common Shortcuts"
                        description="Buttons with common keyboard shortcuts"
                    >
                        <MetaButton text="Save" shortcut="Ctrl+S" variant="success" icon={SaveIcon} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="New" shortcut="Ctrl+N" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Open" shortcut="Ctrl+O" variant="secondary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Close" shortcut="Esc" variant="warning" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Custom Shortcuts"
                        description="Buttons with custom keyboard shortcuts"
                    >
                        <MetaButton text="Custom Action" shortcut="Alt+Shift+C" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Another Action" shortcut="F5" variant="success" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="No Shortcut Display"
                        description="Buttons with shortcuts but display disabled"
                    >
                        <MetaButton text="Hidden Shortcut" shortcut="Ctrl+H" showShortcut={false} variant="secondary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Another Hidden" shortcut="Ctrl+Alt+H" showShortcut={false} variant="warning" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>
                </DemoSection>

                {/* Analytics Section */}
                <DemoSection title="Analytics & Tracking">
                    <ButtonCard
                        title="Analytics Events"
                        description="Buttons with built-in analytics tracking"
                    >
                        <MetaButton
                            text="Track Click"
                            analyticsEvent="button_clicked"
                            analyticsData={{ button_type: "primary", page: "demo" }}
                            variant="primary"
                            theme={theme}
                            disableAnimations={!animationsEnabled}
                        />
                        <MetaButton
                            text="Track Save"
                            analyticsEvent="save_action"
                            analyticsData={{ action: "save", item: "document" }}
                            variant="success"
                            icon={SaveIcon}
                            theme={theme}
                            disableAnimations={!animationsEnabled}
                        />
                    </ButtonCard>

                    <ButtonCard
                        title="Complex Analytics"
                        description="Buttons with detailed analytics data"
                    >
                        <MetaButton
                            text="User Action"
                            analyticsEvent="user_interaction"
                            analyticsData={{
                                user_id: "12345",
                                action: "button_click",
                                timestamp: new Date().toISOString(),
                                metadata: { source: "demo_page" }
                            }}
                            variant="primary"
                            theme={theme}
                            disableAnimations={!animationsEnabled}
                        />
                    </ButtonCard>
                </DemoSection>

                {/* Interactive States */}
                <DemoSection title="Interactive States">
                    <ButtonCard
                        title="Loading States"
                        description="Buttons with loading spinners and custom loading text"
                    >
                        <MetaButton
                            text="Loading..."
                            isLoading={loadingStates.loading1}
                            onClick={() => handleLoadingToggle('loading1')}
                            variant="primary"
                            theme={theme}
                            disableAnimations={!animationsEnabled}
                        />
                        <MetaButton
                            text="Processing"
                            isLoading={loadingStates.loading2}
                            loadingText="Please wait..."
                            onClick={() => handleLoadingToggle('loading2')}
                            variant="success"
                            theme={theme}
                            disableAnimations={!animationsEnabled}
                        />
                    </ButtonCard>

                    <ButtonCard
                        title="Disabled States"
                        description="Buttons that are disabled and show visual feedback"
                    >
                        <MetaButton text="Disabled" disabled variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Disabled with Icon" disabled icon={Icons.settings} variant="secondary" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Click Animations"
                        description="Buttons with click state management and animations"
                    >
                        <MetaButton
                            text="Click Me"
                            onClick={() => handleButtonClick('click1')}
                            variant="primary"
                            theme={theme}
                            disableAnimations={!animationsEnabled}
                        />
                        <MetaButton
                            text="Animated"
                            onClick={() => handleButtonClick('click2')}
                            icon={Icons.arrowRight}
                            variant="success"
                            theme={theme}
                            disableAnimations={!animationsEnabled}
                        />
                    </ButtonCard>
                </DemoSection>

                {/* Custom Content */}
                <DemoSection title="Custom Content">
                    <ButtonCard
                        title="Custom Icons"
                        description="Using custom icon components"
                    >
                        <MetaButton text="Settings" icon={SettingsIcon} variant="secondary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Download" icon={DownloadIcon} variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Delete Item" icon={DeleteIcon} variant="danger" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Custom Text"
                        description="Using text prop instead of children"
                    >
                        <MetaButton text="Custom Text" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Another Button" variant="success" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Children Content"
                        description="Using children for complex content"
                    >
                        <MetaButton variant="primary" theme={theme} disableAnimations={!animationsEnabled}>
                            <span className="flex items-center gap-2">
                                <Icons.arrowRight className="h-4 w-4" />
                                Complex Content
                            </span>
                        </MetaButton>
                        <MetaButton variant="success" theme={theme} disableAnimations={!animationsEnabled}>
                            <span className="font-bold">Bold Text</span>
                        </MetaButton>
                    </ButtonCard>
                </DemoSection>

                {/* Button Types */}
                <DemoSection title="Button Types">
                    <ButtonCard
                        title="Form Buttons"
                        description="Different button types for forms"
                    >
                        <MetaButton type="submit" text="Submit Form" variant="primary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton type="button" text="Regular Button" variant="secondary" theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton type="reset" text="Reset Form" variant="warning" theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="Icon Only"
                        description="Buttons with icons but no text"
                    >
                        <MetaButton icon={Icons.settings} variant="secondary" showIcon={true} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton icon={SaveIcon} variant="success" showIcon={true} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton icon={DeleteIcon} variant="danger" showIcon={true} theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>

                    <ButtonCard
                        title="No Icons"
                        description="Buttons without icons"
                    >
                        <MetaButton text="No Icon" variant="primary" showIcon={false} theme={theme} disableAnimations={!animationsEnabled} />
                        <MetaButton text="Text Only" variant="success" showIcon={false} theme={theme} disableAnimations={!animationsEnabled} />
                    </ButtonCard>
                </DemoSection>

                {/* Usage Examples */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Usage Examples</h2>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-4">Code Examples</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Basic Usage:</h4>
                                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                    {`<MetaButton text="Click me" variant="primary" />`}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">With Tooltip and Shortcut:</h4>
                                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                    {`<MetaButton 
  text="Save" 
  tooltip="Save your changes"
  shortcut="Ctrl+S"
  variant="success" 
  icon={SaveIcon}
/>`}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Outline Variant:</h4>
                                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                    {`<MetaButton 
  text="Cancel" 
  variant="primary-outline"
  theme="dark"
  fullWidth
/>`}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Ghost Variant with Analytics:</h4>
                                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                    {`<MetaButton 
  text="Delete" 
  variant="danger-ghost"
  analyticsEvent="item_deleted"
  analyticsData={{ item_id: "123" }}
  icon={DeleteIcon}
/>`}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Disabled Animations:</h4>
                                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                    {`<MetaButton 
  text="No Animation" 
  variant="primary"
  disableAnimations={true}
  width="lg"
/>`}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Full Width with Loading:</h4>
                                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                                    {`<MetaButton 
  text="Submit" 
  variant="primary"
  fullWidth
  isLoading={isSubmitting}
  loadingText="Processing..."
/>`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
