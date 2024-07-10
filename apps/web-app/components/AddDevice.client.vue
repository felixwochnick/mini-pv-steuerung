<template>
    <UModal v-model="modelValue">
        <UCard
            :ui="{
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                body: {
                    base: 'relative pt-[2.5rem_!important]'
                },
                footer: {
                    base: 'flex gap-4'
                }
            }"
        >
            <template #header>
                <div class="flex items-center justify-between">
                    <h3
                        class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                    >
                        Gerät hinzufügen
                    </h3>
                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-1"
                        @click="modelValue = false"
                    />
                </div>
            </template>

            <template #default>
                <UProgress
                    size="xs"
                    animation="carousel"
                    :value="loading ? null : addDeviceStep"
                    :max="[
                        'Adapter suchen',
                        'Adapter auswählen',
                        'Gerät einrichten',
                        'Fertig'
                    ]"
                    class="absolute top-0 left-0 right-0"
                    :ui="{
                        steps: {
                            base: 'mr-6'
                        }
                    }"
                />
                Test
            </template>

            <template #footer>
                <UButton
                    icon="i-ph-x-bold"
                    color="gray"
                    variant="ghost"
                    label="Abbrechen"
                />
                <span class="flex-grow" />
                <UButton
                    icon="i-ph-arrow-arc-right-bold"
                    color="gray"
                    variant="ghost"
                    label="Überspringen"
                />
                <UButton icon="i-ph-arrow-right-bold" label="Weiter" />
            </template>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits()

const modelValue = useVModel(props, 'modelValue', emit)

const addDeviceStep = ref(0)

const loading = computed(() => false)// status.value === 'pending')

onMounted(() => {
})

watchEffect(() => {
})
</script>
