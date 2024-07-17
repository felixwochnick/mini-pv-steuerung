export default defineEventHandler(async event => {
    const body = await readBody<{
        containerId?: string
        image?: string
        name?: string
        config?: { [key: string]: string }
    }>(event)

    if (!body.image) return setResponseStatus(event, 400, 'Missing image')
    if (!body.containerId)
        return setResponseStatus(event, 400, 'Missing containerId')
    if (!body.config) return setResponseStatus(event, 400, 'Missing config')

    const docker = useDocker()

    const container = docker.getContainer(body.containerId)

    await container.stop()
    await container.remove()

    const runtimeConfig = useRuntimeConfig(event)

    const containerNew = await docker.createContainer({
        Image: body.image,
        name: body.name,
        NetworkingConfig: {
            EndpointsConfig: {
                [runtimeConfig.dockerInternalNetwork]: {}
            }
        },
        HostConfig: {
            RestartPolicy: {
                Name: 'unless-stopped'
            }
        },
        Env: Object.entries(body.config).map(
            ([key, value]) => `${key}=${value}`
        )
    })

    await containerNew.start()
})
