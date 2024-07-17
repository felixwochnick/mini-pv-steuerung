<template>
    <div class="text-sm text-justify">
        Dieses Programm wird die Daten über z.B. Leistung über eine HTTP-API von
        ihrem Gerät (z.B. Wechselrichter) abrufen.
    </div>
    <div class="text-sm text-justify">
        Wenn Sie ein Gerät hinzufügen wollen, der noch keine HTTP-API hat oder
        Sie die API nicht konfigurieren wollen, können Sie einen Adapter
        auswählen, der die Kommunikation mit dem Gerät übernimmt.
    </div>
    <div class="text-sm text-justify">
        Falls Sie ein Gerät hinzufügen wollen, an dem keine Werte gemessen
        werden (z.B. Solarzellen), oder Sie bereits eine HTTP-API konfiguriert
        haben, können Sie diesen Schritt überspringen.
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
                :options="images"
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

<script setup lang="ts">
import { z } from 'zod'
import type { Form } from '#ui/types'

const data = inject<Ref<{ [key: string]: any }>>('data', () => ref({}), true)
const loading = inject<Ref<boolean>>('loading', () => ref(false), true)
const onTriggerNextStep = inject<Ref<() => any>>(
    'onTriggerNextStep',
    () => ref(() => {}),
    true
)

onTriggerNextStep.value = async function nextStep() {
    if (
        !(await refAdapterForm.value?.validate(['image', 'name'], {
            silent: true
        }))
    )
        return

    data.value.adapter = {
        image: adapterForm.image,
        name: adapterForm.name
    }

    emit('nextStep')
}

const emit = defineEmits(['nextStep'])

const images = computed<string[]>(() => data.value.images)

const adapterSchema = z.object({
    image: z.string().min(1, 'Bitte wählen Sie einen Adapter aus'),
    name: z
        .string()
        .regex(/^[a-z0-9-]+$/, {
            message:
                'Der Name darf nur Kleinbuchstaben, Zahlen und Striche enthalten'
        })
        .or(z.literal(''))
})

const adapterForm = reactive({
    image: '',
    name: ''
})

const refAdapterForm = ref<Form<typeof adapterForm>>()
</script>
