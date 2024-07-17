<template>
    <div></div>
</template>

<script setup lang="ts">
const data = inject<Ref<{ [key: string]: any }>>('data', () => ref({}), true)
const loading = inject<Ref<boolean>>('loading', () => ref(false), true)
const onTriggerNextStep = inject<Ref<() => any>>(
    'onTriggerNextStep',
    () => ref(() => {}),
    true
)

onTriggerNextStep.value = function () {}

const emit = defineEmits(['nextStep'])

const {
    data: dataImages,
    status: statusImages,
    clear: clearImages
} = useFetch('/api/docker/get-available-images', {
    query: {
        repository: 'minipvsteuerung'
    },
    lazy: true
})

watchEffect(() => {
    if (statusImages.value === 'pending') {
        loading.value = true
    } else if (statusImages.value === 'success') {
        loading.value = false

        data.value.images = dataImages.value

        emit('nextStep')
    }
})

onBeforeUnmount(() => {
    clearImages()
})
</script>
