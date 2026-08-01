type RequestResult = ApiResponseType<null>

type QueueItem = {
  reject: (reason?: unknown) => void
  requestFn: () => Promise<RequestResult>
  resolve: (value: RequestResult | PromiseLike<RequestResult>) => void
}

class RequestPool {
  //最大并发数
  max: number = 10
  //当前并发活跃数
  activity: number = 0
  //并发队列
  private queue: QueueItem[] = []
  
  constructor(max: number) {
    this.max = max
  }

  add(requestFn: () => Promise<RequestResult>): Promise<RequestResult> {
    return new Promise<RequestResult>((resolve, reject) => {
      this.queue.push({
        reject,
        resolve,
        requestFn,
      })
      this._next()
    })
  }

  private _next(): void {
    // 达到最大并发或队列为空，则返回
    if (this.activity >= this.max || this.queue.length === 0) {
      return;
    }

    // 从队头取出一个任务
    const { requestFn, resolve, reject } = this.queue.shift()!;
    this.activity++;

    requestFn()
      .then((result) => {
        resolve(result);        // 将结果传递给外部 Promise 的 resolve
      })
      .catch((error) => {
        reject(error);          // 将错误传递给外部 Promise 的 reject
      })
      .finally(() => {
        this.activity--;
        this._next();           // 当前任务完成，尝试执行下一个
      });
  }
}

export default RequestPool