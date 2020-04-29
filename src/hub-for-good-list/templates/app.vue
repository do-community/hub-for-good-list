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
                <VueSelect v-model="purpose"
                           :options="purposes"
                           :reduce="purp => purp.value"
                           :clearable="false"
                           :searchable="false"
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
                            <th>{{ i18n.templates.app.projectPurpose }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="filtered.length">
                            <tr v-for="project in filtered" :key="project.id">
                                <td>{{ project.name }}</td>
                                <td>
                                    <a :href="project.link[0].url" target="_blank" rel="noopener">
                                        {{ project.link[0].text }}
                                    </a>
                                </td>
                                <td>
                                    {{ project.purposeTitle }}
                                    <template v-if="project.purposeOther">
                                        <br /><small>{{ project.purposeOther }}</small>
                                    </template>
                                </td>
                            </tr>
                        </template>
                        <tr v-else>
                            <td colspan="3">
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
    import linkify from 'linkify-it';
    import tlds from 'tlds';
    import VueSelect from 'vue-select';
    import i18n from '../i18n';
    import data from '../../build/data';

    const Linkify = linkify();
    Linkify.tlds(tlds).set({ fuzzyIP: true, fuzzyEmail: false });

    const purposeMap = {
        fighting_virus: 'Fights the virus',
        remote_learning: 'Enables remote learning and education',
        quarantined_life: 'Supports quarantined life',
        small_businesses: 'Helps small bussinesses impacted by the virus',
        other: 'Other purposes',
    };
    const validPurposes = Object.keys(purposeMap);

    const projectData = data.map(project => ({
        ...project,
        link: Linkify.match(project.link),
        purpose: validPurposes.includes(project.purpose) ? project.purpose : 'other',
        purposeTitle: purposeMap[validPurposes.includes(project.purpose) ? project.purpose : 'other'],
        purposeOther: !validPurposes.includes(project.purpose) && ! project.purposeOther ? project.purpose : project.purposeOther,
    })).filter(project => project.link !== null);

    const filterPurposes = [
        { label: 'All projects', value: 'all' },
        ...validPurposes.map(purpose => ({ label: purposeMap[purpose], value: purpose })),
    ];

    export default {
        name: 'App',
        components: {
            VueSelect,
        },
        data() {
            return {
                i18n,
                filter: '',
                purpose: filterPurposes[0].value,
                purposes: filterPurposes,
            };
        },
        computed: {
            filtered() {
                return projectData.filter(this.filterProject);
            },
        },
        methods: {
            filterProject(project) {
                if (this.$data.purpose !== 'all' && this.$data.purpose !== project.purpose) return false;
                if (this.$data.filter.trim() === '') return true;

                const query = this.$data.filter.trim().toLowerCase();
                if (project.name && project.name.toLowerCase().includes(query)) return true;
                if (project.link && project.link[0].text.toLowerCase().includes(query)) return true;

                return false;
            },
        },
    };
</script>
