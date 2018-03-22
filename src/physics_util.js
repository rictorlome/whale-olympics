export const randomVec = (length) => {
  const deg = 2 * Math.PI * Math.random();
  return scale([Math.cos(deg), Math.sin(deg)], length);
}
export const specificVec = (deg, speed) => {
  let radians = deg * Math.PI / 180
  let y = Math.sin(radians);
  let x = Math.cos(radians);
  return [x*speed, y*speed]
}
export const scale = (vec, m) => {
  return [vec[0] * m, vec[1] * m];
}

export const speed = (vel) => {
  return Math.sqrt(Math.pow(vel[0],2) + Math.pow(vel[1],2))
}

export const degree = (vel) => {
  return Math.atan2(vel[1],vel[0]) * 180 / Math.PI
}
export const fall = (vel, timeOut) => {
  let x = vel[0]
  let y = vel[1]
  y = y + (.05 * timeOut)
  return [x, y]
}