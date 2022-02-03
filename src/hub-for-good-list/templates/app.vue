<!--
Copyright 2022 DigitalOcean

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
                <input
                    id="input_search"
                    v-model="filter"
                    class="input"
                    type="text"
                    :placeholder="i18n.templates.app.search"
                />
                <VueSelect
                    v-model="purpose"
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
                            <th class="project">
                                {{ i18n.templates.app.projectNameLink }}
                            </th>
                            <th class="purpose">
                                {{ i18n.templates.app.projectPurpose }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="filtered.length">
                            <tr v-for="project in filtered" :key="project.id">
                                <td class="project">
                                    {{ project.name }}
                                    <br />
                                    <a :href="project.link[0].url" target="_blank" rel="noopener">
                                        {{ project.link[0].text }}
                                    </a>
                                </td>
                                <td class="purpose">
                                    {{ purposeMap[project.purpose][0] }}
                                </td>
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
    import linkify from 'linkify-it';
    import tlds from 'tlds';
    import VueSelect from 'vue-select';
    import i18n from '../i18n';
    import data from '../../build/data';

    // Start linkify
    const Linkify = linkify();
    Linkify.tlds(tlds).set({ fuzzyIP: true, fuzzyEmail: false });

    // Purpose categories and their names
    const purposeMap = {
        improve_health_and_education:   [i18n.templates.app.improveHealthAndEducation, 0],
        reduce_inequality:              [i18n.templates.app.reduceInequality, 0],
        spur_economic_growth:           [i18n.templates.app.spurEconomicGrowth, 0],
        fighting_virus:                 [i18n.templates.app.fightingVirus, 0],
        remote_learning:                [i18n.templates.app.remoteLearning, 0],
        quarantined_life:               [i18n.templates.app.quarantinedLife, 0],
        small_businesses:               [i18n.templates.app.smallBusinesses, 0],
        other:                          [i18n.templates.app.otherPurposes, 0],
    };
    const validPurposes = Object.keys(purposeMap);

    // Parse links in project & standardise purposes
    const projectData = data.map(project => {
        const link = Linkify.match(project.link);
        if (link === null) return null;

        const purpose = validPurposes.includes(project.purpose) ? project.purpose : 'other';
        purposeMap[purpose][1]++;
        return {
            ...project,
            link,
            purpose,
        };
    }).filter(project => project !== null);

    // Create the data for the purposes filter
    const getFilterPurposes = () => {
        const nameValue = (name, value) => `${name} ${value > 0 ? `(${value.toLocaleString()})` : ''}`;

        return [
            {
                label: nameValue(i18n.templates.app.allProjects, projectData.length),
                value: 'all',
            },
            ...validPurposes.map(purpose => ({
                label: nameValue(...purposeMap[purpose]),
                value: purpose,
            })),
        ];
    };
    const initialFilterPurposes = getFilterPurposes();

    export default {
        name: 'App',
        components: {
            VueSelect,
        },
        data() {
            return {
                i18n,
                filter: '',
                purpose: initialFilterPurposes[0].value,
                purposes: initialFilterPurposes,
                purposeMap,
                total: projectData.length.toLocaleString(),
            };
        },
        computed: {
            filtered() {
                return projectData.filter(this.filterProject);
            },
        },
        watch: {
            filter() {
                validPurposes.forEach(purpose => purposeMap[purpose][1] = 0);
                projectData.forEach(project => this.filterQuery(project) && purposeMap[project.purpose][1]++);
                this.$data.purposes = getFilterPurposes();
            },
        },
        methods: {
            filterQuery(project) {
                const query = this.$data.filter.trim().toLowerCase();

                if (query === '') return true;
                if (project.name && project.name.toLowerCase().includes(query)) return true;
                if (project.link && project.link[0].text.toLowerCase().includes(query)) return true;

                return false;
            },
            filterProject(project) {
                if (this.$data.purpose !== 'all' && this.$data.purpose !== project.purpose) return false;
                if (this.filterQuery(project)) return true;

                return false;
            },
        },
    };
</script>
