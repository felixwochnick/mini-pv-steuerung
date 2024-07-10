<template>
    <ULandingSection title="Zusammenfassung für Heute">
        <ULandingGrid>
            <ULandingCard
                class="col-span-3"
                icon="i-ph-sun-duotone"
                title="Ertrag"
            >
                <template #description>
                    <span class="text-4xl font-bold">128</span> <span>Wh</span>
                </template>
            </ULandingCard>
            <ULandingCard
                class="col-span-3"
                icon="i-ph-battery-charging-duotone"
                title="Batteriestand"
            >
                <template #description>
                    <span class="text-4xl font-bold">90</span> <span>%</span>
                </template>
            </ULandingCard>
            <ULandingCard
                class="col-span-3"
                icon="i-ph-lightning-duotone"
                title="Bezug / Einspeisung"
            >
                <template #description>
                    <span class="flex justify-start gap-4">
                        <span>
                            <UIcon name="i-ph-arrow-up" />
                            <span class="text-4xl font-bold">128</span>
                            <span>Wh</span>
                        </span>
                        <span>
                            <UIcon name="i-ph-arrow-down" />
                            <span class="text-4xl font-bold">128</span>
                            <span>Wh</span>
                        </span>
                    </span>
                </template>
            </ULandingCard>
            <ULandingCard
                class="col-span-3"
                icon="i-ph-currency-eur"
                title="Strom gespart"
            >
                <template #description>
                    <span class="text-4xl font-bold">40</span> <span>€</span>
                </template>
            </ULandingCard>
        </ULandingGrid>
    </ULandingSection>
</template>
