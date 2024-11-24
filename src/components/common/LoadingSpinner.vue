<template>
  <div
    class="loading-spinner"
    :class="[`loading-spinner--${size}`, center && 'loading-spinner--centered']"
  >
    <v-progress-circular
      :size="sizeMap[size]"
      :width="strokeMap[size]"
      :color="color"
      indeterminate
    >
    </v-progress-circular>
    <span v-if="showLabel" class="loading-spinner__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large'
  color?: string
  label?: string
  showLabel?: boolean
  center?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'primary',
  label: 'Loading...',
  showLabel: false,
  center: true,
})

const sizeMap = {
  small: 24,
  medium: 36,
  large: 48,
}

const strokeMap = {
  small: 2,
  medium: 3,
  large: 4,
}
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner--centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-spinner__label {
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.loading-spinner--small {
  min-height: 24px;
}

.loading-spinner--medium {
  min-height: 36px;
}

.loading-spinner--large {
  min-height: 48px;
}
</style>
