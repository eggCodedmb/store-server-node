/**
 * 根据积分计算会员等级 (1-10级)
 * 积分门槛：
 * V1: 0 - 99
 * V2: 100 - 499
 * V3: 500 - 999
 * V4: 1000 - 1999
 * V5: 2000 - 4999
 * V6: 5000 - 9999
 * V7: 10000 - 19999
 * V8: 20000 - 49999
 * V9: 50000 - 99999
 * V10: 100000+
 * 
 * @param {number} points 积分
 * @returns {number} 等级 (1-10)
 */
function calculateLevel(points) {
  const pts = Number(points) || 0;
  if (pts >= 100000) return 10;
  if (pts >= 50000) return 9;
  if (pts >= 20000) return 8;
  if (pts >= 10000) return 7;
  if (pts >= 5000) return 6;
  if (pts >= 2000) return 5;
  if (pts >= 1000) return 4;
  if (pts >= 500) return 3;
  if (pts >= 100) return 2;
  return 1;
}

module.exports = {
  calculateLevel,
};
