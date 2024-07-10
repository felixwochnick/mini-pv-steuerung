<template>
    <UPage>
        <template #left>
            <UAside />
        </template>
        <template #default>
            <UPageHeader title="Einstellungen" />
            <UPageBody class="space-y-4">
                <h2 id="generally">Allgemein</h2>
                <div></div>
                <h2 id="devices">Geräte</h2>
                <UButton
                    icon="i-ph-plus-bold"
                    block
                    @click="modalAddDevice = true"
                >
                    Gerät hinzufügen
                </UButton>
                <h2 id="devices">Adapter</h2>
            </UPageBody>
        </template>
        <template #right></template>
    </UPage>
    <UModal v-model="modalAddDevice">
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
                        @click="modalAddDevice = false"
                    />
                </div>
            </template>

            <template #default>
                <UProgress
                    size="2xs"
                    :value="addDeviceStep"
                    :max="['Adapter hinzufügen', 'Gerät einrichten', 'Fertig']"
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
const modalAddDevice = ref(false)

const addDeviceStep = ref(0)
</script>
