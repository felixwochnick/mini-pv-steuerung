export default defineEventHandler(async event => {
    const body = await readBody<{ image?: string; name?: string }>(event)

    if (!body.image) return setResponseStatus(event, 400, 'Missing image')

    const docker = useDocker()

    try {
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
                    : `${name}-${containers.length + 1}`
        })

        await container.start()

        return {
            id: container.id
        }
    } catch (error) {
        return setResponseStatus(event, 500, 'Docker error')
    }
})
