<template>
  <div class="view">
    <Panel :title="pageTitle">
      <div slot="header">
        <el-input
          v-model="keyword"
          prefix-icon="el-icon-search"
          placeholder="Keywords">
        </el-input>
      </div>
      <el-table
        v-loading="loading"
        element-loading-text="loading"
        ref="table"
        :data="participantList"
        @row-dblclick="handleDblclick"
        style="width: 100%">
        <el-table-column
          width="100"
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          width="150"
          label="Display ID">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{row._id}}</span>
            <el-input v-show="row.isEditing" v-model="row._id"
                      @keyup.enter.native="handleInlineEdit(row)">

            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="Title">
          <template slot-scope="{row}">
            <span v-show="!row.isEditing">{{row.title}}</span>
            <el-input v-show="row.isEditing" v-model="row.title"
                      @keyup.enter.native="handleInlineEdit(row)">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_by.username"
          label="Author">
        </el-table-column>
        <el-table-column
          width="200"
          prop="create_time"
          label="Create Time">
          <template slot-scope="scope">
            {{scope.row.create_time }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operation"
          width="250">
          <div slot-scope="scope">
            <icon-btn name="Edit" icon="edit" @click.native="goEdit(scope.row.id)"></icon-btn>
            <icon-btn icon="download" name="Download TestCase"
                      @click.native="downloadTestCase(scope.row.id)"></icon-btn>
            <icon-btn icon="trash" name="Delete Participant"
                      @click.native="deleteParticipant(scope.row.id)"></icon-btn>
          </div>
        </el-table-column>
      </el-table>
      <div class="panel-options">
        <el-button type="primary"
                   size="small" icon="el-icon-plus"
                   @click="addParticipantDialogVisible = true">Add Participants
        </el-button>
        <el-pagination
          class="page"
          layout="prev, pager, next"
          @current-change="currentChange"
          :page-size="pageSize"
          :total="total">
        </el-pagination>
      </div>
    </Panel>
    <el-dialog title="Add Collections Participant"
               width="80%"
               :visible.sync="addParticipantDialogVisible"
               @close-on-click-modal="false">
      <add-participant-component :cid="cId" :type="pageType" @on-change="getParticipantList"></add-participant-component>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../api.js'
  import utils from '@/utils/utils'
  import AddParticipantComponent from './AddParticipant.vue'

  export default {
    name: 'ParticipantList',
    components: {
      AddParticipantComponent
    },
    computed: {
      pageType () {
        return this.collectionType
      },
      cId () {
        return this.courseid || this.practiceId
      },
      pageTitle () {
        if (this.collectionType === 'course') {
          return this.$i18n.t('m.Course_Participant_List')
        } else {
          return this.$i18n.t('m.Practice_Participant_List')
        }
      }
    },
    data () {
      return {
        pageSize: 10,
        total: 0,
        participantList: [],
        keyword: '',
        loading: false,
        currentPage: 1,
        routeName: '',
        couseId: '',
        practiceId: '',
        // for make public use
        currentParticipantID: '',
        currentRow: {},
        InlineEditDialogVisible: false,
        addParticipantDialogVisible: false
      }
    },
    mounted () {
      this.routeName = this.$route.name
      switch (this.collectionType) {
        case 'course':
          this.courseId = this.$route.params.id
          break
        case 'practice':
          this.practiceId = this.$route.params.id
          break
      }
      this.getParticipantList(this.currentPage)
    },
    methods: {
      handleDblclick (row) {
        row.isEditing = true
      },
      // 切换页码回调
      currentChange (page) {
        this.currentPage = page
        this.getParticipantList(page)
      },
      getParticipantList (page = 1) {
        this.loading = true
        let params = {
          limit: this.pageSize,
          offset: (page - 1) * this.pageSize,
          keyword: this.keyword,
          collection_id: this.courseId || this.practiceId,
          collection_type: this.collectionType
        }
        api.getCollectionParticipantList(params).then(res => {
          this.loading = false
          this.total = res.data.data.total
          for (let participant of res.data.data.results) {
            participant.isEditing = false
          }
          this.participantList = res.data.data.results
        }, res => {
          this.loading = false
        })
      },
      deleteParticipant (id) {
        this.$confirm('Sure to delete this participant?', 'Delete Participant', {
          type: 'warning'
        }).then(() => {
          let funcName = 'deleteParticipant'
          api[funcName](id).then(() => [
            this.getParticipantList(this.currentPage - 1)
          ]).catch(() => {
          })
        }, () => {
        })
      },
      handleInlineEdit (row) {
        this.currentRow = row
        this.InlineEditDialogVisible = true
      },
      downloadTestCase (participantID) {
        let url = '/admin/test_case?participant_id=' + participantID
        utils.downloadFile(url)
      },
      getPublicParticipant () {
        api.getParticipantList()
      }
    },
    props: ['collectionType'],
    watch: {
      '$route' (newVal, oldVal) {
        this.contestId = newVal.params.contestId
        this.routeName = newVal.name
        this.getParticipantList(this.currentPage)
      },
      'keyword' () {
        this.currentChange()
      }
    }
  }
</script>

<style scoped lang="less">
</style>
