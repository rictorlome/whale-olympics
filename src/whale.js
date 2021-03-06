import { MovingObject } from './moving_object'
import * as PhysUtil from './physics_util'

export class Whale extends MovingObject {
  constructor(option) {
    option.vel = PhysUtil.specificVec(40, .5);
    super(option)
    this.lastUnderwater = false;
    this.underwater = false;
    this.timeOut = 0;
    this.angle = 0;
    this.flipangle = 0;
    this.framecount = 0;
    this.waterline = 8755;
    this.smooth = document.getElementById('smoothsplash')
    this.rock = document.getElementById('rocksplash')
  }
  accelerate() {
    if (this.underwater && Math.abs(this.vel[0]) < 10) {
      this.vel = PhysUtil.scale(this.vel, 1.20)
    }
  }
  decelerate() {
    if (this.underwater) this.vel = PhysUtil.scale(this.vel, .8)
  }
  nudge() {
    this.vel = [.3,-.3]
  }
  turnLeft() {
    let degree = PhysUtil.degree(this.vel)
    let speed = PhysUtil.speed(this.vel)
    if (this.underwater) {
      this.turningL = false;
      this.turningR = false;
      this.vel = PhysUtil.specificVec((degree-25 % 360), speed)
    } else {
      this.flipangle = this.flipangle - 15;
      this.angle = (this.angle - 15) % 360;
    }
  }
  turnRight() {
    let degree = PhysUtil.degree(this.vel)
    let speed = PhysUtil.speed(this.vel)
    if (this.underwater) {
      this.vel = PhysUtil.specificVec((degree+25 % 360), speed)
    } else {
      this.flipangle = this.flipangle + 15;
      this.angle = (this.angle + 15) % 360;
    }
  }
  freeze() {
    this.vel = [0,0]
  }
  checkTimeout() {
    let depth = this.pos[1];
    if (depth > this.waterline) {
      if (!this.lastUnderwater) this.checkLanding();
      this.underwater = true;
      this.timeOut = 0;
      this.flipangle = this.angle
    } else {
      this.underwater = false;
      this.timeOut++;
    }
  }

  checkLanding() {
    let deg = PhysUtil.degree(this.vel);
    const speed = PhysUtil.speed(this.vel);
    let diff;
    this.angle > 0 ? diff = Math.abs(this.angle%360 - deg) : diff = Math.abs(360 + (this.angle%360) - deg)
    if (diff > 30 && this.vel[1] > 2) {
      this.vel[0] /= 10;
      this.vel[1] /= 10;
      this.rock.volume = Math.min(speed / 50, 1)
      this.rock.play()
    } else {
      this.smooth.volume = Math.min(speed / 50,1)
      this.smooth.play()
    }
  }

  checkWipeout() {
    let depth = this.pos[1];
    if (depth > 9600) {
      this.vel[0] = .4;
      this.vel[1] = -2;
    }
  }
  move() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.lastUnderwater = this.underwater;

    this.checkTimeout();
    this.checkWipeout();
    if (this.underwater) {
      this.angle = PhysUtil.averageAngle(this.angle, PhysUtil.degree(this.vel));
      this.vel = PhysUtil.slow(this.vel,this.pos[1]);
    } else {
      this.vel = PhysUtil.fall(this.vel,this.timeOut);
    }
  }
}
