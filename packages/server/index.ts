import { serve, env, file, type Server } from 'bun'
import { join } from 'path'

type RequestArray = Array<{
    pathname: string
    f: (this: Server, req: Request) => Promise<Response>
}>

const handlersGET: RequestArray = [
    {
        pathname: '/schema.yml',
        async f() {
            return new Response(file(join(process.cwd(), 'schema.yml')))
        }
    }
]

const handlersPOST: RequestArray = []

const handlersPUT: RequestArray = []

const handlersDELETE: RequestArray = []

export function registerHandler(
    method: 'get' | 'post' | 'put' | 'delete',
    pathname: string,
    f: (this: Server, req: Request) => Promise<Response>
) {
    switch (method) {
        case 'get':
            handlersGET.push({ pathname, f })
            break
        case 'post':
            handlersPOST.push({ pathname, f })
            break
        case 'put':
            handlersPUT.push({ pathname, f })
            break
        case 'delete':
            handlersDELETE.push({ pathname, f })
            break
    }
}

export function startServer() {
    const server = serve({
        port: env.PORT || 8080,
        hostname: env.HOSTNAME || '0.0.0.0',
        development: env.NODE_ENV === 'development',
        async fetch(req) {
            const url = new URL(req.url)

            let res = null

            if (req.method === 'GET') {
                res = handlersGET
                    .find(handler => handler.pathname === url.pathname)
                    ?.f.call(this, req)
            }

            if (req.method === 'POST') {
                res = handlersPOST
                    .find(handler => handler.pathname === url.pathname)
                    ?.f.call(this, req)
            }

            if (req.method === 'PUT') {
                res = handlersPUT
                    .find(handler => handler.pathname === url.pathname)
                    ?.f.call(this, req)
            }

            if (req.method === 'DELETE') {
                res = handlersDELETE
                    .find(handler => handler.pathname === url.pathname)
                    ?.f.call(this, req)
            }

            return (
                res ||
                new Response('Not Found', {
                    status: 404
                })
            )
        }
    })

    console.log(
        `${env.NODE_ENV === 'development' ? '[development] ' : ''}Server running at ${server.url}`
    )

    return server
}
