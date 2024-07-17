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

const adapter = computed(
    () => _data.value.adapter as { image: string; name: string }
)

const { data, status, execute, clear, error } = useAsyncData(
    'start-container',
    () =>
        $fetch('/api/docker/start-container', {
            method: 'POST',
            body: {
                image: adapter.value.image,
                name: adapter.value.name
            }
        }),
    {
        immediate: false,
        lazy: true
    }
)

onMounted(() => {
    console.log('adapter', adapter.value)
    execute()
})

onUnmounted(() => {
    clear()
})

watchEffect(() => {
    if (status.value === 'pending') {
        loading.value = true
    } else if (status.value === 'success') {
        loading.value = false

        _data.value.container = data.value

        emit('nextStep')
    } else if (status.value === 'error') {
        loading.value = false
        console.error(error.value)
    }
})
</script>
