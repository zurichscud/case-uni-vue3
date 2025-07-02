import type { Goods } from '@/types/menu'

export default function () {
  const getGoodSelectedProps = (good: Goods, type: 'text' | 'ids') => {
    if (good.use_property) {
      const props: string[] = []
      good.property.forEach(({ values }) => {
        values.forEach((value) => {
          if (value.is_default) {
            props.push(type === 'text' ? value.value : value.id)
          }
        })
      })
      return type === 'text' ? props.join(',') : props
    }
    return ''
  }

  return {
    getGoodSelectedProps,
  }
}
