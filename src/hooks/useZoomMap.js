import { zoom, zoomIdentity } from 'd3-zoom'
import { useMapStore } from '@/store/map'
const store = useMapStore()
let zoomer
/**
 * 使图具有缩放能力
 */
const registerZoom = () => {
  const selections = store.selections
  const { mainG, mainSvg } = selections
  zoomer = zoom().on('zoom', event => {
    mainG.attr('transform', event.transform)
  }).scaleExtent([0.1, 4])
  // .translateExtent([[-1000, -1000], [1000, 800]])
  zoomer(selections.mainSvg)
  mainSvg.on('dblclick.zoom', null)
}
/**
 * 使导图适应当前屏幕大小
 */
const fitView = () => {
  const refs = store.refs
  const selections = store.selections
  if (!zoomer) return
  const gMetrics = refs.mainG.getBBox()
  const svgMetrics = refs.mainSvg.getBoundingClientRect()

  // 计算缩放尺度
  // [+20]的目的是留出一部分边界空隙
  const scale = Math.min(svgMetrics.width / (gMetrics.width + 40), svgMetrics.height / (gMetrics.height + 20))

  // 计算移动的中心
  const svgCenter = { x: svgMetrics.width / 2, y: svgMetrics.height / 2 }
  const gCenter = { x: gMetrics.width * scale / 2, y: gMetrics.height * scale / 2 }
  const center = zoomIdentity.translate(
    -gMetrics.x * scale + svgCenter.x - gCenter.x,
    -gMetrics.y * scale + svgCenter.y - gCenter.y
  ).scale(scale)
  selections.mainSvg.transition().duration(500).call(zoomer.transform, center)
}

export default { registerZoom, fitView }
