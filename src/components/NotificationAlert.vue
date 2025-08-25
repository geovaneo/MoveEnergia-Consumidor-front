<template>
  <div class="fixed inset-0 flex items-start justify-end p-6 pointer-events-none z-50">
    <div class="flex flex-col space-y-4 w-full max-w-sm">
      <transition-group name="notify-fade">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="pointer-events-auto transform transition-all duration-300"
          :class="{
            'translate-x-0 opacity-100': notification.visible,
            'translate-x-full opacity-0': !notification.visible,
          }"
        >
          <div
            class="rounded-lg shadow-lg p-4 border-l-4"
            :class="notificationClasses(notification.type)"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <span class="text-lg" :class="iconClasses(notification.type)">
                  <mdicon :name="iconName(notification.type)" />
                </span>
              </div>
              <div class="ml-3 w-0 flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p class="mt-1 text-sm text-gray-500" v-if="notification.message">
                  {{ notification.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                  @click="removeNotification(notification.id)"
                >
                  <span class="sr-only">Fechar</span>
                  <mdicon name="close" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { useNotifyStore } from '@/stores/notify'
import { storeToRefs } from 'pinia'

export default {
  name: 'Notify',
  setup() {
    const notifyStore = useNotifyStore()
    const { notifications } = storeToRefs(notifyStore)

    const removeNotification = (id) => {
      notifyStore.remove(id)
    }

    const notificationClasses = (type) => {
      const classes = {
        success: 'bg-green-50 border-green-500',
        error: 'bg-red-50 border-red-500',
        warning: 'bg-yellow-50 border-yellow-500',
        info: 'bg-blue-50 border-blue-500',
      }
      return classes[type] || classes.info
    }

    const iconClasses = (type) => {
      const classes = {
        success: 'text-green-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400',
      }
      return classes[type] || classes.info
    }

    const iconName = (type) => {
      const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        warning: 'alert',
        info: 'information',
      }
      return icons[type] || icons.info
    }

    return {
      notifications,
      removeNotification,
      notificationClasses,
      iconClasses,
      iconName,
    }
  },
}
</script>

<style scoped>
.notify-fade-enter-active,
.notify-fade-leave-active {
  transition: all 0.3s ease;
}

.notify-fade-enter-from,
.notify-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>