<template>
  <div>
    <el-input
      v-model="keyword"
      placeholder="Keywords"
      prefix-icon="el-icon-search">
    </el-input>
    <el-table :data="participants" v-loading="loading">
      <el-table-column
        label="ID"
        width="100"
        prop="id">
      </el-table-column>
      <el-table-column
        label="User Name"
        width="400"
        prop="username">
      </el-table-column>
      <el-table-column
        label="Email"
        prop="email">
      </el-table-column>
      <el-table-column
        label="option"
        align="center"
        width="100"
        fixed="right">
        <template slot-scope="{row}">
          <icon-btn icon="plus" name="Add the participant"
                    @click.native="handleAddParticipant(row.id)"></icon-btn>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="page"
      layout="prev, pager, next"
      @current-change="getUsers"
      :page-size="limit"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import api from '@admin/api'

  export default {
    name: 'add-participant-from-public',
    props: ['type', 'cid'],
    data () {
      return {
        page: 1,
        limit: 10,
        total: 0,
        loading: false,
        participants: [],
        contest: {},
        collection: {},
        keyword: ''
      }
    },
    mounted () {
      api.getCollection(this.type, this.cid).then(res => {
        this.collection = res.data.data
        this.getUsers(this.page)
      })
    },
    methods: {
      getUsers (page) {
        console.log('page is', page)
        this.loading = true
        api.getUserList((page - 1) * this.limit,
                        this.limit,
                        this.keyword).then(res => {
                          this.loading = false
                          this.total = res.data.data.total
                          this.participants = res.data.data.results
                        }).catch(() => {
                        })
      },
      handleAddParticipant (participantID) {
        let data = {
          type: this.type,
          uid: participantID,
          cid: this.cid
        }
        api.addCollectionParticipant(data).then(() => {
          this.$emit('on-change')
        })
      }
    },
    watch: {
      'keyword' () {
        this.getUsers(this.page)
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
