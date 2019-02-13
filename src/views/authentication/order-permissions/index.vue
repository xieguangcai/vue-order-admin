<template>
  <div>
    <list-table-pane>
      <search-pane slot="searchpane" @click="refetchData">
        来源
        <el-select size="mini" v-model="listQuery.sourceType">
          <el-option value="1" label="本地数据库（默认）"/>
          <el-option value="2" label="第三方接口"/>
        </el-select>
        <el-select size="mini" v-model="listQuery.accountType">
          <el-option value="1" label="酷开OpenId"/>
          <el-option value="2" label="第三方OpenId"/>
        </el-select>
        <el-input v-model="listQuery.openId" size="mini" :clearable="true"></el-input>
        权益类型
        <el-select size="mini" v-model="listQuery.permissionsType">
          <el-option value="1" label="会员权益"/>
          <el-option value="2" label="影片权益"/>
        </el-select>
        <span v-if="listQuery.permissionsType === '2'">
          影片ID<el-input v-model="listQuery.movieId" size="mini" :clearable="true"></el-input>
        </span>
        <span v-if="listQuery.permissionsType === '1'">
          服务类型
        <el-input v-model="listQuery.sourceSign" size="mini" style="width:180px;" :clearable="true"></el-input>
        </span>
      </search-pane>
      <el-table v-loading="listLoading" height="600" style="width: 100%"
                :data="data"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row>
        <el-table-column align="left" label="酷开OpenId" width="200" fixed>
          <template slot-scope="scope">
            <div>
              {{ scope.row.coocaaOpenId }}<br >
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="第三方OpenId" width="200">
          <template slot-scope="scope">
            <div>
              {{ scope.row.thirdOpenId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="影片ID" width="120" v-if="listQuery.permissionsType == '2'">
          <template slot-scope="scope">
            <div>
              {{ scope.row.movieId }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="影片名称" width="120" v-if="listQuery.permissionsType == '2'">
          <template slot-scope="scope">
            <div>
              {{ scope.row.movieName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="left" label="权益开始时间" width="200">
          <template slot-scope="scope">
            <div>
              {{ scope.row.startDate}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="权益结束时间" width="200">
          <template slot-scope="scope">
            <div>
              {{ scope.row.endDate}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            <div>
              {{ scope.row.createDate}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后修改时间" width="200">
          <template slot-scope="scope">
            <div>
              {{ scope.row.modifyDate}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </list-table-pane>
  </div>
</template>


<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import SearchPane from '../../../components/SearchPane/index.vue';
import SearchPagePane from '../../../components/SearchPagePane/index.vue';
import {
  OrderPermissionListQuery, OrderPermissionsInfo,
  ResponseResult,
} from '../../../types';
import ListTablePane from '../../../components/ListTablePane/index.vue';
import {AxiosResponse} from 'axios';
import BaseList from '../../../components/BaseList';
import {handlerCommonError} from '../../../utils/auth-interceptor';
import {isNotEmpty} from '../../../utils/validate';
import {getOrderPermissionsInfo} from "../../../api/authentication";

@Component({
  components: {ListTablePane, SearchPane, SearchPagePane},
  filters: {},
  mixins: [BaseList],
})
export default class OrderPermissionsList extends Vue {

  data: OrderPermissionsInfo[] = [];
  listQuery: OrderPermissionListQuery = {sourceType: '1', accountType: '1', productType:'1',page: 0, size: 50, total: 0};

  onCreated() {
    // @ts-ignore
    this.needLoadOnCreate = false;
  }

  realFetchData() {
    return getOrderPermissionsInfo(this.listQuery).then((response: AxiosResponse<ResponseResult<OrderPermissionsInfo[]>>) => {
      this.data = response.data.data;
    }).catch(handlerCommonError);
  }

  validSearchCondition(): boolean {
    if (!isNotEmpty(this.listQuery.openId)) {
      this.$message.error('必须输入查询的账号信息');
      return false;
    }
    return true;
  }
}
</script>
