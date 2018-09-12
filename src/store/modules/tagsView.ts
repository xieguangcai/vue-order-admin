import {VuexModule, Module, MutationAction, Mutation, Action, getModule} from 'vuex-module-decorators';
import {Route} from 'vue-router';
import store from '@/store';
import {ActionContext} from 'vuex';

export interface ITagsViewState {
  visitedViews: Route[];
  cachedViews: string[];
}

@Module({dynamic: true, store, name: 'tagsView'})
class TagsView extends VuexModule {
  visitedViews: ITagsViewState['visitedViews'] = [];
  cachedViews: ITagsViewState['cachedViews'] = [];

  @Mutation
  ADD_VISITED_VIEWS(view: Route) {
    if (this.visitedViews.some((v) => v.path === view.path)) {
      return;
    }
    this.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name',
      })
    );
    if (!view.meta.noCache) {
      this.cachedViews.push(view.name || '');
    }
  }

  @Mutation
  DEL_VISITED_VIEWS(view: Route) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews.splice(i, 1);
        break;
      }
    }
    for (const i of this.cachedViews) {
      if (i === view.name) {
        const index = this.cachedViews.indexOf(i);
        this.cachedViews.splice(index, 1);
        break;
      }
    }
  }

  @Mutation
  DEL_OTHERS_VIEWS(view: Route) {
    for (const [i, v] of this.visitedViews.entries()) {
      if (v.path === view.path) {
        this.visitedViews = this.visitedViews.slice(i, i + 1);
        break;
      }
    }
    for (const i of this.cachedViews) {
      if (i === view.name) {
        const index = this.cachedViews.indexOf(i);
        this.cachedViews = this.cachedViews.slice(index, index + 1);
        break;
      }
    }
  }

  @Mutation
  DEL_ALL_VIEWS() {
    this.visitedViews = [];
    this.cachedViews = [];
  }

  @Action({commit: 'ADD_VISITED_VIEWS'})
  addVisitedViews(view: Route) {
    return view;
  }

  @Action
  delVisitedViews({commit, state}: ActionContext<ITagsViewState, any>, view: Route) {
    return new Promise((resolve) => {
      commit('DEL_VISITED_VIEWS', view);
      resolve([...state.visitedViews]);
      return view;
    });
  }

  @Action
  delOthersViews({commit, state}: ActionContext<ITagsViewState, any>, view: Route) {
    return new Promise((resolve) => {
      commit('DEL_OTHERS_VIEWS', view);
      resolve([...state.visitedViews]);
      return view;
    });
  }

  @Action
  delAllViews({commit, state}: ActionContext<ITagsViewState, any>) {
    return new Promise((resolve) => {
      commit('DEL_ALL_VIEWS');
      resolve([...state.visitedViews]);
    });
  }
}

export const TagsViewModule = getModule(TagsView.prototype);
