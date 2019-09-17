<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        视频源
        <el-select v-model="listQuery.tvSource" placeholder="选择视频源" size="mini" >
          <el-option label="腾讯" value="tencent"></el-option>
          <el-option label="爱奇艺" value="yinhe"></el-option>
          <el-option label="优酷" value="youku"></el-option>
        </el-select>
        用户类型
        <el-select v-model="listQuery.userType" placeholder="选择用户类型" size="mini" >
          <el-option label="非会员用户" value="1"></el-option>
          <el-option label="会员用户" value="2"></el-option>
          <el-option label="过期会员" value="3"></el-option>
        </el-select>
      </search-pane>
      <el-button-group slot="action" class="cc-action-button-group">
        <el-button type="success" icon="el-icon-circle-plus" size="mini" @click="handleNew" v-if="checkUserRole('VIDEO_IMG_ADD')">新增活动图标</el-button>
      </el-button-group>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                @selection-change="handleSelectionChange"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="ID" width="80" fixed>
          <template slot-scope="scope">
            {{ scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="视频源" width="120">
          <template slot-scope="scope">
            {{ scope.row.tvSource}}
          </template>
        </el-table-column>
        <el-table-column align="left" label="用户类型" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.userType === 1">非会员用户</span>
            <span v-if="scope.row.userType === 2">会员用户</span>
            <span v-if="scope.row.userType === 3">过期会员</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="优先级" width="100">
          <template slot-scope="scope">
            {{scope.row.sortOrder}}
          </template>
        </el-table-column>
        <el-table-column label="有效期开始时间" width="150">
          <template slot-scope="scope">
            {{ scope.row.startTime }}
          </template>
        </el-table-column>
        <el-table-column label="有效期结束时间" width="150">
          <template slot-scope="scope">
            {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column label="VIP运营图标" width="200">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" style="width: 180px;height:50px;"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  width="100">
          <template slot-scope="scope">
            <el-tooltip content="编辑">
              <el-button type="primary" size="mini" circle icon="el-icon-edit"
                         @click="handleEditLayoutDetail(scope.$index, scope.row)"  v-if="checkUserRole('VIDEO_IMG_EDIT')"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <search-page-pane @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :size="size"
                        :page="page"
                        :total="total"
                        slot="page">
      </search-page-pane>

    </list-table-pane>

    <el-dialog title="编辑VIP运营图标" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" width="600px">
      <video-img-edit @cancel="dialogEditFormVisible=false;editDomainInfo.editDomainId = 0;" :domain-id="editDomainInfo.editDomainId"
                       @save-success-then-new="saveThenNew"
                       @save-success="()=>{this.dialogEditFormVisible=false;fetchData();this.editDomainInfo.editDomainId = 0;}"/>
    </el-dialog>
  </div>
</template>


<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import SearchPane from '../../../components/SearchPane/index.vue';
  import SearchPagePane from '../../../components/SearchPagePane/index.vue';
  import {VideoImgListQuery, VideoImg, Pageable, ResponseResult} from '../../../types';
  import ListTablePane from '../../../components/ListTablePane/index.vue';
  import VideoImgEdit from './edit.vue';
  import {AxiosResponse} from 'axios';
  import {getVideoImgPageList} from '../../../api/passport';
  import BaseList from '../../../components/BaseList';
  import {handlerCommonError} from '../../../utils/auth-interceptor';
  import RightComponent from '../../../components/RightComponent';
  interface EditDomain {
    editDomainId: number | undefined;
  }

  @Component({
    components: {VideoImgEdit, ListTablePane, SearchPane, SearchPagePane},
    filters: {},
    mixins: [BaseList,RightComponent],
  })
  export default class VideoImgList extends Vue {

    dialogEditFormVisible: boolean = false;
    editDomainInfo: EditDomain = {editDomainId: 0};
    data: VideoImg[] = [];
    listQuery: VideoImgListQuery = { page: 0, size: 50, total: 0};

    handleNew() {
      // 创建新用户弹窗
      this.$router.push({path: 'add-video-img', query: {viewModel: 'add'}});
    }

    handleEdit(index: number, row: VideoImg): void {
      this.dialogEditFormVisible = true;
      this.$nextTick(() => this.editDomainInfo.editDomainId = row.id);
    }
    saveThenNew() {
      this.editDomainInfo.editDomainId = 0;
      // @ts-ignore
      this.fetchData();
    }

    realFetchData() {
      return getVideoImgPageList(this.listQuery).then((response: AxiosResponse<ResponseResult<Pageable<VideoImg>>>) => {
        const responseData = response.data.data;
        this.data = responseData.content;
        this.listQuery.page = responseData.number;
        this.listQuery.size = responseData.size;
        this.listQuery.total = responseData.totalElements;
      }).catch(handlerCommonError);
    }

    handleEditLayoutDetail(index: number, row: VideoImg) {
      this.$router.push({path: 'edit-video-img', query: {viewModel: 'edit', id: '' + row.id}});
    }


  }
</script>
