<template>
    <q-drawer v-model="leftDrawerOpen" behavior="desktop" overlay :dark="true" mini elevated class="opacity-80">
        <q-btn flat :ripple="false" text-color="white" icon="close" @click="toggleLeftDrawer()" />
        <q-btn flat :ripple="false" text-color="white" icon="layers_clear" @click="trigger('open')" />
        <q-btn flat :ripple="false" text-color="white" icon="bug_report" @click="trigger('debug')" />

        <label class="text-white block">Speed</label>
        <q-slider vertical snap dark v-model="speedValue" :min="0.1" :max="5" :step="0.01"
            @update:model-value="setSpeedValue" style="height: 100px; margin-top: 10px;" />
        <label style="color: white;">Zoom</label>
        <q-slider vertical snap dark v-model="zoomValue" :min="1" :max="5" :step="0.1"
            @update:model-value="setZoomValue" style="height: 100px; margin-top: 10px;" />
    </q-drawer>

    <q-page class="">
        <q-btn overlay class="fixed-top-left" left flat :ripple="false" text-color="white" icon="menu"
            @click="toggleLeftDrawer()" style="top: 0px;" />
        <canvas id="target-canvasRef" ref="canvasRef"></canvas>
        <q-tooltip max-width="1000px" style="font-size: 1.3rem;" ref="tooltipRef" no-parent-event>
            {{ tooltipText }}
        </q-tooltip>

    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { flags, StowawayGame } from 'src/game/stowaway/game';

const leftDrawerOpen = ref(false);
const speedValue = ref(0);
const zoomValue = ref(0);
const tooltipRef = ref();
const tooltipText = ref('test');
function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}
function setSpeedValue(value: number) {
    $.values.speed = value;
}
function setZoomValue(value: number) {
    $.values.zoom = value;
}
const canvasRef = ref<HTMLCanvasElement | null>(null);

function trigger(flag: flags) {
    $.game.toggleflag(flag);
}

onMounted(() => {
    tooltipRef.value.show();

    if (canvasRef.value) {
        const game = new StowawayGame(canvasRef.value, tooltipText);
        game.start();
    }
});

</script>
