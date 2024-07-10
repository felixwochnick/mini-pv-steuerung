<template>
    <UPage>
        <template #left>
            <UAside />
        </template>
        <template #default>
            <UPageHeader title="Einstellungen" />
            <UPageBody class="space-y-4">
                <h2 id="generally" class="text-xl font-bold">Allgemein</h2>
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4 items-center">
                        <span>
                            Webseite in nicht über das öffentliche Netzwerk
                            erreichbar <UBadge label="Bald" color="gray" />
                        </span>
                        <span class="flex-grow" />
                        <UToggle
                            v-model="websitePublic"
                            class="place-self-center"
                            disabled
                        />
                    </div>
                </div>
                <h2 id="devices" class="text-xl font-bold">Sicherheit</h2>
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4 items-center">
                        <span>
                            Authentifizierung erforderlich über Benutzername und
                            Passwort
                            <UBadge label="Bald" color="gray" />
                        </span>
                        <span class="flex-grow" />
                        <UToggle
                            v-model="authenticationEnabled"
                            class="place-self-center"
                            disabled
                        />
                    </div>
                    <div class="flex gap-4 items-center">
                        <span>
                            Webseite nur über HTTPS erreichbar
                            <UBadge label="Bald" color="gray" />
                        </span>
                        <span class="flex-grow" />
                        <UToggle
                            v-model="https"
                            class="place-self-center"
                            disabled
                        />
                    </div>
                </div>
                <h2 id="devices" class="text-xl font-bold">Finazen</h2>
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4 items-center">
                        <span> Aktueller Strompreis [€/kWh] </span>
                        <span class="flex-grow" />
                        <UInput
                            class="w-32"
                            placeholder="0,40"
                            trailingIcon="i-ph-currency-eur"
                        />
                    </div>
                    <div class="flex gap-4 items-center">
                        <span> Gesamtinvestitionsbetrag </span>
                        <span class="flex-grow" />
                        <UInput
                            class="w-32"
                            placeholder="1800,45"
                            trailingIcon="i-ph-currency-eur"
                        />
                    </div>
                </div>
                <h2 id="devices" class="text-xl font-bold">Geräte</h2>
                <UButton
                    icon="i-ph-plus-bold"
                    block
                    @click="modalAddDevice = true"
                >
                    Gerät hinzufügen
                </UButton>
                <h2 id="adapter" class="text-xl font-bold">Adapter</h2>
            </UPageBody>
        </template>
        <template #right></template>
    </UPage>
    <AddDevice v-model="modalAddDevice" />
</template>

<script setup lang="ts">
const websitePublic = ref(false)
const authenticationEnabled = ref(false)
const https = ref(false)

const modalAddDevice = ref(false)
</script>
