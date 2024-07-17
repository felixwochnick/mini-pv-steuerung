<template>
    <div>
        <pre>
            {{ dataFormatted }}
        </pre>
    </div>
</template>

<script setup lang="ts">
const _data = inject<Ref<{ [key: string]: any }>>('data', () => ref({}), true)
const loading = inject<Ref<boolean>>('loading', () => ref(false), true)
const onTriggerNextStep = inject<Ref<() => any>>(
    'onTriggerNextStep',
    () => ref(() => {}),
    true
)

onTriggerNextStep.value = function () {}

const emit = defineEmits(['nextStep'])

const { data, status, execute, clear, error } = useAsyncData(
    'change-container-config',
    () =>
        $fetch('/api/docker/get-data-from-container', {
            method: 'GET',
            query: {
                name: _data.value.adapter.value.name
            }
        }),
    {
        immediate: false,
        lazy: true
    }
)

const dataFormatted = computed(() => {
    return JSON.stringify(data.value, null, 2)
})

onMounted(() => {
    execute()
})

onUnmounted(() => {
    clear()
})
</script>
