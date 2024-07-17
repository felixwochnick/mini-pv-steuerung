<template>
    <UModal v-model="modelValue" prevent-close>
        <UCard
            :ui="{
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                body: {
                    base: 'relative pt-[1.5rem_!important] space-y-4'
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
                        @click="cancel"
                    />
                </div>
            </template>

            <template #default>
                <UProgress
                    size="xs"
                    animation="carousel"
                    :value="step"
                    :max="[
                        'Adapter suchen',
                        'Adapter auswählen',
                        'Adapter starten',
                        'Gerät einrichten',
                        'Gerät wird hinzugefügt',
                        'Fertig'
                    ]"
                    class="absolute top-0 left-0 right-0"
                    :ui="{
                        steps: {
                            base: 'mr-6'
                        }
                    }"
                />
                <div>
                    <AddDeviceStep0
                        v-if="step === 0"
                        @next-step="nextStep"
                    />
                    <AddDeviceStep1
                        v-if="step === 1"
                        @next-step="nextStep"
                    />
                    <AddDeviceStep2
                        v-if="step === 2"
                        @next-step="nextStep"
                    />
                    <AddDeviceStep3
                        v-if="step === 3"
                        @next-step="nextStep"
                    />
                    <AddDeviceStep4
                        v-if="step === 4"
                        @next-step="nextStep"
                    />
                    <AddDeviceStep5
                        v-if="step === 5"
                        @next-step="nextStep"
                    />
                </div>
            </template>

            <template #footer>
                <UButton
                    icon="i-ph-x-bold"
                    color="gray"
                    variant="ghost"
                    label="Abbrechen"
                    @click="cancel"
                />
                <span class="flex-grow" />
                <UButton
                    icon="i-ph-arrow-arc-right-bold"
                    color="gray"
                    variant="ghost"
                    class="w-min"
                    :loading="loading"
                    @click="bypass"
                >
                    <span class="hidden sm:block"> Überspringen </span>
                </UButton>
                <UButton
                    icon="i-ph-arrow-right-bold"
                    label="Weiter"
                    :loading="loading"
                    @click="triggerNextStep"
                />
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

const step = ref(-1)
const data = ref({})
const loading = ref(false)
const onTriggerNextStep = ref(() => {})

provide('loading', loading)
provide('data', data)
provide('onTriggerNextStep', onTriggerNextStep)

function cancel() {
    step.value = -1
    modelValue.value = false
}

function bypass() {
    if (step.value == 1) {
        step.value = 3
        return
    }

    step.value++
}

function triggerNextStep() {
    console.log(onTriggerNextStep.value)
    onTriggerNextStep.value()
}

function nextStep() {
    step.value++
}

watch(modelValue, (n: boolean, o: boolean) => {
    if (n && !o) step.value = 0
})
</script>
