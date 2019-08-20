import {RawLocation} from 'vue-router';
import {Vue} from 'vue/types/vue';
import {Dictionary} from 'vue-router/types/router';
// @ts-ignore
import qs from 'qs';

/**
 * 设置浏览器的地址，并触发记录到tab中。
 * @param com
 * @param listQuery
 */
export function setLocationToHisotry(com: Vue, listQuery: Dictionary<string>, title ?: string): void {
  const path = com.$route.path;
  const newLocation: RawLocation = {};
  const oldRoute = com.$route;
  newLocation.path = oldRoute.path;
  newLocation.query = listQuery;
  newLocation.name = oldRoute.name;
  newLocation.params = oldRoute.params;
  newLocation.hash = oldRoute.hash;
  //history.pushState(null, title, path + '?' + qs.stringify(listQuery, {arrayFormat: 'repeat'}));
  com.$store.dispatch('addVisitedViews', newLocation);
}
