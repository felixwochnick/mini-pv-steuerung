export default defineEventHandler(async event => {
    const { repository: repositoriesOrRepository } = getQuery<{
        repository: string | string[]
    }>(event)

    const repositories = Array.isArray(repositoriesOrRepository)
        ? repositoriesOrRepository
        : [repositoriesOrRepository]

    const result = await Promise.all(
        repositories.map(repository =>
            fetch(`https://hub.docker.com/v2/repositories/${repository}`)
                .then(data => data.json())
                .then(data => data.results)
        )
    )

    return result.flat(1).map(({ name, namespace }) => `${namespace}/${name}`)
})