<template>
  <q-page class="flex flex-center">
    <q-form
      @submit="onSubmit"
      class="q-gutter-md"
      align="center"
    >
    <div class="row">
      <q-avatar>
        <img :src="acceptor_avatar"/>
      </q-avatar>
        <q-input
          class="q-pl-md"
          readonly
          filled
          v-model="acceptor"
          label="Tipping to"
          hint="Acceptor"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please keep something here from url parameters.']"
        />
    </div>
    <div class="row">
      <q-avatar>
        <img src="statics/btslogo.png"/>
      </q-avatar>
      <q-input
        class="q-pl-md"
        readonly
        filled
        v-model="btsname"
        label="Tipping to (bts name)"
        :hint="btsid"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please keep something here from url parameters.']"
      />
    </div>
    <div class="row">
      <q-avatar>
        <img :src="donator_avatar"/>
      </q-avatar>
      <q-input
        class="q-pl-md"
        readonly
        filled
        v-model="donator"
        label="Tipping from"
        hint="Donator"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please keep something here from url parameters.']"
      />
    </div>
    <div class="row">
      <q-avatar color="green" text-color="white" icon="directions" />
      <q-input
        class="q-pl-md"
        v-model="tbts"
        type="number"
        hint="100000 = 1 BTS"
        label='Amount of BTS to transfer'
        lazy-rules
        :rules="[ val => val && val > 0 || 'Please keep something here to donate.']"
      />
    </div>
      <div class="row justify-center">
        <q-btn label="Donate" type="submit" color="bg-white text-green"/>
      </div>
    </q-form>

  </q-page>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      acceptor: 'name..',
      donator: 'name..',
      donator_avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      acceptor_avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      u1: null,
      u2: null,
      btsname: 'null',
      btsid: 'null',
      beet: this.$beet,
      tbts: 0,
      accChannel: null
    }
  },
  methods: {
    async onSubmit () {
      try {
        let app = await this.$beet.connect()
        console.log(app.getAccount().name)
        console.log(app.getAccount())
        app.transfer({
          to: this.btsname.toString().trim(),
          amount: {
            satoshis: parseInt(this.tbts),
            asset_id: '1.3.0'
          }
        }).then(res => {
          console.log(res)
          this.$axios.get('https://bitshares-tipping.glitch.me/send_success/' + this.$route.params.acceptor + '/' + this.$route.params.donator + '/' + this.tbts.toString()).then((res) => {
            this.$q.notify({
              color: 'green',
              message: 'Successfully notified on group.',
              icon: 'done'
            })
          })
          this.$q.notify({
            color: 'green',
            message: 'Successfully transferred.',
            icon: 'done'
          })
        }).catch(err => {
          console.log(err)
          this.$q.notify({
            color: 'red',
            message: 'Error occurred, Please see console for more details.',
            icon: 'report_problem'
          })
        })

        // console.log('Linked account', app.SYMBOL.getAccount())
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted () {
    this.$q.loading.show({
      message: 'Loading user data, Please wait...'
    })
    this.$axios.get('https://bitshares-tipping.glitch.me/users_acceptor/' + this.$route.params.acceptor).then((res) => {
      // console.log(res)
      this.acceptor = res.data[0]
      this.acceptor_avatar = res.data[1]
      this.$q.loading.hide()
    })
    this.$axios.get('https://bitshares-tipping.glitch.me/users_donator/' + this.$route.params.donator).then((res) => {
      // console.log(res)
      this.donator = res.data[0]
      this.donator_avatar = res.data[1]
      this.$q.loading.hide()
    })
    this.$axios.get('https://explorer.bitshares-kibana.info/account?account_id=' + this.$route.params.btsid).then((res) => {
      this.btsid = res.data.id
      this.btsname = res.data.name
    })
    // this.$dclient.on('message', msg => {
    //   const guildTag = msg.channel.type === 'text' ? `[${msg.guild.name}]` : '[DM]'
    //   const channelTag = msg.channel.type === 'text' ? `[#${msg.channel.name}]` : ''
    //   console.log(`${guildTag}${channelTag} ${msg.author.tag}: ${msg.content}`)
    // })
    // let channel = this.$dclient.channels.find('name', 'accountant-bot')
    // this.accChannel = channel
  }
}
</script>
