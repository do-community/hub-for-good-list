<!--
Copyright 2020 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

<template>
    <div class="do-bulma hub-for-good-list">
        <form autocomplete="on" @submit.prevent="">
            <div class="input-container">
                <label for="input_search" class="hidden">{{ i18n.templates.app.search }}</label>
                <i class="fas fa-search"></i>
                <input id="input_search"
                       v-model="filter"
                       class="input"
                       type="text"
                       :placeholder="i18n.templates.app.search"
                />
            </div>
        </form>

        <div class="panel">
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>{{ i18n.templates.app.projectName }}</th>
                            <th>{{ i18n.templates.app.projectLink }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="filtered.length">
                            <tr v-for="project in filtered" :key="project.id">
                                <td>{{ project.name }}</td>
                                <td>{{ project.link }}</td>
                            </tr>
                        </template>
                        <tr v-else>
                            <td colspan="2">
                                {{ i18n.templates.app.noResults }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import i18n from '../i18n';
    import data from '../../build/data';

    export default {
        name: 'App',
        data() {
            return {
                i18n,
                filter: '',
            };
        },
        computed: {
            filtered() {
                return data.filter(this.filterProject);
            },
        },
        methods: {
            filterProject(project) {
                if (this.$data.filter.trim() === '') return true;

                const query = this.$data.filter.trim().toLowerCase();
                if (project.name && project.name.toLowerCase().includes(query)) return true;
                if (project.link && project.link.toLowerCase().includes(query)) return true;

                return false;
            },
        },
    };
</script>
