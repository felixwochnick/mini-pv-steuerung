export default defineEventHandler(async event => {
    const body = await readBody<{ image?: string; name?: string }>(event)

    if (!body.image) return setResponseStatus(event, 400, 'Missing image')

    const docker = useDocker()

    const runtimeConfig = useRuntimeConfig(event)

    try {
        if (!(await useGetDockerImage(body.image))) {
            await docker.pull(body.image)

            await new Promise(resolve => {
                const interval = setInterval(async () => {
                    if (await useGetDockerImage(body.image!)) {
                        clearInterval(interval)
                        setTimeout(() => resolve(null), 500)
                    }
                }, 500)
            })
        }

        const name = body.name || 'mini-pv-steuerung-adapter'

        const containers = await docker
            .listContainers({
                all: true
            })
            .then(containers =>
                containers.filter(container =>
                    container.Names.find(n => new RegExp(name, 'ig').test(n))
                )
            )

        const container = await docker.createContainer({
            Image: body.image,
            name:
                containers.length == 0
                    ? name
                    : `${name}-${containers.length + 1}`,
            NetworkingConfig: {
                EndpointsConfig: {
                    [runtimeConfig.dockerInternalNetwork]: {}
                }
            }
        })

        await container.start()

        // const data = await $fetch()

        return {
            name: (await container.inspect()).Name,
            id: container.id
        }
    } catch (error) {
        console.error(error)

        return setResponseStatus(event, 500, 'Docker error')
    }
})
