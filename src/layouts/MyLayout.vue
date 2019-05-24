<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-grey">
      <q-toolbar>
        <q-avatar>
          <img src="statics/btslogo.png"/>
        </q-avatar>
        <q-toolbar-title>
          Bitshares Discord Tipping
        </q-toolbar-title>

        <div>Powered by Beet</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
