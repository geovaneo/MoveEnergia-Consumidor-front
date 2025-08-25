import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotifyStore = defineStore('notify', () => {
  const notifications = ref([]);
  let nextId = 1;

  // Adicionar uma nova notificação
  const show = (notification) => {
    const id = nextId++;
    const duration = notification.duration || 5000;

    const newNotification = {
      id,
      title: notification.title || '',
      message: notification.message || '',
      type: notification.type || 'info',
      duration,
      visible: true
    };

    notifications.value.push(newNotification);

    // Remover automaticamente após a duração especificada
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }

    return id;
  };

  // Remover uma notificação
  const remove = (id) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      // Primeiro marca como invisível para a animação
      notifications.value[index].visible = false;

      // Depois remove completamente após a animação
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id);
      }, 300);
    }
  };

  // Métodos de conveniência para diferentes tipos de notificação
  const success = (title, message, duration = 5000) => {
    return show({ title, message, type: 'success', duration });
  };

  const error = (title, message, duration = 5000) => {
    return show({ title, message, type: 'error', duration });
  };

  const warning = (title, message, duration = 5000) => {
    return show({ title, message, type: 'warning', duration });
  };

  const info = (title, message, duration = 5000) => {
    return show({ title, message, type: 'info', duration });
  };

  return {
    notifications,
    show,
    remove,
    success,
    error,
    warning,
    info
  };
});