import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export function useDocker() {
    return docker
}

export async function useGetDockerImage(image: string) {
    const images = await docker.listImages({
        all: true
    })

    return images.find(i =>
        i.RepoTags?.find(tag => new RegExp(image, 'ig').test(tag))
    )
}
