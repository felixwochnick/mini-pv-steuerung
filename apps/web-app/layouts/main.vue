<template>
    <UHeader :links="appConfig.headerLinks || []">
        <template #left>
            <UIcon name="i-ph-solar-panel-duotone" class="text-4xl" />
            <span class="font-semibold text-xl ml-2"> Mini PV Steuerung </span>
        </template>
        <template #right>
            <UColorModeButton />
        </template>
    </UHeader>
    <UMain>
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <slot />
        </div>
    </UMain>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig()
</script>
