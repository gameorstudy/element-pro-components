// 断点配置
const BREAKPOINTS = {
  xs: 0,     // < 768px
  sm: 768,   // ≥ 768px
  md: 992,   // ≥ 992px  
  lg: 1200,  // ≥ 1200px
  xl: 1920   // ≥ 1920px
}

// Grid cols 份数
export const GRID_COLUMNS = 24

// 断点所占的份数
// 覆盖关系：默认 (span) < xs < sm < md < lg < xl
// 特殊情况：未指定默认（span）则显示 24 列
export const defaultColConfig = {
  xs: 24, // <768px
  sm: 24, // >=768px
  md: 12, // >=992px
  lg: 8, // ≥1200px
  xl: 6, // ≥1920px
}

// 断点优先级（从大到小）
export const BREAKPOINT_ORDER = ['xl', 'lg', 'md', 'sm', 'xs']

/**
 * 根据当前宽度获取对应的断点
 * @param {number} width - 当前宽度
 * @returns {string} - 断点名称
 */
const getCurrentBreakpoint = (width) => {
  if (width >= BREAKPOINTS.xl) return 'xl'
  if (width >= BREAKPOINTS.lg) return 'lg'
  if (width >= BREAKPOINTS.md) return 'md'
  if (width >= BREAKPOINTS.sm) return 'sm'
  return 'xs'
}

/**
 * 动态计算当前应占的份数
 * @param {Object} config - 配置对象 {span, xs, sm, md, lg, xl}
 * @returns {number} - 应占的份数
 */
export const calculateCurrentSpan = (config) => {
  const breakpoint = getCurrentBreakpoint(window.innerWidth)
  
  // 按优先级获取配置值
  const breakpoints = BREAKPOINT_ORDER
  const currentIndex = breakpoints.indexOf(breakpoint)
  
  // 按断点优先级查找
  for (let i = currentIndex; i < breakpoints.length; i++) {
    const bp = breakpoints[i]
    if (config[bp]) {
      return config[bp]
    }
  }

  return config.span || GRID_COLUMNS
}
