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
                        'Fertig'
                    ]"
                    class="absolute top-0 left-0 right-0"
                    :ui="{
                        steps: {
                            base: 'mr-6'
                        }
                    }"
                />
                <template v-if="step == 1">
                    <div class="text-sm text-justify">
                        Dieses Programm wird die Daten über z.B. Leistung über
                        eine HTTP-API von ihrem Gerät (z.B. Wechselrichter)
                        abrufen.
                    </div>
                    <div class="text-sm text-justify">
                        Wenn Sie ein Gerät hinzufügen wollen, der noch keine
                        HTTP-API hat oder Sie die API nicht konfigurieren
                        wollen, können Sie einen Adapter auswählen, der die
                        Kommunikation mit dem Gerät übernimmt.
                    </div>
                    <div class="text-sm text-justify">
                        Falls Sie ein Gerät hinzufügen wollen, an dem keine
                        Werte gemessen werden (z.B. Solarzellen), oder Sie
                        bereits eine HTTP-API konfiguriert haben, können Sie
                        diesen Schritt überspringen.
                    </div>
                    <UForm
                        :schema="adapterSchema"
                        :state="adapterForm"
                        ref="refAdapterForm"
                        class="space-y-4"
                    >
                        <UFormGroup label="Adapter" name="image" required>
                            <USelectMenu
                                searchable
                                searchable-placeholder="Adapter suchen"
                                class="w-full"
                                placeholder="Adapter auswählen"
                                :options="dataImages"
                                v-model="adapterForm.image"
                            />
                        </UFormGroup>
                        <UFormGroup label="Adaptername" name="name">
                            <UInput
                                class="w-full"
                                placeholder="Name des Adapters"
                                v-model="adapterForm.name"
                            />
                        </UFormGroup>
                    </UForm>
                </template>
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
                    @click="nextStep"
                />
            </template>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { z } from 'zod'
import type { Form } from '#ui/types'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits()

const modelValue = useVModel(props, 'modelValue', emit)

const step = ref(0)
const adapterSchema = z.object({
    image: z.string().min(1, 'Bitte wählen Sie einen Adapter aus'),
    name: z.string().optional()
})
const adapterForm = reactive({
    image: '',
    name: ''
})
const refAdapterForm = ref<Form<typeof adapterForm>>()

const {
    data: dataImages,
    status: statusImages,
    execute: executeImages,
    clear: clearImages
} = useFetch('/api/docker/get-available-images', {
    query: {
        repository: 'minipvsteuerung'
    },
    lazy: true,
    immediate: false
})

const {
    data: dataStartContainer,
    status: statusStartContainer,
    execute: executeStartContainer,
    clear: clearStartContainer
} = useAsyncData(
    'start-container',
    () =>
        $fetch('/api/docker/start-container', {
            method: 'POST',
            body: {
                image: adapterForm.image,
                name: adapterForm.name
            }
        }),
    {
        immediate: false,
        lazy: true
    }
)

const loading = computed(
    () =>
        statusImages.value === 'pending' ||
        statusStartContainer.value === 'pending'
)

watch(modelValue, async (value, old) => {
    if (value && !old) {
        await executeImages()
        step.value = 1
    }
})

function cancel() {
    step.value = 0
    modelValue.value = false

    clearImages()
    adapterForm.image = ''
    adapterForm.name = ''
    clearStartContainer()
}

function bypass() {
    if (step.value == 1) {
        step.value = 3
        return
    }

    step.value++
}

async function nextStep() {
    if (step.value == 1) {
        if (
            !(await refAdapterForm.value?.validate(['image', 'name'], {
                silent: true
            }))
        )
            return
        executeStartContainer()
    }

    step.value++
}
</script>
