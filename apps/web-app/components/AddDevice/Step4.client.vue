<template>
    <div></div>
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

const { status, execute, clear, error } = useAsyncData(
    'change-container-config',
    () =>
        $fetch('/api/docker/change-container-config', {
            method: 'POST',
            body: {
                containerId: _data.value.container.id,
                config: _data.value.env,
                image: _data.value.adapter.image,
                name: _data.value.adapter.name
            }
        }),
    {
        immediate: false,
        lazy: true
    }
)

onMounted(() => {
    execute()
})

onUnmounted(() => {
    loading.value = false
    clear()
})

watchEffect(() => {
    if (status.value === 'pending') {
        loading.value = true
    } else if (status.value === 'success') {
        loading.value = false

        emit('nextStep')
    } else if (status.value === 'error') {
        loading.value = false
        console.error(error.value)
    }
})
</script>
