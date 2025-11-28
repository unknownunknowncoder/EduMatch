<!-- 关联资源信息 -->
            <div v-if="plan.resourceName || plan.resourceUrl" class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="flex items-start space-x-2">
                <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {{ plan.resourceName || '关联资源' }}
                  </p>
                  <a 
                    v-if="plan.resourceUrl && plan.resourceUrl.trim() !== ''"
                    :href="plan.resourceUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    访问资源
                  </a>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400">
                    无资源链接
                  </span>
                </div>
              </div>
            </div>