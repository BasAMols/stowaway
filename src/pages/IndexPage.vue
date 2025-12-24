<template>
    <q-page class="">
        <canvas ref="canvasRef"></canvas>
        <q-btn flat color="amber" :ripple="false" text-color="white" icon="layers_clear" @click="trigger('open')"
            top-left overlay class="fixed-top-left" />
    </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { flags, StowawayGame } from 'src/game/stowaway/game';

const canvasRef = ref<HTMLCanvasElement | null>(null);

function trigger(flag: flags) {
    $.game.toggleflag(flag);
}

onMounted(() => {
    if (canvasRef.value) {
        const game = new StowawayGame(canvasRef.value);
        game.start();
    }
});

</script>
