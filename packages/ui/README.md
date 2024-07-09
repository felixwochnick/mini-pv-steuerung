# Ui starter with `Nuxt UI Pro`

```terminal
bunx nuxi init --template layer ui

cd ui

bunx nuxi@latest module add ui

bun add @nuxt/ui-pro

bun add dayjs-nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
    //...
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
    }
})
```
