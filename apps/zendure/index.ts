import { registerHandler, startServer } from '@mini-pv-steuerung/server'
import { connect, env } from 'bun'
import mqtt from 'mqtt'
import type { Device, Message } from './types'

const data = {
    connected: false,
    powerPv1: 0,
    powerPv2: 0,
    get powerPv() {
        return this.powerPv1 + this.powerPv2
    },
    powerOutput: 0,
    powerBatteryOut: 0,
    powerBatteryIn: 0,
    socBattery: 0,
    temperatureBattery: 0
}

registerHandler(
    'get',
    '/',
    async () =>
        new Response(
            JSON.stringify({
                status: {
                    connected: data.connected
                },
                power: {
                    '': data.powerPv,
                    '1': data.powerPv1,
                    '2': data.powerPv2,
                    out: data.powerOutput,
                    battery: {
                        out: data.powerBatteryOut,
                        in: data.powerBatteryIn
                    }
                },
                soc: {
                    battery: data.socBattery
                },
                temperature: {
                    battery: data.temperatureBattery
                }
            })
        )
)

registerHandler(
    'get',
    '/status/connected',
    async () => new Response(data.connected.toString())
)

registerHandler(
    'get',
    '/power/pv',
    async () => new Response(data.powerPv.toString())
)

registerHandler(
    'get',
    '/power/pv1',
    async () => new Response(data.powerPv1.toString())
)

registerHandler(
    'get',
    '/power/pv2',
    async () => new Response(data.powerPv2.toString())
)

registerHandler(
    'get',
    '/power/out',
    async () => new Response(data.powerOutput.toString())
)

registerHandler(
    'get',
    '/power/battery/out',
    async () => new Response(data.powerBatteryOut.toString())
)

registerHandler(
    'get',
    '/power/battery/in',
    async () => new Response(data.powerBatteryIn.toString())
)

registerHandler(
    'get',
    '/soc/battery',
    async () => new Response(data.socBattery.toString())
)

registerHandler(
    'get',
    '/temperature/battery',
    async () => new Response(data.temperatureBattery.toString())
)

startServer()

let stop = await init()

setInterval(
    async () => {
        stop?.()

        stop = await init()
    },
    1000 * 60 * 60 * 2
)

async function init() {
    if (!env.USERNAME || !env.PASSWORD) return

    const { accessToken, iotUrl, iotUserName } = await getAccessToken(
        env.USERNAME,
        env.PASSWORD
    )

    const devices = await getDeviceList(accessToken)

    const device = devices.find(device => device.snNumber === env.SERIAL_NUMBER)

    if (!device) return

    const mqttClient = mqtt.connect(`mqtt://${iotUrl}:1883`, {
        clientId: accessToken,
        username: iotUserName,
        password: 'H6s$j9CtNa0N'
    })

    mqttClient.on('connect', () => {
        data.connected = true
    })

    mqttClient.on('error', error => {
        if (!error) return
        console.error(error)
        data.connected = false
    })

    mqttClient.on('message', (topic, _message) => {
        const message = JSON.parse(_message.toString()) as Message

        if (message.properties.solarPower1)
            data.powerPv1 = message.properties.solarPower1
        if (message.properties.solarPower2)
            data.powerPv2 = message.properties.solarPower2
        if (message.properties.outputHomePower)
            data.powerOutput = message.properties.outputHomePower
        if (message.properties.packInputPower)
            data.powerBatteryOut = message.properties.packInputPower
        if (message.properties.outputPackPower)
            data.powerBatteryIn = message.properties.outputPackPower
        if (message.properties.electricLevel)
            data.socBattery = message.properties.electricLevel
        if (message.packData)
            data.temperatureBattery = Math.max(
                ...message.packData.map(pack => pack.maxTemp || 0)
            )
    })

    mqttClient.subscribe(
        `/${device.productKey}/${device.deviceKey}/properties/report`,
        error => {
            if (!error) return
            console.error(error)
        }
    )

    triggerFullUpdate(mqttClient, device)

    return function stop() {
        data.connected = false
        mqttClient.end()
    }
}

async function getAccessToken(username: string, password: string) {
    const res = await fetch('https://app.zendure.tech/eu/auth/app/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'de-DE',
            appVersion: '4.3.1',
            Accept: '*/*',
            Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
        },
        body: JSON.stringify({
            account: username,
            password: password
        })
    })

    const {
        data: { iotUrl, iotUserName, iotPassword, accessToken }
    } = (await res.json()) as any

    return { iotUrl, iotUserName, iotPassword, accessToken }
}

async function getDeviceList(accessToken: string) {
    const res = await fetch(
        'https://app.zendure.tech/eu/productModule/device/queryDeviceListByConsumerId',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'de-DE',
                appVersion: '4.3.1',
                Accept: '*/*',
                'Blade-Auth': `bearer ${accessToken}`
            },
            body: JSON.stringify({})
        }
    )

    const { data } = (await res.json()) as any

    return data as Device[]
}

async function triggerFullUpdate(mqttClient: mqtt.MqttClient, device: Device) {
    mqttClient.publish(
        `iot/${device.productKey}/${device.deviceKey}/properties/read`,
        JSON.stringify({
            properties: ['getAll']
        })
    )
}
