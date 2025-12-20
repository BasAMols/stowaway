<template>
    <q-page class="">
        <canvas ref="canvasRef" style="width: 100%; height: 100%;"></canvas>
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { StowawayGame } from 'src/game/stowaway/game';

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
    if (canvasRef.value) {
        const game = new StowawayGame(canvasRef.value);
        game.ticker.start();
    }
});

</script>
