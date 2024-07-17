<template>
    <div class="space-y-4">
        <UButton
            block
            label="Aktualisieren"
            icon="i-ph-arrow-clockwise"
            :loading="loading"
            @click="execute"
        />
        <UTable
            :rows="rows"
            :columns="[
                {
                    key: 'source',
                    label: 'Quelle'
                },
                {
                    key: 'value',
                    label: 'Wert'
                },
                {
                    key: 'unit',
                    label: 'Einheit'
                }
            ]"
        />
    </div>
</template>

<script setup lang="ts">
const _data = inject<Ref<{ [key: string]: any }>>('data', () => ref({}), true)
const onTriggerNextStep = inject<Ref<() => any>>(
    'onTriggerNextStep',
    () => ref(() => {}),
    true
)

onTriggerNextStep.value = function () {}

const emit = defineEmits(['nextStep'])

const { data, status, execute, clear, error } = useAsyncData(
    'get-data-from-container',
    () =>
        $fetch('/api/docker/get-data-from-container', {
            method: 'GET',
            query: {
                name: _data.value.adapter.name
            }
        }),
    {
        immediate: false,
        lazy: true
    }
)

const loading = computed(() => status.value === 'pending')

const rows = computed(() => {
    return _data.value.container.schema.endpoints.map(
        (endpoint: {
            path: string
            method: string
            name: string
            unit?: string
        }) => {
            return {
                source: endpoint.name,
                value:
                    endpoint.method === 'POST' || endpoint.method === 'PUT'
                        ? 'setzbar'
                        : endpoint.path.split('/').reduce((acc, key) => {
                              console.log(endpoint.path, 'acc', acc, 'key', key)
                              if (!acc) return null
                              if (key == '' && !acc[key]) return acc

                              return acc[key]
                          }, data.value) ?? 'n/a',
                unit: endpoint.unit
            }
        }
    )
})

onMounted(() => {
    execute()
})

onUnmounted(() => {
    clear()
})
</script>
