/**
 * @desc 判断持久化配置是否合法
 * @param {String} persistenceType 存储类型
 * @param {String} persistenceKey 存储键值
 * @returns 
 */
export function validatePersistenceConfig(persistenceType, persistenceKey) {
  const validPersistenceTypes = ['localStorage', 'sessionStorage']
  
  // 验证 persistenceType
  if (!validPersistenceTypes.includes(persistenceType)) {
    console.warn(
      `[ProTable warn]: persistenceType should be one of ${validPersistenceTypes.join(', ')}`
    );
    return false
  }
  
  // 验证 persistenceKey
  if (!persistenceKey || typeof persistenceKey !== 'string' || persistenceKey.trim() === '') {
    console.warn('[ProTable warn]: persistenceKey should be a non-empty string');
    return false
  }
  
  return true
}