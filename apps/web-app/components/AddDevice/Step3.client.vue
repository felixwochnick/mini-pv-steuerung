<template>
    <div>
        <UForm
            :state="values"
            :validate="validate"
            ref="form"
            class="flex flex-col gap-4"
        >
            <UAlert
                icon="i-ph-info-duotone"
                title="Geräteangaben"
                description="Dass diese Anwendung Daten von ihrem Gerät abrufen kann, benötigt sie folgende Informationen:"
            />
            <UFormGroup
                v-for="_var in vars"
                :key="_var.name"
                :label="_var.name"
                :name="_var.name"
                required
            >
                <UInput
                    class="w-full"
                    :placeholder="_var.description"
                    v-model="values[_var.name]"
                    autocomplete="none"
                />
            </UFormGroup>
        </UForm>
    </div>
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
        !(await form.value?.validate(Object.keys(values), {
            silent: true
        }))
    )
        return

    data.value.env = values

    emit('nextStep')
}

const emit = defineEmits(['nextStep'])

const vars = computed(
    () =>
        data.value.container.schema.container.env as Array<{
            name: string
            description: string
        }>
)

const values = reactive(
    Object.fromEntries(vars.value.map(_var => [_var.name, '']))
)

const stringSchema = z.string().min(1)

function validate(state: typeof values) {
    const errors: Array<{ path: string; message: string }> = []

    for (const key in state)
        if (stringSchema.safeParse(state[key]).success === false)
            errors.push({
                path: key,
                message: 'Dieses Feld ist erforderlich.'
            })

    return errors
}

const form = ref<Form<typeof values>>()
</script>
