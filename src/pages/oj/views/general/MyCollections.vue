<template>
  <Panel shadow :padding="10" v-if="collections.length">
    <div slot="title">
      {{title}}
    </div>
    <div slot="extra">
      <Button v-if="listVisible" type="info" @click="init" :loading="btnLoading">{{$t('m.Refresh')}}</Button>
      <Button v-else type="ghost" icon="ios-undo" @click="goBack">{{$t('m.Back')}}</Button>
    </div>

    <transition-group name="collection-animate" mode="in-out">
      <div class="no-collection" v-if="!collections.length" key="no-collection">
        <p>{{$t('m.No_Collections')}}</p>
      </div>
      <Collection v-for="collection in collections" :key="collection.id" :collection="collection" ></Collection>
    </transition-group>
  </Panel>
</template>

<script>
  import api from '@oj/api'
  import Pagination from '@oj/components/Pagination'
  import Collection from '@oj/views/collection/Collection'

  export default {
    name: 'Collections',
    components: {
      Pagination,
      Collection
    },
    data () {
      return {
        limit: 10,
        total: 10,
        btnLoading: false,
        collections: [],
        collection: '',
        listVisible: true
      }
    },
    props: ['type'],
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.getCollectionList()
      },
      getCollectionList (page = 1) {
        this.btnLoading = true
        api.getMyCollectionList(this.type, (page - 1) * this.limit, this.limit).then(res => {
          this.btnLoading = false
          this.collections = res.data.data.results
          this.total = res.data.data.total
        }, () => {
          this.btnLoading = false
        })
      },
      getContestCollectionList () {
        this.btnLoading = true
        api.getContestCollectionList(this.$route.params.contestID).then(res => {
          this.btnLoading = false
          this.collections = res.data.data
        }, () => {
          this.btnLoading = false
        })
      },
      goCollection (collection) {
        this.collection = collection
        this.listVisible = false
      },
      goBack () {
        this.listVisible = true
        this.collection = ''
      }
    },
    computed: {
      title () {
        if (this.type === 'course') {
          return this.$i18n.t('m.My_Course')
        } else {
          return this.$i18n.t('m.My_Practice')
        }
      },
      isContest () {
        return !!this.$route.params.contestID
      }
    }
  }
</script>

<style scoped lang="less">
  .collections-container {
    margin-top: -10px;
    margin-bottom: 10px;
    li {
      padding-top: 15px;
      list-style: none;
      padding-bottom: 15px;
      margin-left: 20px;
      font-size: 16px;
      border-bottom: 1px solid rgba(187, 187, 187, 0.5);
      &:last-child {
        border-bottom: none;
      }
      .flex-container {
        .title {
          flex: 1 1;
          text-align: left;
          padding-left: 10px;
          a.entry {
            color: #495060;
            &:hover {
              color: #2d8cf0;
              border-bottom: 1px solid #2d8cf0;
            }
          }
        }
        .creator {
          flex: none;
          width: 200px;
          text-align: center;
        }
        .date {
          flex: none;
          width: 200px;
          text-align: center;
        }
      }
    }
  }

  .content-container {
    padding: 0 20px 20px 20px;
  }

  .no-collection {
    text-align: center;
    font-size: 16px;
  }changeLocale

  .collection-animate-enter-active {
    animation: fadeIn 1s;
  }
</style>
