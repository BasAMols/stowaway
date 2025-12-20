<template>
    <q-layout view="lHh Lpr lFf">
        <q-drawer v-model="leftDrawerOpen" bordered behavior="mobile">

        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
