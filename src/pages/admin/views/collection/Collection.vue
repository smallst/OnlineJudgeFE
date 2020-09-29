<template>
  <div class="view">
    <Panel :title="title">
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('m.CollectionTitle')" required>
              <el-input v-model="collection.title" :placeholder="$t('m.CollectionTitle')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.CollectionDescription')" required>
              <Simditor v-model="collection.description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <save @click.native="saveCollection"></save>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Simditor from '../../components/Simditor.vue'

  export default {
    name: 'CreateCollection',
    components: {
      Simditor
    },
    props: ['type', 'method'],
    computed: {
      title () {
        return (this.method + ' ' + this.type).toUpperCase()
      },
      redirectRouteName () {
        return this.type + '-list'
      }
    },
    data () {
      return {
        disableRuleType: false,
        collection: {
          title: '',
          description: '',
          visible: true
        }
      }
    },
    methods: {
      saveCollection () {
        let data = Object.assign({}, this.collection)
        api.saveCollection(this.type, this.method, data).then(res => {
          this.$router.push({name: this.redirectRouteName, query: {refresh: 'true'}})
        }).catch(() => {
        })
      }
    },
    mounted () {
      if (this.method === 'edit') {
        this.disableRuleType = true
        api.getCollection(this.type, this.$route.params.collectionId).then(res => {
          this.collection = res.data.data
        }).catch(() => {
        })
      }
    }
  }
</script>
