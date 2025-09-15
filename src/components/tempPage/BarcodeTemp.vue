<template>
  <div>
    <svg :id="svgId"></svg>
  </div>
</template>

<script>
import { onMounted, watch, ref } from 'vue'
import JsBarcode from 'jsbarcode'

export default {
  props: {
    // Dados do código de barras
    barCodeData: {
      type: String,
      required: true,
      default: '',
    },

    barCodeTextLine: {
      type: String,
      required: false,
      default: '',
    },

    displayValue: {
      type: Boolean,
      default: false,
    },

    // Formato do código de barras
    format: {
      type: String,
      default: 'CODE128',
    },

    // Cor do texto
    textColor: {
      type: String,
      default: '#000000',
    },

    // Tamanho da fonte
    fontSize: {
      type: Number,
      default: 16,
    },

    width: {
      type: Number,
      default: 1,
    },

    height: {
      type: Number,
      default: 60,
    },
  },

  setup(props) {
    // Gerar um ID único para cada instância do componente
    const svgId = ref(`barcode-svg-${Math.random().toString(36).substr(2, 9)}`)

    const generateBarcode = () => {
      if (!props.barCodeData) return

      try {
        JsBarcode(`#${svgId.value}`, props.barCodeData, {
          format: props.format,
          displayValue: props.displayValue,
          fontSize: props.fontSize,
          textMargin: 4,
          text: props.barCodeTextLine,
          lineColor: '#000000',
          textColor: props.textColor,
          height: props.height,
          width: props.width,
          margin: 5,
        })
      } catch (error) {
        console.error('Erro ao gerar código de barras:', error)
      }
    }

    onMounted(() => {
      generateBarcode()
    })

    watch(
      () => props.barCodeData,
      () => {
        generateBarcode()
      }
    )

    watch(
      () => props.format,
      () => {
        generateBarcode()
      }
    )

    watch(
      () => props.textColor,
      () => {
        generateBarcode()
      }
    )

    watch(
      () => props.fontSize,
      () => {
        generateBarcode()
      }
    )

    return {
      svgId,
    }
  },
}
</script>