import { Metadata } from 'next'
import { PrivacySettingsPage } from './PrivacySettingsPage'
import { Site_name } from '@/texts-and-menues/site-name'

export const metadata: Metadata = {
    title: `${Site_name.siteName} | Privacy Settings`,
    description: 'Manage your privacy preferences, data processing consent, and GDPR rights',
    keywords: 'privacy settings, GDPR, data protection, consent management',
}

export default function PrivacySettings() {
    return <PrivacySettingsPage />
}
