// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-07-09',
    devtools: { enabled: true },
    modules: ['@nuxt/ui', 'dayjs-nuxt'],
    extends: ['@nuxt/ui-pro'],
    dayjs: {
        locales: ['en', 'de'],
        plugins: ['relativeTime', 'utc', 'timezone'],
        defaultLocale: [
            'de',
            {
                relativeTime: {
                    future: 'in %s',
                    past: 'vor %s',
                    s: 'ein paar Sekunden',
                    m: 'einer Minute',
                    mm: '%d Minuten',
                    h: 'einer Stunde',
                    hh: '%d Stunden',
                    d: 'einem Tag',
                    dd: '%d Tagen',
                    M: 'einem Monat',
                    MM: '%d Monaten',
                    y: 'einem Jahr',
                    yy: '%d Jahren'
                }
            }
        ],
        defaultTimezone: 'Europe/Berlin'
    },
    ui: {
        icons: ['heroicons', 'ph']
    }
})
