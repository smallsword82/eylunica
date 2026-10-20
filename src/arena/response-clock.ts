/** Monotonic foreground time. Any interruption disqualifies a speed record. */
export class ResponseClock {
  private total = 0;
  private since = 0;
  private active = false;
  private valid = true;
  reset(now: number, active: boolean) {
    this.total = 0;
    this.since = now;
    this.active = active;
    this.valid = active;
  }
  update(now: number, active: boolean) {
    if (this.active) this.total += Math.max(0, now - this.since);
    if (!active) this.valid = false;
    this.active = active;
    this.since = now;
  }
  read(now: number) {
    return { elapsedMs: this.total + (this.active ? Math.max(0, now - this.since) : 0), timingValid: this.valid && this.active };
  }
}
