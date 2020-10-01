<template>
  <Row type="flex" :gutter="18">
    <Col :span=22>
    <Panel shadow>
      <div slot="title">{{collection.title}}</div>
      <Table style="width: 100%; font-size: 16px;"
             :columns="collectionTableColumns"
             :data="problems"
             disabled-hover></Table>
    </Panel>
    <Pagination :total="total" :page-size="limit" @on-change="pushRouter" :current.sync="query.page"></Pagination>

    </Col>

  </Row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Pagination from '@oj/components/Pagination'

  export default {
    name: 'Collection',
    components: {
      Pagination
    },
    props: ['collection'],
    data () {
      return {
        tagList: [],
        collectionTableColumns: [
          {
            width: 60,
            title: ' ',
            render: (h, params) => {
              let status = params.row.my_status
              if (status === null || status === undefined) {
                return undefined
              }
              return h('Icon', {
                props: {
                  type: status === 0 ? 'checkmark-round' : 'minus-round',
                  size: '16'
                },
                style: {
                  color: status === 0 ? '#19be6b' : '#ed3f14'
                }
              })
            }
          },
          {
            title: '#',
            key: '_id',
            width: 80,
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'problem-details', params: {problemID: params.row._id}})
                  }
                },
                style: {
                  padding: '2px 0'
                }
              }, params.row._id)
            }
          },
          {
            title: this.$i18n.t('m.Title'),
            /* width: 400, */
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'large'
                },
                on: {
                  click: () => {
                    this.$router.push({name: 'problem-details', params: {problemID: params.row._id}})
                  }
                },
                style: {
                  padding: '2px 0',
                  overflowX: 'auto',
                  textAlign: 'left',
                  width: '100%'
                }
              }, params.row.title)
            }
          },
          {
            title: this.$i18n.t('m.Level'),
            width: 100,
            render: (h, params) => {
              let t = params.row.difficulty
              let color = 'blue'
              if (t === 'Low') color = 'green'
              else if (t === 'High') color = 'yellow'
              return h('Tag', {
                props: {
                  color: color
                }
              }, this.$i18n.t('m.' + params.row.difficulty))
            }
          }
        ],
        limit: 10,
        routeName: '',
        query: {
          keyword: '',
          difficulty: '',
          tag: '',
          page: 1
        }
      }
    },
    mounted () {
    },
    methods: {
    },
    computed: {
      total () {
        return this.collection.problems.length
      },
      problems () {
        return this.collection.problems.slice((this.query.page - 1) * this.limit, this.query.page * this.limit)
      },
      pageTitle () {
        if (this.type === 'course') {
          return this.$i18n.t('m.Course_List')
        } else {
          return this.$i18n.t('m.Practice_List')
        }
      },
      ...mapGetters(['isAuthenticated'])
    },
    watch: {
    }
  }
</script>

<style scoped lang="less">
  .taglist-title {
    margin-left: -10px;
    margin-bottom: -10px;
  }

  .tag-btn {
    margin-right: 5px;
    margin-bottom: 10px;
  }

  #pick-one {
    margin-top: 10px;
  }
</style>
