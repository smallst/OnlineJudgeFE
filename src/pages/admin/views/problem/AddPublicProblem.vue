<template>
  <div>
    <el-input
      v-model="keyword"
      placeholder="Keywords"
      prefix-icon="el-icon-search">
    </el-input>
    <el-table :data="problems" v-loading="loading">
      <el-table-column
        label="ID"
        width="100"
        prop="id">
      </el-table-column>
      <el-table-column
        label="DisplayID"
        width="200"
        prop="_id">
      </el-table-column>
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
      <el-table-column
        label="option"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="Add the problem"
                    @click.native="handleAddProblem(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getPublicProblem"
      :page-size="limit"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'add-problem-from-public',
    props: ['type', 'cid'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        problems: [],
        contest: {},
        collection: {},
        keyword: ''
      }
    },
    mounted () {
      // todo: support contest/course/practice
      if (this.type === 'contest') {
        api.getContest(this.cid).then(res => {
          this.contest = res.data.data
          this.getPublicProblem()
        }).catch(() => {
        })
      } else {
        api.getCollection(this.type, this.cid).then(res => {
          this.collection = res.data.data
          this.getPublicProblem()
        })
      }
    },
    methods: {
      getPublicProblem (page) {
        this.loading = true
        let params = {
          keyword: this.keyword,
          offset: (page - 1) * this.limit,
          limit: this.limit
        }
        if (this.type === 'contest') {
          params['rule_type'] = this.contest.rule_type
        }
        api.getProblemList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          this.problems = res.data.data.results
        }).catch(() => {
        })
      },
      handleAddProblem (problemID) {
        let data = {
          type: this.type,
          pid: problemID,
          cid: this.cid
        }
        if (this.type === 'contest') {
          this.$prompt('Please input display id for the contest problem', 'confirm').then(({value}) => {
            data.display_id = value
            api.addProblemFromPublic(this.type === 'contest' ? 'contest' : 'collection', data).then(() => {
              this.$emit('on-change')
            }, () => {})
          }, () => {
          })
        } else {
          api.addProblemFromPublic('collection', data).then(() => {
            this.$emit('on-change')
          })
        }
      }
    },
    watch: {
      'keyword' () {
        this.getPublicProblem(this.page)
      }
    }
  }
</script>
<style scoped>
  .page {
    margin-top: 20px;
    text-align: right
  }

</style>
