<template>
    <div v-if="isLoaded" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-8xl mx-auto select-none">
        <!-- Resources Stat -->
        <div class="p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">Risorse</div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-500">
                        {{ allMetrics?.resources?.galleria }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">Gallerie</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-red-500">{{ allMetrics?.resources?.video }}</div>
                    <div class="text-xs text-gray-500 mt-1">Video</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-orange-500">{{ allMetrics?.resources?.news }}</div>
                    <div class="text-xs text-gray-500 mt-1">Post</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-500">
                        {{ allMetrics?.resources?.carosello }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">Caroselli</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-indigo-500">{{ allMetrics?.resources?.storia }}</div>
                    <div class="text-xs text-gray-500 mt-1">Storie</div>
                </div>
                <div class="text-center col-span-2 md:col-span-1">
                    <div class="text-2xl font-bold text-gray-700">{{ allMetrics?.resources?.total }}</div>
                    <div class="text-xs text-gray-500 mt-1">Totale</div>
                </div>
            </div>
        </div>
        <!-- Posts Stat -->
        <div v-if="isLoaded"
            class="p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-4">Post</div>
            <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                    <div class="text-2xl font-bold text-red-600">{{ allMetrics?.posts?.total }}</div>
                    <div class="text-xs text-gray-500 mt-1">Post totali</div>
                </div>
                <div v-if="isLoaded" class="text-center">
                    <div class="text-xs font-semibold text-gray-500 mb-2">Top Hashtags</div>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="tag in allMetrics?.posts?.trending_hashtags" :key="tag"
                            class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">{{ tag }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="col-span-full p-6 bg-white rounded-xl shadow-md animate-pulse">
            <div class="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div class="h-12 bg-gray-300 rounded col-span-1"></div>
                <div class="h-12 bg-gray-300 rounded col-span-1"></div>
                <div class="h-12 bg-gray-300 rounded col-span-1"></div>
                <div class="h-12 bg-gray-300 rounded col-span-1"></div>
                <div class="h-12 bg-gray-300 rounded col-span-1"></div>
                <div class="h-12 bg-gray-300 rounded col-span-full"></div>
            </div>
        </div>
        <!-- Users Section -->
        <div v-if="isLoaded"
            class="p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div class="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Utenti (ruolo)</div>
            <div class="flex flex-col gap-3">
                <div v-for="(role, index) in allMetrics?.users?.users_by_role" :key="index"
                    class="flex justify-between pb-2 border-b border-gray-200 text-sm last:border-b-0">
                    <span>{{ index }}</span>
                    <span class="font-semibold text-blue-500">{{ role }}</span>
                </div>
            </div>
        </div>
        <div v-else class="col-span-full p-6 bg-white rounded-xl shadow-md animate-pulse">
            <div class="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div class="flex flex-col gap-3">
                <div class="h-6 bg-gray-300 rounded w-full"></div>
                <div class="h-6 bg-gray-300 rounded w-full"></div>
                <div class="h-6 bg-gray-300 rounded w-full"></div>
                <div class="h-6 bg-gray-300 rounded w-full"></div>
                <div class="h-6 bg-gray-300 rounded w-full"></div>
            </div>
        </div>
    </div>
    <div v-else class="col-span-full p-6 bg-white rounded-xl shadow-md animate-pulse">
        <div class="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div class="h-12 bg-gray-300 rounded col-span-1"></div>
            <div class="h-12 bg-gray-300 rounded col-span-1"></div>
            <div class="h-12 bg-gray-300 rounded col-span-1"></div>
            <div class="h-12 bg-gray-300 rounded col-span-1"></div>
            <div class="h-12 bg-gray-300 rounded col-span-1"></div>
            <div class="h-12 bg-gray-300 rounded col-span-full"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Globals } from 'src/interfaces/globals';
import { inject, onMounted, ref } from 'vue';
import type { EventBus } from 'quasar';
import { handleStatus } from 'src/helpers/errors';
import type { Metrics } from '../../interfaces/metrics';
import { all } from 'axios';

const globals = inject('globals') as Globals;
const bus = inject<EventBus>('bus');
const useMetricsStore = globals?.stores?.metrics;
const allMetrics = ref<Metrics | null>(null);
const isLoaded = ref(false);

const getResourcesMetrics = async () => {
    return await useMetricsStore
        ?.fetchResourcesMetrics()
        .then((res) => {
            allMetrics.value = {
                ...allMetrics.value,
                resources: res?.resources ?? null,
            } as Metrics;
        })
        .catch((err) => {
            handleStatus(err, bus!);
        });
};

const getUsersMetrics = async () => {
    return await useMetricsStore
        ?.fetchUsersMetrics()
        .then((res) => {
            allMetrics.value = {
                ...allMetrics.value,
                users: res?.users ?? null,
            } as Metrics;
        })
        .catch((err) => {
            handleStatus(err, bus!);
        });
};
const getPostMetrics = async () => {
    return await useMetricsStore
        ?.fetchPostsMetrics()
        .then((res) => {
            allMetrics.value = {
                ...allMetrics.value,
                posts: res?.posts ?? null,
            } as Metrics;
        })
        .catch((err) => {
            handleStatus(err, bus!);
        });
};

onMounted(async () => {
    await all([getResourcesMetrics(), getUsersMetrics(), getPostMetrics()]);
    isLoaded.value = true;
});
</script>
