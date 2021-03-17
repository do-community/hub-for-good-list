/*
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
*/

import './scss/style';

import Vue from 'vue';
import App from './templates/app.vue';
import i18n from './i18n';

document.head.title = i18n.templates.app.title;

document.querySelectorAll('[data-hub-for-good-list]').forEach(elm => {
    new Vue({
        render: h => h(App),
    }).$mount(elm);
});
