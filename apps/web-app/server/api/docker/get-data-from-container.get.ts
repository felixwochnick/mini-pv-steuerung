export default defineEventHandler(async event => {
    const { name: namesOrName } = getQuery<{
        name: string | string[]
    }>(event)

    const name = Array.isArray(namesOrName) ? namesOrName[0] : namesOrName

    setResponseHeaders(event, {
        'content-type': 'application/json',
        'cache-control': 'no-cache'
    })

    try {
        const data = await $fetch<string>(`http://${name}:8080/`)

        return JSON.parse(data)
    } catch (error) {
        return {}
    }
})
