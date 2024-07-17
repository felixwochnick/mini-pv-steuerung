export default defineEventHandler(async event => {
    const { name: namesOrName } = getQuery<{
        name: string | string[]
    }>(event)

    const name = Array.isArray(namesOrName) ? namesOrName[0] : namesOrName

    try {
        const data = await $fetch<string>(`http://${name}:8080/`)

        return data
    } catch (error) {
        console.error(error)
        return null
    }
})
