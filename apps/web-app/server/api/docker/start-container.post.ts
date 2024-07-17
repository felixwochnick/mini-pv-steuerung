import { parse } from 'yaml'

type TSchema = {
    container: {
        env: Array<{
            name: string
            description: string
        }>
    }
    endpoints: Array<{
        path: string
        method: string
        name: string
        unit?: string
    }>
}

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

        const _name = body.name || 'mini-pv-steuerung-adapter'

        const containers = await docker
            .listContainers({
                all: true
            })
            .then(containers =>
                containers.filter(container =>
                    container.Names.find(n => new RegExp(_name, 'ig').test(n))
                )
            )

        const name =
            containers.length == 0 ? _name : `${_name}-${containers.length + 1}`

        const container = await docker.createContainer({
            Image: body.image,
            name,
            NetworkingConfig: {
                EndpointsConfig: {
                    [runtimeConfig.dockerInternalNetwork]: {}
                }
            },
            HostConfig: {
                RestartPolicy: {
                    Name: 'unless-stopped'
                }
            }
        })

        await container.start()

        const data = await new Promise<string>(resolve => {
            const interval = setInterval(async () => {
                try {
                    const data = await $fetch<string>(
                        `http://${name}:8080/schema.yml`
                    )

                    clearInterval(interval)
                    resolve(data)
                } catch (error) {}
            }, 500)
        })

        const schema = parse(data) as TSchema

        return {
            name,
            id: container.id,
            schema
        }
    } catch (error) {
        console.error(error)

        return setResponseStatus(event, 500, 'Docker error')
    }
})
