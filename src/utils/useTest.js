class howr {
  constructor() {
    this.a = 1;
  }
  setA(value) {
    if (value) {
      this.a = value;
    }
    return this.a;
  }
}
class test {
  constructor() {
    this._progress = ref(0);
    this.asdf = null;
    this.init();
  }
  init() {
    this.asdf = new howr();
    setInterval(() => {
      this._progress.value = this.seek();
    }, 1000);
  }
  seek(v) {
    return this.asdf.setA(v);
  }
  get progress() {
    return this._progress;
  }
  set progress(value) {
    console.log(123);
    this.seek(value);
    this._progress.value = value;
  }
}

let p = new test();
p = reactive(
  new Proxy(p, {
    set(target, prop, val) {
      target[prop] = val;
      return true;
    },
  })
);
const s = reactive({ p });
export default s;
