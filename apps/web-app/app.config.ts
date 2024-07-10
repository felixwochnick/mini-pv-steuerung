import { type HeaderLink } from '#ui-pro/types'

export default defineAppConfig({
    headerLinks: [
        { label: 'Startseite', to: '/', icon: 'i-ph-house-line-duotone' },
        { label: 'Übersicht', to: '/overview', icon: 'i-ph-git-diff-duotone' },
        { label: 'Diagramme', to: '/history', icon: 'i-ph-chart-line-up' },
        { label: 'Einstellungen', to: '/settings', icon: 'i-ph-gear-duotone' }
    ] as Array<HeaderLink & { icon?: string }>,
    ui: {
        primary: 'yellow'
    }
})
