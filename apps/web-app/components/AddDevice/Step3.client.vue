<template>
    <div>
        <UForm :schema="schema" :state="values">
            <UFormGroup
                v-for="_var in vars"
                :key="_var.name"
                :label="_var.name"
                :name="_var.name"
            >
                <UInput
                    class="w-full"
                    :placeholder="_var.description"
                    v-model="values.name"
                />
            </UFormGroup>
        </UForm>
    </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const data = inject<Ref<{ [key: string]: any }>>('data', () => ref({}), true)
const loading = inject<Ref<boolean>>('loading', () => ref(false), true)
const onTriggerNextStep = inject<Ref<() => any>>(
    'onTriggerNextStep',
    () => ref(() => {}),
    true
)

onTriggerNextStep.value = function () {}

const emit = defineEmits(['nextStep'])

const vars = computed(
    () =>
        data.value.container.schema.container.env as Array<{
            name: string
            description: string
        }>
)

const schema = computed(() =>
    z.object(
        Object.fromEntries(vars.value.map(_var => [_var.name, z.string()]))
    )
)

const values = reactive(
    Object.fromEntries(vars.value.map(_var => [_var.name, '']))
)
</script>
