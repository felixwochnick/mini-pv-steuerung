import Docker from 'dockerode'

const docker = new Docker({ socketPath: '/var/run/docker.sock' })

export function useDocker() {
    return docker
}
