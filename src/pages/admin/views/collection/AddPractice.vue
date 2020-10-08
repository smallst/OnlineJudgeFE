<template>
  <div>
    <el-input
      v-model="keyword"
      placeholder="Keywords"
      prefix-icon="el-icon-search">
    </el-input>
    <el-table :data="practices" v-loading="loading">
      <el-table-column
        label="ID"
        width="100"
        prop="id">
      </el-table-column>
      <el-table-column
        label="Title"
        width="400"
        prop="title">
      </el-table-column>
      <el-table-column
        label="Desc"
        prop="description">
      </el-table-column>
      <el-table-column
        label="option"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="Add the practice"
                    @click.native="handleAddPractice(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getPractice"
      :page-size="limit"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'add-practice-from-public',
    props: ['cid'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        practices: [],
        contest: {},
        collection: {},
        keyword: ''
      }
    },
    mounted () {
      this.getPractices(this.page)
    },
    methods: {
      getPractices (page) {
        this.loading = true
        api.getList('practice', (page - 1) * this.limit,
                        this.limit,
                        this.keyword).then(res => {
                          this.loading = false
                          this.total = res.data.data.total
                          this.practices = res.data.data.results
                        }).catch(() => {
                        })
      },
      handleAddPractice (practiceID) {
        let data = {
          pid: practiceID,
          cid: this.cid
        }
        api.addCoursePractice(data).then(() => {
          this.$emit('on-change')
        })
      }
    },
    watch: {
      'keyword' () {
        this.getPractices(this.page)
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
