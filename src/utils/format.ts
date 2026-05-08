import { colors } from '../const/colors'

export const getColorForIndex = (index: number) => {
  return colors[index % colors.length]
}

export const formatSize = (bytes: number): string => {
  if (bytes > 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`
  } else if (bytes > 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`
  } else if (bytes > 1024) {
    return `${(bytes / 1024).toFixed(2)}KB`
  } else {
    return `${bytes}B`
  }
}
